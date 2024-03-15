import React, { useEffect, useState } from 'react';
import Movies from '../Movies';
import { Space, Typography, Flex, Button } from 'antd';
import MovieForm from '../MovieForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);

      // Check if token has expired
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/movies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Button onClick={logout} type='primary'>
        Logout
      </Button>
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
    </div>
  );
};

export default Home;
