import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { userApi } from '../services/api';
import { isAdmin } from '../utils';
import MainLayout from '../layouts/MainLayout';

// 私有路由组件，用于保护需要登录才能访问的页面
const PrivateRoute = ({ children, adminOnly = false }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 检查localStorage中是否有token
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // 验证token有效性
        const response = await userApi.getUserInfo();

        if (response.status === 'success') {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('验证用户失败:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 如果正在加载，显示加载指示器
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="正在验证身份..." />
      </div>
    );
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
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
