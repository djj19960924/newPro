import React from 'react';
import { message, Button, Upload, Icon, Modal, } from 'antd';
import './index.less';

class updateQRCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: ``,
      uploadLoading: false,
      // 图片文件
      fileList: [],
      // 图片预览
      previewVisible: false,
      previewImage: '',
    };
  }
  componentDidMount() {
    this.selectMaxRebateByRebateDate()
  }

  // 获取当前日上二维码图片
  selectMaxRebateByRebateDate() {
    this.setState({previewImage: ``});
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

  // 上传图片
  uploadFunction() {
    const { fileList, } = this.state;
    if (fileList.length > 0) {
      this.setState({uploadLoading: true});
      let formData = new FormData();
      formData.append(`file`,fileList[0].originFileObj);
      // 上传接口
      fetch(`${window.fandianUrl}/upimg/mallImgUpload`,{
        method: 'POST',
        body: formData
      }).then(r=>r.json()).then(r=>{
        if (r.status) {
          if (r.status === 10000) {
            message.success(`${r.msg}`);
            this.setState({fileList: [],uploadLoading: false});
            this.selectMaxRebateByRebateDate();
          } else {
            message.error(`${r.msg}, 错误码: ${r.status}`);
            this.setState({uploadLoading: false})
          }
        } else {
          message.error('后端数据格式错误');
          this.setState({ uploadLoading: false });
        }
      }).catch(() => {
        message.error('前端错误: 图片上传接口调取失败!');
        this.setState({ uploadLoading: false });
      })
    } else if (fileList.length === 0) {
      message.error(`请选择图片文件`)
    } else{
      message.error(`前端错误: 文件数据错误`)
    }
  }

  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => { return null }
  }
  render() {
    const { imgUrl, previewVisible, previewImage, fileList, uploadLoading, } = this.state;
    const uploadButton = <div><Icon type="plus" /><div className="ant-upload-text">添加图片</div></div>;
    return (
      <div className="updateQRCode">
        <h1 className="title">当前日上二维码图片</h1>
        <div>
          {imgUrl ? <img className="QRCodeImg"
                          src={imgUrl}
                          alt=""
          /> : <div className="loadingImg"><Icon type="loading" /> 加载图片中...</div>}
        </div>

        <div className="imgEdit">
          <Upload fileList={fileList}
                  supportServerRender
                  beforeUpload={() => {return false}}
                  // 预览类型
                  listType="picture-card"
                  accept="image/jpeg,image/png"
                  onPreview={(f) => { this.setState({ previewImage: f.url || f.thumbUrl, previewVisible: true, })} }
                  onChange={(f) => { this.setState({fileList:f.fileList})} }
          >
            {fileList.length > 0 ? null : uploadButton}
          </Upload>
        </div>

        <div className="btnLine">
          <Button type="primary"
                  onClick={this.uploadFunction.bind(this)}
                  loading={uploadLoading}
          >上传图片</Button>
        </div>

        {/*图片预览弹窗*/}
        <Modal visible={previewVisible}
               footer={null}
               onCancel={() => this.setState({previewVisible: false})}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default updateQRCode;