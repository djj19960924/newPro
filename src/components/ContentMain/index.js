import React from 'react';
import {withRouter, Switch, Route,} from 'react-router-dom';

// 这里引用各个组件内容, 内容为方便管理, 统一写入pages页面
// 主页
import Home from '@pages/Home/';

// 404页面
import page404 from '@pages/system/page404/'

// 开发人员专用调试
import importExcel from '@pages/developerPages/importExcel/';

// 权限管理
// 角色管理
import roles from '@pages/permission/roles/';
// 用户管理
import users from '@pages/permission/users/';

// 物流管理
// bc清关
// bc商品打包
import commoditiesPackaging from "@pages/logisticsManage/BC_customsClearance/commoditiesPackaging/";
// 打包登陆用户
import customerLogin from "@pages/logisticsManage/BC_customsClearance/commoditiesPackaging/customerLogin/";
// bc清关
import YTO from "@pages/logisticsManage/BC_customsClearance/YTO/";
// bc推单
import BCUploadOrder from "@pages/logisticsManage/BC_customsClearance/uploadOrder/";

// ETK订单
// 已匹配
import orderMatched from '@pages/logisticsManage/ETK/matched/';
// 未匹配
import orderUnmatched from '@pages/logisticsManage/ETK/unmatched/';

// 邮政订单
// 已推送
import orderPushed from '@pages/logisticsManage/postal/pushed/';
// 未推送
import orderNotPushed from '@pages/logisticsManage/postal/notPushed/';

// 全球运转
// 已收货
import globalTranshipmentArrived from '@pages/logisticsManage/globalTranshipment/arrived/';
// 未收货
import globalTranshipmentNotArrived from '@pages/logisticsManage/globalTranshipment/notArrived/';

// 预约
// 预约接送机
import airportTransfer from '@pages/reservationService/airportTransfer/';
// 预约打包
import appointmentInfo from '@pages/reservationService/appointmentInfo/';
//全球跑腿
//展示信息
import GlobalErrands from '@pages/reservationService/globalErrands/';
//编辑进度
import EditProgress from '@pages/reservationService/globalErrands/editProgress/';
// 返点
// 已支付
import adoptExaminePaid from '@pages/rebateManage/adoptExaminePaid/';
// 未支付
import adoptExamineUnpaid from '@pages/rebateManage/adoptExamineUnpaid/';
// 驳回
import rejectExamine from '@pages/rebateManage/rejectExamine/';
// 更新二维码
import updateQRCode from '@pages/rebateManage/updateQRCode/';
// 审核小票
import awaitingExamine from '@pages/rebateManage/awaitingExamine/';
// 设置返点
import setRebate from '@pages/rebateManage/setRebate/';
// 对账
import countBillList from '@pages/rebateManage/countBillList/';
// 挂团
import appointmentTeamManage from '@pages/rebateManage/appointmentTeamManage/';

// 商品管理
// 商品数据库
import commoditiesDataBase from '@pages/commoditiesManage/commoditiesDatabase/';
import commoditiesCreateAndEdit from '@pages/commoditiesManage/commoditiesDatabase/commoditiesCreateAndEdit/';
import commoditiesImgList from '@pages/commoditiesManage/commoditiesDatabase/commoditiesImgList/';



@withRouter
class ContentMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  judgeIsTest(testType) {
    if (window.testType === 'localTest') return true;
    return window.testType === testType;
  }

  render() {
    return (
      <div style={{backgroundColor: '#eee', width: '100%', height: '100%', padding: '10px'}}>
        <Switch>
          {/*首页*/}
          <Route exact path="/" component={Home}/>

          {/*权限管理*/}
          {this.judgeIsTest('localTest') && <Route exact path="/permission/roles" component={roles}/>}
          {this.judgeIsTest('localTest') && <Route exact path="/permission/users" component={users}/>}

          {/*物流管理*/}
          {/*bc清关*/}
          <Route exact path="/logistics-manage/BC-customsClearance/commodities-packaging"
                 component={commoditiesPackaging}/>
          <Route exact path="/logistics-manage/BC-customsClearance/commodities-packaging/customer-login"
                 component={customerLogin}/>
          <Route exact path="/logistics-manage/BC-customsClearance/YTO" component={YTO}/>
          <Route exact path="/logistics-manage/BC-customsClearance/upload-order" component={BCUploadOrder}/>
          {/*ETK*/}
          <Route exact path="/logistics-manage/ETK/unmatched" component={orderUnmatched}/>
          <Route exact path="/logistics-manage/ETK/matched" component={orderMatched}/>
          {/*邮政*/}
          <Route exact path="/logistics-manage/postal/pushed/" component={orderPushed}/>
          <Route exact path="/logistics-manage/postal/not-pushed/" component={orderNotPushed}/>
          {/*全球运转*/}
          <Route exact path="/logistics-manage/globalTranshipment/arrived" component={globalTranshipmentArrived}/>
          <Route exact path="/logistics-manage/globalTranshipment/not-arrived"
                 component={globalTranshipmentNotArrived}/>

          {/*返点管理*/}
          <Route exact path="/rebate-manage/awaiting-examine" component={awaitingExamine}/>
          <Route exact path="/rebate-manage/adopt-examine-unpaid" component={adoptExamineUnpaid}/>
          <Route exact path="/rebate-manage/adopt-examine-paid" component={adoptExaminePaid}/>
          <Route exact path="/rebate-manage/reject-examine" component={rejectExamine}/>
          <Route exact path="/rebate-manage/set-rebate" component={setRebate}/>
          <Route exact path="/rebate-manage/count-bill-list" component={countBillList}/>
          <Route exact path="/rebate-manage/appointment-team-manage" component={appointmentTeamManage}/>
          <Route exact path="/rebate-manage/update-QR-code" component={updateQRCode}/>

          {/*服务预定管理*/}
          <Route exact path="/reservation-service/airport-transfer" component={airportTransfer}/>
          <Route exact path="/reservation-service/appointment-info" component={appointmentInfo}/>
          {this.judgeIsTest('localTest') && <Route exact path="/reservation-service/global-errands" component={GlobalErrands}/>}
          <Route exact path="/reservation-service/global-errands/edit-progress" component={EditProgress}/>
          {/*商品管理*/}
          <Route exact path="/commodities-manage/commodities-database"
                 component={commoditiesDataBase}/>
          <Route exact path="/commodities-manage/commodities-database/create-and-edit"
                 component={commoditiesCreateAndEdit}/>
          <Route exact path="/commodities-manage/commodities-database/commodities-img-list"
                 component={commoditiesImgList}/>

          {/*开发人员专用管理路由*/}
          {this.judgeIsTest('localTest') && <Route exact path="/developer-pages/import-excel" component={importExcel}/>}

          {/*这里可以配置404 not found 页面*/}
          <Route component={page404}/>

        </Switch>
      </div>
    )
  }
}

export default ContentMain;