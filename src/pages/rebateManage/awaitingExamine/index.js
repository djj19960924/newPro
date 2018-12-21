import React from 'react';
import { Select } from 'antd';
import ImageViewer from '@components/imageViewer/main';
import { Form, Icon, Input, Button, Checkbox, message, } from 'antd';
import { inject, observer } from 'mobx-react/index';

import './index.less';

const Option = Select.Option;
let shopList = [];
const testList = [];
for (let l = 0; l<50; l++) {
  testList.push({shopName: '乐天商场'})
}
for (let i = 0; i<50; i++) {
  shopList.push(<Option key={i}>{testList[i].shopName + i}</Option>)
}

@inject('appStore') @observer @Form.create()
class awaitingExamine extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showImageViewer: false,
      imgSrc: require('@img/avatar.png'),
    };
  }
  selectShop(val, option) {
    console.log(val, option.props.children)
  }
  openImageViewer() {
    this.setState({
      showImageViewer: true,
    })
  };
  closeImageViewer() {
    this.setState({
      showImageViewer: false,
    })
  }
  // 接口测试
  test() {
    fetch("http://192.168.3.32:8088/recipt/checkReciptAllow",{
      method:"POST",
      headers:{'Content-Type': 'application/json'},
      // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body: JSON.stringify({
        mallName:'aaa',
        teamNo:'aaa',
        consumeMoney:222,
        reciptAttribute:'aaa',
        brandName:'aaa',
        consumeDate:'aaa',
        rebateRate:15,
        reciptMoney:111,
        note:0,
        unionId:'1',
      }),
      // body: 'mallName=乐天商场&pageNum=1&pageSize=10',
      // body: JSON.stringify({mallName:"乐天商场",pageNum:1,pageSize:10}),
    }).then(r => r.json()).then(r=>{
      console.warn('接口通啦:')
      console.warn(r)
    })
  }
  render() {
    let { showImageViewer, imgSrc, } = this.state;
    return (
      <div className="awaitingExamine">
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  onChange={this.selectShop}
          >
            {shopList}
          </Select>
          <span onClick={this.test} style={{cursor:'pointer'}}> 接口测试! </span>
        </div>
        <div className="container">
          <div className="containerBody containerImage">
            {/*单图片功能*/}
            <img className="previewImage"
                 src={imgSrc}
                 alt=""
                 onClick={this.openImageViewer.bind(this)}
            />
          </div>
          <div className="containerBody containerForm">

          </div>
        </div>

        {showImageViewer &&
        <ImageViewer // 图片链接, 上为图片查看器开关
                     imgSrc={imgSrc}
                     // 关闭图片查看
                     closeImageViewer={()=>this.closeImageViewer()}
                     option={{
                       // 添加图片拖拽功能
                       move: true,
                       // 添加图片旋转功能
                       rotate: true,
                       // 添加鼠标滚轮放大缩小功能
                       zoom: true,
                       // 添加遮罩层, 点击遮罩层可以关闭图片预览
                       shadow: false,
                     }}
        />}
      </div>
    );
  }
}

export default awaitingExamine;