import React from 'react';
import ReactDOM from 'react-dom/client';
import {evtBus} from 'mtor';
import Routes from './routes';
import Provider from '~/components/NothingProvider';
// import Provider from '~/components/AntdProvider';
// import Provider from '~/components/Framework7Provider';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import './assets/css/style.css';
dayjs.locale('zh-cn');
window.eventBus = evtBus;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider>
          <Routes/>
      </Provider>
  </React.StrictMode>,
);
