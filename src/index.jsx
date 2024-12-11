import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';
import {ConfigProvider, theme} from 'antd';

import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ConfigProvider theme={theme.darkAlgorithm} locale={zhCN}>
          <Routes/>
      </ConfigProvider>
  </React.StrictMode>,
);