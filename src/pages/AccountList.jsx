import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, CopyOutlined, DeleteOutlined, LockOutlined, MailOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, List, message, Modal, Popconfirm, Row, Space, Statistic, Switch, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { accountApi } from '../services/api';
import { copyToClipboard, formatTimestamp, getFullName, isAccountExpired, isMobile, isSmallMobile } from '../utils';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getAccountLoading, setGetAccountLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    used: 0,
    available: 0
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [mobile, setMobile] = useState(isMobile());

  // 监听窗口大小变化，更新移动设备状态
  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 获取账号列表
  const fetchAccounts = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const response = await accountApi.getUserAccounts(page, pageSize);

      if (response.status === 'success') {
        setAccounts(response.accounts || []);

        // 更新分页信息
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total
        });

        // 计算统计数据
        const used = response.accounts.filter(acc => acc.is_used === 1).length;
        const available = response.accounts.length - used;

        setStats({
          total: response.total,
          used: used,
          available: available
        });
      } else {
        message.error(response.message || '获取账号列表失败');
      }
    } catch (error) {
      console.error('获取账号列表失败:', error);
      message.error('获取账号列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 处理表格分页变化
  const handleTableChange = (paginationInfo) => {
    fetchAccounts(paginationInfo.current, paginationInfo.pageSize);
  };

  // 获取新账号
  const getNewAccount = async () => {
    try {
      setGetAccountLoading(true);
      const response = await accountApi.getAccount();

      if (response.status === 'success') {
        message.success('获取新账号成功');
        // 显示账号详情
        setSelectedAccount(response.account);
        setModalVisible(true);
        // 刷新账号列表，回到第一页
        fetchAccounts(1, pagination.pageSize);
      } else {
        message.error(response.message || '获取新账号失败');
      }
    } catch (error) {
      console.error('获取新账号失败:', error);
      message.error('获取新账号失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setGetAccountLoading(false);
    }
  };

  // 更新账号状态
  const updateAccountStatus = async (accountId, isUsed) => {
    try {
      const response = await accountApi.updateAccountStatus(accountId, isUsed ? 1 : 0);

      if (response.status === 'success') {
        message.success('账号状态已更新');
        // 更新本地账号列表
        setAccounts(accounts.map(acc =>
          acc.id === accountId ? { ...acc, is_used: isUsed ? 1 : 0 } : acc
        ));

        // 更新统计数据
        const used = isUsed
          ? stats.used + 1
          : stats.used - 1;
        const available = stats.total - used;

        setStats({ ...stats, used, available });
      } else {
        message.error(response.message || '更新账号状态失败');
      }
    } catch (error) {
      console.error('更新账号状态失败:', error);
      message.error('更新账号状态失败: ' + (error.response?.data?.message || error.message));
    }
  };

  // 复制账号信息
  const copyAccountInfo = (account) => {
    const info = `邮箱: ${account.email}\n密码: ${account.password}\n姓名: ${getFullName(account.first_name, account.last_name)}\n过期时间: ${formatTimestamp(account.expire_time)}`;

    copyToClipboard(info)
      .then(() => {
        message.success('账号信息已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 复制单个字段
  const copyField = (text) => {
    copyToClipboard(text)
      .then(() => {
        message.success('已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 删除账号（逻辑删除）
  const deleteAccount = async (accountId) => {
    try {
      const response = await accountApi.deleteAccount(accountId);

      if (response.status === 'success') {
        message.success('账号已删除');
        // 从列表中移除该账号
        setAccounts(accounts.filter(acc => acc.id !== accountId));

        // 更新统计数据
        setStats({
          ...stats,
          total: stats.total - 1,
          used: accounts.find(acc => acc.id === accountId)?.is_used === 1
            ? stats.used - 1
            : stats.used,
          available: accounts.find(acc => acc.id === accountId)?.is_used === 0
            ? stats.available - 1
            : stats.available
        });
      } else {
        message.error(response.message || '删除账号失败');
      }
    } catch (error) {
      console.error('删除账号失败:', error);
      message.error('删除账号失败: ' + (error.response?.data?.message || error.message));
    }
  };

  // 初始化时获取账号列表
  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <span>{text}</span>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyField(text)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      render: (text) => (
        <Space>
          <span>••••••••</span>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyField(text)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: '姓名',
      key: 'name',
      render: (_, record) => getFullName(record.first_name, record.last_name),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => formatTimestamp(text),
    },
    {
      title: '过期时间',
      dataIndex: 'expire_time',
      key: 'expire_time',
      render: (text) => formatTimestamp(text),
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const expired = isAccountExpired(record.expire_time);
        if (expired) {
          return <Tag color="red">已过期</Tag>;
        }
        return (
          <Switch
            checkedChildren="已用"
            unCheckedChildren="未用"
            checked={record.is_used === 1}
            onChange={(checked) => updateAccountStatus(record.id, checked)}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => copyAccountInfo(record)}
          >
            复制
          </Button>
          <Popconfirm
            title="确定要删除此账号吗？"
            description="删除后将无法在此页面查看，但管理员仍可查看"
            onConfirm={() => deleteAccount(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 移动设备上的列表项渲染
  const renderMobileAccountItem = (account) => {
    const expired = isAccountExpired(account.expire_time);

    return (
      <List.Item
        key={account.id}
        actions={[
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyAccountInfo(account)}
          />,
          <Popconfirm
            title="确定要删除此账号吗？"
            description="删除后将无法在此页面查看，但管理员仍可查看"
            onConfirm={() => deleteAccount(account.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{getFullName(account.first_name, account.last_name)}</span>
              {expired ? (
                <Tag color="red">已过期</Tag>
              ) : (
                <Switch
                  checkedChildren="已用"
                  unCheckedChildren="未用"
                  checked={account.is_used === 1}
                  onChange={(checked) => updateAccountStatus(account.id, checked)}
                  size="small"
                />
              )}
            </div>
          }
          description={
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <MailOutlined style={{ marginRight: 8 }} />
                <span style={{ flex: 1 }}>{account.email}</span>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyField(account.email)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <LockOutlined style={{ marginRight: 8 }} />
                <span style={{ flex: 1 }}>••••••••</span>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyField(account.password)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <span>{formatTimestamp(account.expire_time)}</span>
              </div>
            </div>
          }
        />
      </List.Item>
    );
  };

  // 响应式统计卡片
  const renderStatCards = () => {
    const colSpan = mobile ? 24 : 8;
    const gutter = mobile ? [0, 16] : 16;

    return (
      <Row gutter={gutter} style={{ marginBottom: mobile ? 8 : 16 }}>
        <Col span={colSpan} style={{ marginBottom: mobile ? 16 : 0 }}>
          <Card>
            <Statistic
              title="总账号数"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={colSpan} style={{ marginBottom: mobile ? 16 : 0 }}>
          <Card>
            <Statistic
              title="已使用账号"
              value={stats.used}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={colSpan}>
          <Card>
            <Statistic
              title="可用账号"
              value={stats.available}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      {renderStatCards()}

      <Card
        title="账号列表"
        extra={
          <Space size={mobile ? 'small' : 'middle'}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAccounts}
              loading={loading}
              size={mobile ? 'small' : 'middle'}
            >
              {!isSmallMobile() && '刷新'}
            </Button>
            <Button
              type="primary"
              onClick={getNewAccount}
              loading={getAccountLoading}
              size={mobile ? 'small' : 'middle'}
            >
              {isSmallMobile() ? '新账号' : '获取新账号'}
            </Button>
          </Space>
        }
      >
        {mobile ? (
          <List
            itemLayout="vertical"
            dataSource={accounts}
            renderItem={renderMobileAccountItem}
            loading={loading}
            pagination={{
              ...pagination,
              size: 'small',
              onChange: (page, pageSize) => fetchAccounts(page, pageSize)
            }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={accounts}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>

      {/* 账号详情弹窗 */}
      <Modal
        title="新账号详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="copy" type="primary" onClick={() => {
            if (selectedAccount) {
              copyAccountInfo(selectedAccount);
            }
          }}>
            复制账号信息
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={mobile ? '95%' : 520}
        styles={{ body: { padding: mobile ? '16px' : '24px' } }}
      >
        {selectedAccount && (
          <div>
            {mobile ? (
              <List>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<MailOutlined />} />}
                    title="邮箱"
                    description={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ flex: 1 }}>{selectedAccount.email}</span>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyField(selectedAccount.email)}
                        />
                      </div>
                    }
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<LockOutlined />} />}
                    title="密码"
                    description={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ flex: 1 }}>{selectedAccount.password}</span>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyField(selectedAccount.password)}
                        />
                      </div>
                    }
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title="姓名"
                    description={getFullName(selectedAccount.first_name, selectedAccount.last_name)}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CalendarOutlined />} />}
                    title="过期时间"
                    description={formatTimestamp(selectedAccount.expire_time)}
                  />
                </List.Item>
              </List>
            ) : (
              <div>
                <p><strong>邮箱:</strong> {selectedAccount.email} <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyField(selectedAccount.email)} /></p>
                <p><strong>密码:</strong> {selectedAccount.password} <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyField(selectedAccount.password)} /></p>
                <p><strong>姓名:</strong> {getFullName(selectedAccount.first_name, selectedAccount.last_name)}</p>
                <p><strong>过期时间:</strong> {formatTimestamp(selectedAccount.expire_time)}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccountList;
