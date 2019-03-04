import React from 'react';
import { withRouter, Switch, Route, } from 'react-router-dom';

// 这里引用各个组件内容, 内容为方便管理, 统一写入pages页面
// 主页
import Home from '@pages/Home/';
// 订单
import orderMatched from '@pages/logisticsManage/matched/';
import orderUnmatched from '@pages/logisticsManage/unmatched/';
// 预约
import appointmentInfo from '@pages/logisticsManage/appointmentInfo/';
// 接送机
import airportTransfer from '@pages/reservationService/airportTransfer/';
// 返点
import adoptExaminePaid from '@pages/rebateManage/adoptExaminePaid/';
import adoptExamineUnpaid from '@pages/rebateManage/adoptExamineUnpaid/';
import rejectExamine from '@pages/rebateManage/rejectExamine/';
import updateQRCode from '@pages/rebateManage/updateQRCode/';
// 审核小票
import awaitingExamine from '@pages/rebateManage/awaitingExamine/';
// 设置返点
import setRebate from '@pages/rebateManage/setRebate/';
import countBillList from '@pages/rebateManage/countBillList/';
import appointmentTeamManage from '@pages/rebateManage/appointmentTeamManage/';
// 商品管理
import commoditiesDataBase from '@pages/commoditiesManage/commoditiesDatabase/';
import commoditiesCreateAndEdit from '@pages/commoditiesManage/commoditiesDatabase/commoditiesCreateAndEdit/';
import commoditiesImgList from '@pages/commoditiesManage/commoditiesDatabase/commoditiesImgList/';

// 404页面
import page404 from '@pages/system/page404/'

// 开发人员专用调试
import importExcel from '@pages/developerPages/importExcel/';

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
          {/*物流管理*/}
          <Route exact path="/logistics-manage/unmatched" component={orderUnmatched} />
          <Route exact path="/logistics-manage/matched" component={orderMatched} />
          <Route exact path="/logistics-manage/appointment-info" component={appointmentInfo} />
          {/*返点管理*/}
          <Route exact path="/rebate-manage/awaiting-examine" component={awaitingExamine} />
          <Route exact path="/rebate-manage/adopt-examine-unpaid" component={adoptExamineUnpaid} />
          <Route exact path="/rebate-manage/adopt-examine-paid" component={adoptExaminePaid} />
          <Route exact path="/rebate-manage/reject-examine" component={rejectExamine} />
          <Route exact path="/rebate-manage/set-rebate" component={setRebate} />
          <Route exact path="/rebate-manage/count-bill-list" component={countBillList} />
          <Route exact path="/rebate-manage/appointment-team-manage" component={appointmentTeamManage} />
          <Route exact path="/rebate-manage/update-QR-code" component={updateQRCode} />
          {/*服务预定管理*/}
          <Route exact path="/reservation-service/airport-transfer" component={airportTransfer} />
          {/*商品管理*/}
          <Route exact path="/commodities-manage/commodities-database" component={commoditiesDataBase} />
          <Route exact path="/commodities-manage/commodities-database/create-and-edit" component={commoditiesCreateAndEdit} />
          <Route exact path="/commodities-manage/commodities-database/commodities-img-list" component={commoditiesImgList} />
          <Route exact path="/" component={Home} />
          {/*开发人员专用管理路由*/}
          {window.isLocalTest && <Route exact path="/developer-pages/import-excel" component={importExcel} />}
          {/*这里可以配置404 not found 页面*/}
          <Route component={page404} />
        </Switch>
      </div>
    )}
}

export default ContentMain;