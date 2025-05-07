import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { userApi } from '../services/api';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 设置表单初始值
  const setFormValues = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        domain: user.domain,
        temp_email_address: user.temp_email_address,
      });
    }
  };

  // 更新用户信息
  const updateUserInfo = async (values) => {
    try {
      setLoading(true);

      // 如果没有修改密码，则不发送密码字段
      const updateData = { ...values };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await userApi.updateUser(user.id, updateData);

      if (response.status === 'success') {
        message.success('用户信息更新成功');
        // 更新全局用户状态
        updateUser(response.user);
      } else {
        message.error(response.message || '更新用户信息失败');
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新用户信息失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 当用户信息变化时，更新表单
  useEffect(() => {
    setFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Card title="个人设置">
      {user && (
        <Form
          form={form}
          layout="vertical"
          onFinish={updateUserInfo}
          initialValues={{
            username: user.username,
            email: user.email,
            domain: user.domain,
            temp_email_address: user.temp_email_address,
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input
              prefix={<UserOutlined />}
              disabled
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱（可选）"
            />
          </Form.Item>

          <Divider>账号生成设置</Divider>

          <Form.Item
            label="域名"
            name="domain"
            rules={[
              { required: true, message: '请输入域名' }
            ]}
            tooltip="用于生成Cursor账号的邮箱域名，例如：zoowayss.top"
          >
            <Input
              prefix={<GlobalOutlined />}
              placeholder="域名，例如：zoowayss.top"
            />
          </Form.Item>

          <Form.Item
            label="临时邮箱地址"
            name="temp_email_address"
            rules={[
              { required: true, message: '请输入临时邮箱地址' },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '请输入有效的邮箱地址'
              }
            ]}
            tooltip="用于接收验证码的临时邮箱地址，例如：zoowayss@mailto.plus"
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="临时邮箱地址，例如：zoowayss@mailto.plus"
            />
          </Form.Item>

          <Divider>修改密码</Divider>

          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { min: 3, message: '密码长度至少为3个字符' }
            ]}
            tooltip="如不修改密码，请留空"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="新密码（如不修改请留空）"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default Profile;
