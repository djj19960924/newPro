import React from 'react';
import { withRouter, Switch, Route, } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';

// 这里引用各个组件内容, 内容为方便管理, 统一写入pages页面
// 主页
import Home from '@pages/Home/';
// 订单
import orderMatched from '@pages/logisticsManage/matched/';
import orderUnmatched from '@pages/logisticsManage/unmatched/';
// 预约
import appointmentInfo from '@pages/logisticsManage/appointmentInfo/';
// 关于
// import about from '@pages/about/';
// 返点
import awaitingExamine from '@pages/rebateManage/awaitingExamine/';

@withRouter
class ContentMain extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(
      <div style={{backgroundColor: '#eee', width: '100%', height: '100%', padding: '10px'}}>
        <Switch>
          <Route exact path="/logistics-manage/unmatched" component={orderUnmatched} />
          <Route exact path="/logistics-manage/matched" component={orderMatched} />
          <Route exact path="/logistics-manage/appointment-info" component={appointmentInfo} />
          {window.isTest && <Route exact path="/rebate-manage/awaiting-examine" component={awaitingExamine} />}
          {/*<Route exact path="/rebate-manage/adopt-examine-unpaid" component={Home} />*/}
          {/*<Route exact path="/rebate-manage/adopt-examine-paid" component={Home} />*/}
          {/*<Route exact path="/rebate-manage/reject-examine" component={Home} />*/}
          {/*<Route exact path="/about" component={about} />*/}
          {/*<PrivateRoute exact path="/" component={Home} />*/}
          {/*这里可以配置404 not found 页面*/}
          {/*<Route path="/" component={page404} />*/}
        </Switch>
      </div>
    )}
}

export default ContentMain;