import React from 'react';
import ReactDOM from 'react-dom/client';
import {evtBus} from 'mtor';
import Routes from './routes';
// import AntdProvider from '~/components/AntdProvider';
import Framework7Provider from '~/components/Framework7Provider';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');
window.eventBus = evtBus;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Framework7Provider>
          <Routes/>
      </Framework7Provider>
  </React.StrictMode>,
);