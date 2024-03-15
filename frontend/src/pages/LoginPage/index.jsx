import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_MANAGE_URL}/login`,
        values
      );
      localStorage.setItem('token', response.data.token);
      messageApi.success({ content: 'Logged in successfully' });
      navigate('/');
    } catch (error) {
      messageApi.error({ content: 'Failed to log in' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form name='login' onFinish={onFinish}>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading}>
            Log in
          </Button>
          <Button type='link' onClick={() => navigate('/register')}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginPage;
