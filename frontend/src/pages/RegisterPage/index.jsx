import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_MANAGE_URL}/register`,
        values
      );
      messageApi.success({ content: 'Registered successfully' });
      navigate('/login');
    } catch (error) {
      messageApi.error({ content: 'Failed to register' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form name='register' onFinish={onFinish}>
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
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterPage;
