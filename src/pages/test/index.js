import React from 'react';
import { Upload, Icon, Modal, Button, message, } from 'antd';

class test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploading: false,
    };
    window.test = this;
  }
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange(val){
    // console.log(val)
    console.log(val.fileList);
    console.log('----------------------------')
    // console.log(!!val.fileList[val.fileList.length-1].uid)
    // console.log(this.state.fileList)
    // console.log('----------------------------')
    // this.setState({
    //   fileList: val.fileList
    // });
    var dataList = [];
    if (val.fileList.length > 0) {
      if (!!val.fileList[val.fileList.length-1].uid) {
        if (val.fileList.length > 3) {
          for (let i in val.fileList) {
            if (i < 3) {
              dataList.push(val.fileList[i])
            }
          }
          message.warning('最多上传3个文件!')
        } else {
          dataList = val.fileList;
        }
      }
    } else {
      dataList = val.fileList;
    }
    this.setState({
      fileList: dataList
    })
  };
  // 组件即将加载前触发
  componentWillMount() {
    // fetch(`${window.testUrl}/skuUpimg/headImgUpload`,{
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: ``,
    // }).then(r=>r.json()).then(r=>{
    //   console.log(r)
    // })
  }
  // 自定义上传
  uploadFunction() {
    let formData = new FormData();

    // 单文件格式
    // let file;
    // file = this.state.fileList[0].originFileObj;
    // formData.append('files',file);
    // console.log(formData.get('files'));

    // 多文件格式
    for (let i in this.state.fileList) {
      formData.append(`file${parseInt(i)+1}`,this.state.fileList[i].originFileObj);
    }


    fetch(`http://192.168.3.25:8000/skuUpimg/headImgUpload`,{
      method: 'POST',
      body: formData,
    }).then(r=>r.json()).then(r=>{
      console.log(r)
    })
  }
  // 上传前控制
  beforeUploadFunctiong(file,fileList) {
    // console.log(file,fileList)
    // this.setState({
    //   fileList: fileList,
    // })

    // 禁用默认上传行为
    return false;
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        if (this.state.fileList.length < 3) {
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }));
        } else {
          message.warning('最多上传3个文件!')
        }
        return false;
      },
    };
    return (
      <div className="test" style={{width:'100%',height:'100%',backgroundColor:'#fff'}}>
        你进入了隐藏的test页面, 现在这个前端页面都由你掌控了
        <div className="testMain">
          <div className="uploadLine"
               // 上传按钮消失以后仅剩的图片样式为float:left, 需要hidden获取其高度
               style={{overflow:'hidden'}}
          >
            <Upload fileList={fileList}
                    beforeUpload={this.beforeUploadFunctiong.bind(this)}
              // 允许一次上传多个文件
                    multiple
              // 预览类型
                    listType="picture-card"
              // 接受上传的文件类型 允许(jpg,jpeg,png,gif)
                    accept="image/jpeg,image/png,image/gif"
              // multiple={true}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange.bind(this)}
              // 自定义上传
              // customRequest={this.uploadFunction.bind(this)}
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
          </div>
          {/*<Upload*/}
          {/*/>*/}
          <div className="btnLine">
            <Button type="primary">拍照</Button>
            <Button type="primary"
                    onClick={this.uploadFunction.bind(this)}
            >上传</Button>
          </div>
          <Modal visible={previewVisible}
                 footer={null}
                 onCancel={this.handleCancel.bind(this)}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </div>
    )
  }
}

export default test;