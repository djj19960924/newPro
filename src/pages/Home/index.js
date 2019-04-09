import React from 'react';
import './index.less';

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Home">
        <p className="title" >
          <span>欢迎使用BuyersHouse后台管理系统</span>
        </p>

        <div className="dividingLine" />

        <div className="main">
          <div className="updateInfo">
            <div className="infoTitle" >2019-04-09 更新</div>
            <div className="dividingLine shot" />
            <p>商品资料库－待到出备案，支持下载图片包</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;