import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, message, Image } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { saveToken, isMobile } from '../utils';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(isMobile());
  const navigate = useNavigate();
  const { updateUser, fetchUserInfo } = useUser();

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

  // 登录表单
  const [loginForm] = Form.useForm();
  // 注册表单
  const [registerForm] = Form.useForm();

  // 处理登录
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await userApi.login(values);

      if (response.status === 'success') {
        // 保存token
        saveToken(response.token);
        // 更新用户信息到上下文
        updateUser(response.user);
        // 确保用户信息已加载
        await fetchUserInfo();
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error) {
      message.error('登录请求失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const response = await userApi.register(values);

      if (response.status === 'success') {
        // 保存token
        saveToken(response.token);
        // 更新用户信息到上下文
        updateUser(response.user);
        // 确保用户信息已加载
        await fetchUserInfo();
        message.success('注册成功');
        navigate('/');
      } else {
        message.error(response.message || '注册失败');
      }
    } catch (error) {
      message.error('注册请求失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 切换标签页
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5',
      padding: mobile ? '0 16px' : 0
    }}>
      <Card style={{
        width: mobile ? '100%' : 400,
        maxWidth: '100%',
        borderRadius: mobile ? '8px' : '2px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Image
            src="/favicon.svg"
            alt="Logo"
            preview={false}
            width={mobile ? 48 : 64}
            style={{ marginBottom: 16 }}
          />
          <h1 style={{
            fontSize: mobile ? '20px' : '24px',
            margin: 0
          }}>
            Cursor 账号管理系统
          </h1>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          centered={true}
          size={mobile ? 'small' : 'middle'}
        >
          <Tabs.TabPane key="login" tab="登录">
            <Form
              form={loginForm}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              size={mobile ? 'middle' : 'large'}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size={mobile ? 'middle' : 'large'}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane key="register" tab="注册">
            <Form
              form={registerForm}
              name="register"
              onFinish={handleRegister}
              autoComplete="off"
              size={mobile ? 'middle' : 'large'}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱（可选）" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size={mobile ? 'middle' : 'large'}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
