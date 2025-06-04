import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import MainLayout from '../layouts/MainLayout';
import { isAdmin } from '../utils';

// 私有路由组件，用于保护需要登录才能访问的页面
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated, fetchUserInfo } = useUser();
  const location = useLocation();

  // 确保用户信息已加载
  useEffect(() => {
    const token = localStorage.getItem('token');

    // 如果有token但用户未认证且不在加载中，手动触发获取用户信息
    if (token && !isAuthenticated && !loading) {
      fetchUserInfo();
    }
  }, [isAuthenticated, loading, fetchUserInfo]);

  // 如果正在加载，显示加载指示器
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large">
          <div style={{ padding: '50px' }}>正在验证身份...</div>
        </Spin>
      </div>
    );
  }

  // 如果未认证且不在加载中，重定向到登录页面
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要管理员权限但用户不是管理员，重定向到首页
  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // 认证通过，渲染子组件
  return <MainLayout>{children}</MainLayout>;
};

export default PrivateRoute;
