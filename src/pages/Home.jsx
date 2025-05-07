import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Typography, Space, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { WarningOutlined, IdcardOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { isMobile } from '../utils';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const [mobile, setMobile] = useState(isMobile());

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

  return (
    <div>
      <Alert
        message={<Title level={mobile ? 5 : 4} style={{ margin: 0 }}>⚠️ 重要通知</Title>}
        description={
          <Typography>
            <Paragraph>
              <ol style={{ margin: 0, paddingLeft: mobile ? 16 : 20 }}>
                <li><Text strong style={{ fontSize: mobile ? 13 : 14 }}>当前 zoowayss.top 域名邮箱已经被cursor拉黑</Text></li>
                <li><Text strong style={{ fontSize: mobile ? 13 : 14 }}>请在{mobile ? '' : '右上角'}个人中心自行配置自己的域名和转发临时邮箱地址</Text></li>
                <li><Text strong style={{ fontSize: mobile ? 13 : 14 }}>如果401 退出登录或者删除localstorage & cookies</Text></li>
              </ol>
            </Paragraph>
          </Typography>
        }
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        style={{ marginBottom: mobile ? 16 : 24 }}
        banner
      />

      <Card
        title={
          <Title level={mobile ? 4 : 3} style={{ margin: 0 }}>
            欢迎使用 Cursor 账号管理系统
          </Title>
        }
      >
        <Typography>
          <Paragraph style={{ fontSize: mobile ? 14 : 16 }}>
            请选择您要进行的操作：
          </Paragraph>
        </Typography>
        {mobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 16 }}>
            <Button type="primary" size="large" icon={<IdcardOutlined />} block>
              <Link to="/accounts">查看账号列表</Link>
            </Button>
            <Button size="large" icon={<UserOutlined />} block>
              <Link to="/profile">个人中心</Link>
            </Button>
          </div>
        ) : (
          <Space size="large" style={{ marginTop: 20 }}>
            <Button type="primary" size="large" icon={<IdcardOutlined />}>
              <Link to="/accounts">查看账号列表</Link>
            </Button>
            <Button size="large" icon={<UserOutlined />}>
              <Link to="/profile">个人中心</Link>
            </Button>
          </Space>
        )}
      </Card>

      <Divider />

      <Card
        title={
          <Title level={mobile ? 4 : 3} style={{ margin: 0, color: '#eb2f96' }}>
            <HeartOutlined style={{ marginRight: 8 }} />赞助支持
          </Title>
        }
        style={{
          marginTop: mobile ? 16 : 24,
          background: 'linear-gradient(to right, #fff0f6, #fff)'
        }}
        bordered={true}
      >
        <Typography>
          <Paragraph>
            <Text strong style={{ fontSize: mobile ? 14 : 16 }}>
              如果您觉得本服务对您有所帮助，欢迎扫描下方二维码赞助支持，让服务持续运行！
            </Text>
          </Paragraph>
        </Typography>

        <Row gutter={mobile ? [0, 16] : 24} style={{ marginTop: mobile ? 16 : 20 }}>
          <Col xs={24} sm={12} style={{ marginBottom: mobile ? 16 : 0 }}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                borderColor: '#52c41a',
                boxShadow: mobile ? '0 2px 8px rgba(0, 0, 0, 0.09)' : 'none'
              }}
              cover={
                <img
                  alt="微信支付"
                  src="/21746583176_.pic.jpg"
                  style={{
                    maxWidth: '100%',
                    maxHeight: mobile ? 200 : 300,
                    objectFit: 'contain',
                    padding: mobile ? '8px' : '10px'
                  }}
                />
              }
            >
              <Card.Meta
                title={<div style={{ fontSize: mobile ? 14 : 16 }}>微信支付</div>}
                description={<div style={{ fontSize: mobile ? 12 : 14 }}>感谢您的支持！</div>}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                borderColor: '#1890ff',
                boxShadow: mobile ? '0 2px 8px rgba(0, 0, 0, 0.09)' : 'none'
              }}
              cover={
                <img
                  alt="支付宝"
                  src="/31746583177_.pic.jpg"
                  style={{
                    maxWidth: '100%',
                    maxHeight: mobile ? 200 : 300,
                    objectFit: 'contain',
                    padding: mobile ? '8px' : '10px'
                  }}
                />
              }
            >
              <Card.Meta
                title={<div style={{ fontSize: mobile ? 14 : 16 }}>支付宝</div>}
                description={<div style={{ fontSize: mobile ? 12 : 14 }}>感谢您的支持！</div>}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
