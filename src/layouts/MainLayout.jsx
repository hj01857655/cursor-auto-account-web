import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { userApi } from '../services/api';
import { clearToken, isAdmin } from '../utils';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.getUserInfo();
        if (response.status === 'success') {
          setUser(response.user);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理登出
  const handleLogout = () => {
    clearToken();
    message.success('已成功退出登录');
    navigate('/login');
  };

  // 用户下拉菜单
  const userMenu = {
    items: [
      {
        key: 'profile',
        label: <Link to="/profile">个人中心</Link>,
        icon: <UserOutlined />
      },
      {
        key: 'logout',
        label: '退出登录',
        icon: <LogoutOutlined />,
        onClick: handleLogout
      }
    ]
  };

  // 侧边栏菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/accounts',
      icon: <IdcardOutlined />,
      label: <Link to="/accounts">账号列表</Link>,
    },
    {
      key: '/profile',
      icon: <SettingOutlined />,
      label: <Link to="/profile">个人设置</Link>,
    }
  ];

  // 如果是管理员，添加管理员菜单
  if (user && isAdmin(user)) {
    menuItems.push({
      key: '/admin',
      icon: <SettingOutlined />,
      label: <Link to="/admin">管理员面板</Link>,
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ marginRight: '24px' }}>
            {user && (
              <Dropdown menu={userMenu} placement="bottomRight">
                <Button type="text" icon={<UserOutlined />}>
                  {user.username}
                </Button>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
