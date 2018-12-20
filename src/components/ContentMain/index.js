import React from 'react';
import { withRouter, Switch, Route, } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';

// 这里引用各个组件内容, 内容为方便管理, 统一写入pages页面
// 主页
import Home from '@pages/Home/';
// 订单
import orderMatched from '@pages/Order/matched/';
import orderUnmatched from '@pages/Order/unmatched/';
// 预约
import appointmentInfo from '@pages/appointmentInfo/';
// 关于
// import about from '@pages/about/';

@withRouter
class ContentMain extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(
      <div name="ContentMain" style={{backgroundColor: '#eee', width: '100%', height: '100%', padding: '10px'}}>
        <Switch>
          <Route exact path="/order/unmatched" component={orderUnmatched} />
          <Route exact path="/order/matched" component={orderMatched} />
          <Route exact path="/appointment-info" component={appointmentInfo} />
          {/*<Route exact path="/about" component={about} />*/}
          {/*<PrivateRoute exact path="/" component={Home} />*/}
          {/*这里可以配置404 not found 页面*/}
          {/*<Route path="/" component={page404} />*/}
        </Switch>
      </div>
    )}
}

export default ContentMain;