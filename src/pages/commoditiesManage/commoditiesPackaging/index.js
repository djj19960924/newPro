import React from 'react';
import { message, Icon, } from 'antd';

import './index.less';
class commoditiesPackaging extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 判断页面是否为激活状态, 当 window 失去焦点时, 页面进入待机遮罩状态
      isFocusOnWindow: true,
      // 加载显示
      loadingShow: false,
    };
  }

  componentDidMount() {
    let unionId = null;
    if (window.getCookie('unionId') !== null) {
      unionId = window.getCookie('unionId');
    } else if (window.getQueryString('unionId') !== null) {
      unionId = window.getQueryString('unionId');
      window.setCookie('unionId',unionId,3600)
    } else {
      message.warn(`请用户登陆`);
      this.props.history.push(`/commodities-manage/commodities-packaging/customer-login`);
      return false
    }
    fetch(`${window.fandianUrl}/parcelManagement/getParcelProductListByUnionId`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      // body: JSON.stringify({unionId:unionId})
      body: JSON.stringify({unionId:123123})
    }).then(r => r.json()).then(r => {
      console.log(r);
    }).catch(() => {

    })
  }


  render() {
    const { isFocusOnWindow, loadingShow, } = this.state;
    return (
      <div className="commoditiesPackaging ">
        <h1>商品录入,箱子打包</h1>


        {isFocusOnWindow &&
        // 遮罩层, 用于保证用户焦点停留于该页面中, 否则显示该遮罩, 并提示需要点击
        <div className="isFocusOnWindow"
             onClick={() => this.setState({isFocusOnWindow: false})}
        >
          <p className="focusInfo"><Icon type="info-circle" /> 请点击屏幕, 以便确保页面可以获取扫码器数据</p>
        </div>
        }

        {loadingShow &&
        // 遮罩层, 用于显示加载画面
        <div className="loadingShow">
          <p className="loadingTxt"><Icon type="loading" /> 获取用户信息中, 请稍后...</p>
        </div>
        }
      </div>
    )
  }
}

export default commoditiesPackaging;