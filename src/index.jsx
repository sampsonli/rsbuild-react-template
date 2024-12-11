import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import CustomerProvider from '~/components/CustomerProvider';
dayjs.locale('zh-cn');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <CustomerProvider>
          <Routes/>
      </CustomerProvider>
  </React.StrictMode>,
);