import React from 'react';
import { Card, Button, Alert, Typography, Space, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { WarningOutlined, IdcardOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';

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

      <Divider />

      <Card
        title={
          <Title level={3} style={{ margin: 0, color: '#eb2f96' }}>
            <HeartOutlined style={{ marginRight: 8 }} />赞助支持
          </Title>
        }
        style={{ marginTop: 24, background: 'linear-gradient(to right, #fff0f6, #fff)' }}
        bordered={true}
      >
        <Typography>
          <Paragraph>
            <Text strong style={{ fontSize: 16 }}>
              如果您觉得本服务对您有所帮助，欢迎扫描下方二维码赞助支持，让服务持续运行！
            </Text>
          </Paragraph>
        </Typography>

        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{ textAlign: 'center', borderColor: '#52c41a' }}
              cover={<img alt="微信支付" src="/21746583176_.pic.jpg" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', padding: '10px' }} />}
            >
              <Card.Meta title="微信支付" description="感谢您的支持！" />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{ textAlign: 'center', borderColor: '#1890ff' }}
              cover={<img alt="支付宝" src="/31746583177_.pic.jpg" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', padding: '10px' }} />}
            >
              <Card.Meta title="支付宝" description="感谢您的支持！" />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
