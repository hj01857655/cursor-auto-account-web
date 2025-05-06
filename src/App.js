import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './App.css';

// 页面组件
import Login from './pages/Login';
import Home from './pages/Home';
import AccountList from './pages/AccountList';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

// 权限控制组件
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />

          {/* 需要登录的路由 */}
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />

          <Route path="/accounts" element={
            <PrivateRoute>
              <AccountList />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* 管理员路由 */}
          <Route path="/admin" element={
            <PrivateRoute adminOnly={true}>
              <Admin />
            </PrivateRoute>
          } />

          {/* 默认重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
