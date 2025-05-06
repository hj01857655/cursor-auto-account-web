import React, { useState, useEffect } from 'react';
import { Tabs, Table, Card, Tag, Space, Button, message, Switch, Checkbox } from 'antd';
import { CopyOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminApi, accountApi } from '../services/api';
import { formatTimestamp, copyToClipboard, isAccountExpired, getFullName } from '../utils';

const Admin = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [accountsPagination, setAccountsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [usersPagination, setUsersPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取所有账号
  const fetchAllAccounts = async (page = 1, pageSize = 10) => {
    try {
      setAccountsLoading(true);
      const response = await adminApi.getAllAccounts(page, pageSize, showDeleted);

      if (response.status === 'success') {
        setAccounts(response.accounts || []);
        setAccountsPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total
        });
      } else {
        message.error(response.message || '获取账号列表失败');
      }
    } catch (error) {
      console.error('获取账号列表失败:', error);
      message.error('获取账号列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setAccountsLoading(false);
    }
  };

  // 获取所有用户
  const fetchAllUsers = async (page = 1, pageSize = 10) => {
    try {
      setUsersLoading(true);
      const response = await adminApi.getAllUsers(page, pageSize);

      if (response.status === 'success') {
        setUsers(response.users || []);
        setUsersPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total
        });
      } else {
        message.error(response.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setUsersLoading(false);
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

  // 处理账号表格分页变化
  const handleAccountsTableChange = (pagination) => {
    fetchAllAccounts(pagination.current, pagination.pageSize);
  };

  // 处理用户表格分页变化
  const handleUsersTableChange = (pagination) => {
    fetchAllUsers(pagination.current, pagination.pageSize);
  };

  // 处理显示已删除账号的切换
  const handleShowDeletedChange = (e) => {
    setShowDeleted(e.target.checked);
    // 重新获取账号列表
    fetchAllAccounts(accountsPagination.current, accountsPagination.pageSize);
  };

  // 初始化时获取数据
  useEffect(() => {
    fetchAllAccounts();
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 账号表格列定义
  const accountColumns = [
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
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        // 首先检查是否已删除
        if (record.is_deleted === 1) {
          return <Tag color="red">已删除</Tag>;
        }

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
        </Space>
      ),
    },
  ];

  // 用户表格列定义
  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '域名',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: '临时邮箱',
      dataIndex: 'temp_email_address',
      key: 'temp_email_address',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => formatTimestamp(text),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (text) => text ? formatTimestamp(text) : '从未登录',
    },
  ];

  return (
    <Tabs defaultActiveKey="accounts">
      <Tabs.TabPane tab="账号管理" key="accounts">
        <Card
          title="所有账号"
          extra={
            <Space>
              <Checkbox
                checked={showDeleted}
                onChange={handleShowDeletedChange}
              >
                显示已删除账号
              </Checkbox>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchAllAccounts(accountsPagination.current, accountsPagination.pageSize)}
                loading={accountsLoading}
              >
                刷新
              </Button>
            </Space>
          }
        >
          <Table
            columns={accountColumns}
            dataSource={accounts}
            rowKey="id"
            loading={accountsLoading}
            pagination={accountsPagination}
            onChange={handleAccountsTableChange}
          />
        </Card>
      </Tabs.TabPane>

      <Tabs.TabPane tab="用户管理" key="users">
        <Card
          title="所有用户"
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchAllUsers(usersPagination.current, usersPagination.pageSize)}
              loading={usersLoading}
            >
              刷新
            </Button>
          }
        >
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="id"
            loading={usersLoading}
            pagination={usersPagination}
            onChange={handleUsersTableChange}
          />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Admin;
