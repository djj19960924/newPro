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
            <div className="infoTitle" >2019－4-16 更新</div>
            <div className="dividingLine shot" />
            <p>对账管理：发送excel优化为下载图片包（护照＋小票）</p>
          </div>
          <div className="updateInfo">
            <div className="infoTitle" >2019-04-15 更新</div>
            <div className="dividingLine shot" />
            <p>1.邮路整体功能上线</p>
            <p>2.预约挂团：</p>
            <p>1）增加驳回功能</p>
            <p>2）新罗新世界商场团号增加失效时间设置</p>
            <p>3）挂团导出Excel字段调整</p>
            <p style={{color:'#aaa'}}>开发相关－优化部分项目结构, 优化部分功能方法, 优化部分报错样式以及逻辑</p>
          </div>
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