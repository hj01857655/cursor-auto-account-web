import {
    HomeOutlined,
    IdcardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Drawer, Dropdown, Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { clearToken, isAdmin, isMobile, isSmallMobile } from '../utils';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { user, clearUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // 检测设备类型并设置状态
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = isMobile();
      setMobile(isMobileDevice);
      // 在移动设备上默认折叠侧边栏
      if (isMobileDevice && !collapsed) {
        setCollapsed(true);
      }
    };

    // 初始检测
    checkMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkMobile);

    // 清理监听器
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [collapsed]);

  // 处理登出
  const handleLogout = () => {
    clearToken();
    clearUser(); // 清除用户上下文
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

  // 处理抽屉菜单的打开和关闭
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // 点击菜单项后关闭抽屉（仅在移动设备上）
  const handleMenuClick = () => {
    if (mobile) {
      closeDrawer();
    }
  };

  // 移动设备上的菜单项，添加点击处理
  const mobileMenuItems = menuItems.map(item => ({
    ...item,
    label: (
      <Link to={item.key} onClick={handleMenuClick}>
        {item.label.props.children}
      </Link>
    )
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 在非移动设备上显示侧边栏 */}
      {!mobile && (
        <Sider trigger={null} collapsible collapsed={collapsed}
               breakpoint="lg"
               collapsedWidth={mobile ? 0 : 80}>
          <div className="logo" style={{
            height: '40px',
            margin: '16px 0',
            padding: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            <img src="/favicon.svg" alt="Logo" style={{ height: '28px', width: '28px', marginRight: collapsed ? '0' : '6px' }} />
            {!collapsed && <span style={{
              color: 'white',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>cursor accounts</span>}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </Sider>
      )}

      <Layout>
        <Header style={{
          padding: 0,
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          {mobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={showDrawer}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          ) : (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: mobile ? 'auto' : 0
          }}>
            {mobile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: 'auto',
                marginLeft: -40
              }}>
                <img src="/favicon.svg" alt="Logo" style={{ height: '24px', width: '24px', marginRight: '8px' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>cursor accounts</span>
              </div>
            )}
          </div>

          <div style={{ marginRight: '24px' }}>
            {user && (
              <Dropdown menu={userMenu} placement="bottomRight">
                <Button type="text" icon={<UserOutlined />}>
                  {isSmallMobile() ? '' : user.username}
                </Button>
              </Dropdown>
            )}
          </div>
        </Header>

        <Content style={{
          margin: mobile ? '16px 8px' : '24px 16px',
          padding: mobile ? 16 : 24,
          background: '#fff',
          minHeight: 280,
          borderRadius: '4px'
        }}>
          {children}
        </Content>
      </Layout>

      {/* 移动设备上的抽屉菜单 */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/favicon.svg" alt="Logo" style={{ height: '24px', width: '24px', marginRight: '8px' }} />
            <span>cursor accounts</span>
          </div>
        }
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={drawerVisible}
        styles={{ body: { padding: 0 } }}
        width={250}
      >
        <div style={{ padding: '16px' }}>
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '16px'
            }}>
              <UserOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{user.email || '未设置邮箱'}</div>
              </div>
            </div>
          )}
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={mobileMenuItems}
            style={{ border: 'none' }}
          />
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', marginTop: '16px' }}>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
            >
              退出登录
            </Button>
          </div>
        </div>
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
