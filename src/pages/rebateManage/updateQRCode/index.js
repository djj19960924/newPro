import React from 'react';
import { message, Button, Upload, Icon, Modal, } from 'antd';
import PageLoading from '@components/pageLoading/';
import './index.less';

class updateQRCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: ``,
      // 图片文件
      fileList: [],
      // 图片预览
      previewVisible: false,
      previewImage: '',
      // Loading状态
      isLoading: false,
      // Loading提示文字
      loadingTxt: ''
    };
  }
  componentDidMount() {
    this.selectMaxRebateByRebateDate()
  }

  // 获取日上当前二维码图片
  selectMaxRebateByRebateDate() {
    // nationName: 中国
    fetch(`${window.fandianUrl}/rebate/selectMaxRebateByRebateDate`,{
      method: `POST`,
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body: `nationName=${encodeURIComponent(`中国`)}`
    }).then(r => r.json()).then(r => {
      if (r.data) {
        if (!!r.data[0]) this.setState({imgUrl: r.data[0].mallImgUrl})
      } else {
        message.error(`后端数据类型错误`)
      }
    }).catch(()=>{
      message.error(`前端错误: 调取接口失败`)
    })
  }
  render() {
    const { imgUrl, loadingTxt, } = this.state;
    return (
      <div className="updateQRCode">
        {loadingTxt && <PageLoading loadingTxt={loadingTxt}/>}
        <h1 className="title">当前日上二维码图片</h1>
        <div>
          <img className="QRCodeImg"
               src={imgUrl}
               alt=""
          />
        </div>
        <div className="btnLine">
          <Button
          >点击上传图片</Button>
        </div>
      </div>
    )
  }
}

export default updateQRCode;