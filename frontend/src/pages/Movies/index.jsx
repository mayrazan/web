import React from 'react';
import axios from 'axios';
import { Button, Card, Flex, Typography, Empty } from 'antd';

const Movies = ({ movies, setMovies, loading, error }) => {
  async function handleDelete(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/movies/${id}`);
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error(`Failed to delete movie with id ${id}`, error);
    }
  }

  return (
    <Flex gap='middle' align='center' vertical>
      <Typography.Title level={2}>List</Typography.Title>
      <SkeletonLoadingWrapper
        loading={loading}
        isEmpty={!movies.length}
        error={error}
      >
        <Flex gap='middle' align='center' wrap='wrap'>
          {movies.map((movie) => {
            return (
              <Card
                key={movie.id}
                style={{ width: 300 }}
                hoverable
                title={movie.title}
              >
                <Flex justify='space-between' vertical gap='middle'>
                  <Typography.Text>Genre: {movie.genre}</Typography.Text>
                  <Typography.Text>Year: {movie.year}</Typography.Text>
                  <Button onClick={() => handleDelete(movie.id)}>Delete</Button>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      </SkeletonLoadingWrapper>
    </Flex>
  );
};

export default Movies;

function SkeletonLoadingWrapper({ children, loading, isEmpty, error }) {
  if (loading) {
    return (
      <Flex gap='middle' align='center' wrap='wrap'>
        {[...Array(10).keys()].map((index) => {
          return (
            <Card key={index} style={{ width: 300 }} loading={true}>
              <Card.Meta
                title='Card title'
                description='This is the description'
              />
            </Card>
          );
        })}
      </Flex>
    );
  }

  if (isEmpty) {
    return <Empty />;
  }

  if (error) {
    return (
      <Typography.Text type='danger'>Failed to fetch movies</Typography.Text>
    );
  }

  return children;
}
