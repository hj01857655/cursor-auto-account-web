import React from 'react';
import { Card, Button, Alert, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { WarningOutlined, IdcardOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  return (
    <div>
      <Alert
        message={<Title level={4} style={{ margin: 0 }}>⚠️ 重要通知</Title>}
        description={
          <Typography>
            <Paragraph>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                <li><Text strong>当前 zoowayss.top 域名邮箱已经被cursor拉黑</Text></li>
                <li><Text strong>请在右上角个人中心自行配置自己的域名和转发临时邮箱地址</Text></li>
                <li><Text strong>如果401 退出登录或者删除localstorage & cookies</Text></li>
              </ol>
            </Paragraph>
          </Typography>
        }
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        style={{ marginBottom: 24 }}
        banner
      />

      <Card title={<Title level={3} style={{ margin: 0 }}>欢迎使用 Cursor 账号管理系统</Title>}>
        <Typography>
          <Paragraph>
            请选择您要进行的操作：
          </Paragraph>
        </Typography>
        <Space size="large" style={{ marginTop: 20 }}>
          <Button type="primary" size="large" icon={<IdcardOutlined />}>
            <Link to="/accounts">查看账号列表</Link>
          </Button>
          <Button size="large" icon={<UserOutlined />}>
            <Link to="/profile">个人中心</Link>
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Home;
