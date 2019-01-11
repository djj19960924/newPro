import React from 'react';
import { Button, Form, Select, Input, Upload, message, Icon, Modal, } from 'antd';
import {inject, observer} from 'mobx-react/index';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

@inject('appStore') @observer @Form.create()
class commoditiesCreateAndEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // 图片文件
      fileList: [],
      // 摄像头弹窗
      cameraModalVisible: false,
      // 拍照file暂存
      // cameraFileOrigin: {},
      // 照片暂存数据
      cameraFileData: {},
      // 图片预览
      previewVisible: false,
      previewImage: '',
    };
  }
  // 组件加载前触发
  componentWillMount() {
    // 接收组件query传值
    console.log(this.props.location.query);
    console.log(!!this.props.location.query);
    // this.getMedia()
  }
  // render渲染完成以后处理
  componentDidMount() {
    // if (this.state.cameraModalVisible) {
    //   this.openCamera()
    // }
  }
  //
  componentDidUpdate() {
    if (this.state.cameraModalVisible) {
      this.getMedia()
    }
  }
  // 返回上一个界面
  backTo() {
    this.props.history.goBack()
  }
  // 查看图片
  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  // 关闭图片预览
  closePreview() {
    this.setState({
      previewVisible: false,
    })
  }
  // 图片改变时触发
  handleChange(val){
    console.log(val.fileList);
    console.log('----------------------------');
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
    });
  }
  // 打开摄像头弹窗
  openCamera() {
    this.setState({
      cameraModalVisible: true
    })
    // this.openCamera()
  }
  // 关闭摄像头弹窗
  closeCamera() {
    this.setState({
      cameraModalVisible: false,
    });
    // 关闭弹窗的同时暂停视频播放
    document.getElementById("video").pause()
  }
  // 获取摄像头
  getMedia() {
    let constraints = {
      video: {width: 480, height: 360},
      audio: true
    };
    //获得video摄像头区域
    // let video = document.getElementById("video");

    //这里介绍新的方法，返回一个 Promise对象
    // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
    // then()是Promise对象里的方法
    // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
    // 避免数据没有获取到
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(function(MediaStream) {
      document.getElementById("video").srcObject = MediaStream;
      document.getElementById("video").play();
    });
  }
  // 拍照
  takePhoto() {
    //获得Canvas对象
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 480, 360);
    // console.log(canvas.toDataURL("image/jpeg"))
    let file = this.dataURLtoFile(canvas.toDataURL("image/jpeg"),'照片.jpg');
    console.log(file);
    this.setState({
      cameraFileData: {
        thumbUrl: canvas.toDataURL("image/jpeg"),
        uid: `upload_photo_${(parseInt(Math.random()*1000000000))}`,
        originFileObj: file,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        percent: file.percent,
        size: file.size,
        type: file.type,
      },
    })
    // lastModified: 1468669390514
    // lastModifiedDate: Sat Jul 16 2016 19:43:10 GMT+0800 (中国标准时间) {}
    // name: "img0.jpg"
    // originFileObj: File(226091) {uid: "rc-upload-1547204607063-2", name: "img0.jpg", lastModified: 1468669390514, lastModifiedDate: Sat Jul 16 2016 19:43:10 GMT+0800 (中国标准时间), webkitRelativePath: "", …}
    // percent: 0
    // size: 226091
    // thumbUrl: "data:image/jpeg;base64,/9j/2wCEAAICAgICAgICAgIDAgI"
    // type: "image/jpeg"
    // uid: "rc-upload-1547204607063-2"
  }
  // base64码转为file方法
  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  // 添加照片进fileList
  addToFileList() {
    const { fileList, cameraFileData, } = this.state;
    let dataList = [];
    for (let i of fileList) {
      dataList.push(i)
    }
    console.log(dataList);
    // console.log(this.state.cameraFile);
    // console.log(this.state.fileList);
    if (!!cameraFileData.originFileObj) {
      if (fileList.length < 3) {
        //
        //
        // 这里需要照片判重!!!
        //
        //
        let fileData = cameraFileData;
        // console.log(cameraFileData);
        dataList.push(fileData);
        this.setState({
          fileList: dataList
        });
        this.closeCamera();
      } else {
        message.error('商品照片不能超过3张!')
      }
    } else {
      message.error('请先拍照!')
    }
  }
  // 自定义上传
  uploadFunction() {
    let formData = new FormData(),fileList = [];

    // 单文件格式
    // let file;
    // file = this.state.fileList[0].originFileObj;
    // formData.append('files',file);
    // console.log(formData.get('files'));

    // 多文件格式
    for (let i in this.state.fileList) {
      // formData.append(`file${parseInt(i)+1}`,this.state.fileList[i].originFileObj);
      formData.append(`files[${i}]`,this.state.fileList[i].originFileObj);
      fileList.push(this.state.fileList[i].originFileObj)
    }
    console.log(fileList)
    // debugger

    fetch(`${window.testUrl}/skuUpimg/headImgUpload`,{
      method: 'POST',
      body: formData,
    }).then(r=>r.json()).then(r=>{
      console.log(r)
    })
  }
  // 上传前控制
  beforeUploadFunction(file,fileList) {
    // 禁用默认上传行为
    return false;
  }
  // 测试用function
  test() {
    // console.log(this.props.form.getFieldValue('fileList').fileList);
    console.log(this.state)
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const { fileList, cameraModalVisible, previewVisible, previewImage, } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="commoditiesCreateAndEdit">
        新增或修改商品界面
        <Button type="primary" onClick={this.backTo.bind(this)}>返回上一个页面</Button>

        {/*表单*/}
        <div className="formList">
          <Form>
            <FormItem label="测试表单值"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 12}}
                      // validator={this.brandNameValidator}
            >
              {getFieldDecorator('testValue', {
                // 表单验证
                rules: [
                  {required: true, message: '请输入测试表单值!'},
                  // {validator: this.brandNameValidator.bind(this)}
                ],
                // 默认值
                // initialValue:
              })(
                <Input style={{width: 180}}
                       placeholder="请输测试表单值"
                />
              )}
            </FormItem>
            <FormItem label="商品照片"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 12}}
                      style={{overflow:'hidden'}}
            >
                <Upload fileList={fileList}
                        supportServerRender
                        beforeUpload={this.beforeUploadFunction.bind(this)}
                        // 允许一次上传多个文件
                        multiple
                        // 预览类型
                        listType="picture-card"
                        // 接受上传的文件类型 允许(jpg,jpeg,png,gif)
                        accept="image/jpeg,image/png,image/gif"
                        onPreview={this.handlePreview.bind(this)}
                        onChange={this.handleChange.bind(this)}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              <Button type="primary"
                      disabled={fileList.length >= 3 ? true : false}
                      onClick={this.openCamera.bind(this)}
              >拍照上传</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">提交!</Button>
              <Button onClick={this.test.bind(this)}>test!</Button>
            </FormItem>
          </Form>
        </div>

        {/*摄像头弹窗*/}
        <Modal width={1018}
               title="使用摄像头拍照"
               visible={cameraModalVisible}
               onCancel={this.closeCamera.bind(this)}
               centered
               wrapClassName="modalWrap"
               closable={false}
               footer={
                 <div style={{textAlign:'center'}}>
                   <Button type="primary"
                           onClick={this.addToFileList.bind(this)}
                   >确定</Button>
                   <Button style={{marginLeft:20}}
                           onClick={this.closeCamera.bind(this)}
                   >取消</Button>
                 </div>
               }
        >
          <div className="cameraMain">
            <video id="video"
                   width={480}
                   height={360}
                   // 禁音
                   muted
                   autoPlay="autoplay"
            />
            <canvas id="canvas"
                    width={480}
                    height={360}
                    style={{marginLeft: 10}}
            />
            <div className="takePhotoLine"
                 style={{textAlign: 'center', marginTop: '10px'}}
            >
              <Button type="primary"
                      style={{
                        backgroundColor: '#b917ff',
                        borderColor: '#b917ff'
                      }}
                      onClick={this.takePhoto.bind(this)}
              >拍照</Button>
            </div>
          </div>
        </Modal>
        {/*图片预览*/}
        <Modal visible={previewVisible}
               footer={null}
               onCancel={this.closePreview.bind(this)}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default commoditiesCreateAndEdit;