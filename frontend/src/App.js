import React, { useEffect, useState } from 'react';
import Movies from './pages/Movies';
import { ConfigProvider, theme, Space, Typography, Flex } from 'antd';
import MovieForm from './pages/MovieForm';
import axios from 'axios';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/movies`
      );
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to fetch movies', error);
      setLoading(false);
      setError(error);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Space
        size='large'
        align='center'
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Typography.Title>Movies</Typography.Title>

        <Flex gap='large' align='center' vertical style={{ width: '100%' }}>
          <MovieForm fetchItems={fetchMovies} />

          <Movies
            loading={loading}
            movies={movies}
            setMovies={setMovies}
            error={error}
          />
        </Flex>
      </Space>
    </ConfigProvider>
  );
};

export default App;
