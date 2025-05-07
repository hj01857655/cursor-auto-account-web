import React, { createContext, useState, useContext, useEffect } from 'react';
import { userApi } from '../services/api';

// 创建用户上下文
export const UserContext = createContext();

// 创建用户上下文提供者组件
export const UserProvider = ({ children }) => {
  // 检查localStorage中是否有token，初始化认证状态
  const hasToken = !!localStorage.getItem('token');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasToken); // 如果有token，初始状态为加载中
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      // 检查localStorage中是否有token
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        return null;
      }

      // 验证token有效性
      const response = await userApi.getUserInfo();

      if (response.status === 'success') {
        setUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } else {
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      console.error('验证用户失败:', error);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      setIsAuthenticated(true);
    }
  };

  // 清除用户信息（登出时使用）
  const clearUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // 组件挂载时自动检查token并获取用户信息
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setLoading(true);
        try {
          const response = await userApi.getUserInfo();

          if (response.status === 'success') {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            // Token无效，清除
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('验证用户失败:', error);
          // 请求失败，可能是token无效或服务器问题
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }
    };

    autoLogin();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      fetchUserInfo,
      updateUser,
      clearUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

// 创建自定义钩子，方便使用上下文
export const useUser = () => useContext(UserContext);

export default UserProvider;
