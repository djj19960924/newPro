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
            <div className="infoTitle" >2019-04-15 更新</div>
            <div className="dividingLine shot" />
            <p>Excel表格导出页面－优化导出Excel表格名称格式</p>
            <p>预约打包页面－去掉接机服务功能, 该功能已迁移至预约接送机</p>
            <p>预约挂团－更新分页, 驳回, 商场团号添加失效时间等相关功能</p>
            <p>邮路推单－加入一键导入Excel功能</p>
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