import React, { useState } from 'react';
import axios from 'axios';
import { Input, InputNumber, Button, Form, Flex, Typography } from 'antd';

const MovieForm = ({ fetchItems }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAddMovie() {
    setLoading(true);
    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/movies`, {
          title,
          genre,
          year,
        })
        .then(() => {
          setTitle('');
          setGenre('');
          setYear('');
        });
    } catch (error) {
      console.error('Failed to add movie', error);
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
      setError(null);
      fetchItems();
    }
  }

  return (
    <Flex gap='middle' align='center' vertical style={{ width: '100%' }}>
      <Typography.Title level={2}>Add movie</Typography.Title>
      <Form
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
        style={{ width: 700 }}
      >
        <Form.Item
          label='Title'
          rules={[{ required: true, message: 'Please input the title!' }]}
          htmlFor='title'
          required
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size='large'
            name='title'
          />
        </Form.Item>
        <Form.Item
          label='Genre'
          rules={[{ required: true, message: 'Please input the genre' }]}
          htmlFor='genre'
          required
        >
          <Input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            size='large'
            name='genre'
          />
        </Form.Item>
        <Form.Item
          label='Year'
          rules={[{ required: true, message: 'Please input the year!' }]}
          htmlFor='year'
          required
        >
          <InputNumber
            value={year}
            onChange={(value) => setYear(value)}
            type='number'
            size='large'
            name='year'
          />
        </Form.Item>

        <Button
          type='primary'
          disabled={!title || !genre || !year}
          onClick={handleAddMovie}
          loading={loading}
          htmlType='submit'
        >
          Add movie
        </Button>
      </Form>

      {error && <Typography.Text type='danger'>{error.error}</Typography.Text>}
    </Flex>
  );
};

export default MovieForm;
