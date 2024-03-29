import React from 'react';
import ReactDOM from 'react-dom';
// 离线缓存
import * as serviceWorker from './serviceWorker';
// Hash路由
import { BrowserRouter } from 'react-router-dom';
// 预加载antd组件
import { LocaleProvider } from 'antd';
// antd中文组件
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// 自定义工具类
import '@js/tool';
import '@js/qrcode.min';

import { Provider} from 'mobx-react'
import store from './store/store'

import "./index.less";
// antd组件本体按需引入, 具体请使用请查看antd官方文档
import 'antd/dist/antd.less';

import App from './App';

// 线上正式版:
window.apiUrl = '//api.maishoumiji.com';
window.fandianUrl = '//fandian.maishoumiji.com';
window.ajaxUrl = '//backend.maishoumiji.com';

ReactDOM.render(
  <BrowserRouter>
    <LocaleProvider locale={zh_CN}>
      <Provider {...store}>
        <App/>
      </Provider>
    </LocaleProvider>
  </BrowserRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
