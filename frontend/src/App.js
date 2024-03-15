import React from 'react';
import { ConfigProvider, theme } from 'antd';
import RouterHandle from './router';

const App = () => {
  return (
    <ConfigProvider theme={theme}>
      <RouterHandle />
    </ConfigProvider>
  );
};

export default App;
