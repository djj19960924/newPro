import React from 'react';
import { message, } from 'antd';

import './index.less';
class commoditiesPackaging extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 这里做重定向, 用于判断是否有用户信息
    if (`如果没有用户登陆信息`) {
      message.warn(`需要用户登陆`);
      this.props.history.push(`/commodities-manage/commodities-packaging/customer-login`);
    }
  }


  render() {
    return (
      <div className="commoditiesPackaging ">
        商品录入,箱子打包
      </div>
    )
  }
}

export default commoditiesPackaging;