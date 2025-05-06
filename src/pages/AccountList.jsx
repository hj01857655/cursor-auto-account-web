import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Statistic, Row, Col, Modal, message, Tag, Switch, Space, Popconfirm } from 'antd';
import { CopyOutlined, ReloadOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { accountApi } from '../services/api';
import { formatTimestamp, copyToClipboard, isAccountExpired, getFullName } from '../utils';

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

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总账号数"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已使用账号"
              value={stats.used}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
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

      <Card
        title="账号列表"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAccounts}
              loading={loading}
            >
              刷新
            </Button>
            <Button
              type="primary"
              onClick={getNewAccount}
              loading={getAccountLoading}
            >
              获取新账号
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
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
      >
        {selectedAccount && (
          <div>
            <p><strong>邮箱:</strong> {selectedAccount.email}</p>
            <p><strong>密码:</strong> {selectedAccount.password}</p>
            <p><strong>姓名:</strong> {getFullName(selectedAccount.first_name, selectedAccount.last_name)}</p>
            <p><strong>过期时间:</strong> {formatTimestamp(selectedAccount.expire_time)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccountList;
