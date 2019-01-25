import React from 'react';
import { Radio, Table, Button, Modal, } from 'antd';
// import XLSX from 'xlsx';
// xlsx转blob
import '@js/FileSaver.min.js';

import './index.less';

class countBillList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 选择条件
      verifyStatus: 0,
      // 表格数据
      tableDataList: [],
      // 选中条目
      selectedList: [],
      // 分页
      pageNum: 1,
      pageSize: 20,
      // 图片弹窗
      previewVisible: false,
      previewImage: '',
    };
    window.countBillList = this;
    // window.XLSX = XLSX;
  }
  // 默认读取表格
  componentWillMount() {
    // 默认载入表格数据
    this.getReciptByVerify()
  }
  // 改变发送状态
  changeVerifyStatus(e) {
    this.setState({
      verifyStatus: e.target.value
    });
    this.getReciptByVerify(e.target.value)
  }
  // 根据发送状态获取对账表
  getReciptByVerify(n = this.state.verifyStatus, pageNum = this.state.pageNum, pageSize = this.state.pageSize) {
    // fetch(`${window.apiUrl}/sku/getReciptByVerify`, {
    fetch(`http://192.168.3.32:8000/recipt/getReciptByVerify`,{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`verifyStatus=${n}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      // console.log(r)
      this.setState({
        tableDataList: r.data ? r.data.list : []
      })
    })
  }
  // 打开弹窗
  openPreview(url) {
    console.log(url)
    this.setState({
      previewVisible: true,
      previewImage: url
    })
  }
  // 关闭弹窗
  closePreview() {
    this.setState({
      previewVisible: false,
      previewImage: ''
    })
  }
  // 发送
  submit() {
    const { selectedList } = this.state;
    let data = [];
    for (let v of selectedList) {
      data.push({
        consumeDate: v.consumeDate,
        consumeMoney: `${v.consumeMoney}`,
        passport: v.passport,
        pictureUrl: v.pictureUrl,
      })
    }
    console.log(data);
    fetch(`http://192.168.3.32:8000/recipt/sendReciptInSelected`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(r => r.json()).then(r => {
      console.log(r)
    })
  }
  // 导出excel方法
  // exportExcel () {
  //   let elt = document.getElementById('tableList');
  //   let wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
  //
  //   // 转为下载文件
  //   XLSX.writeFile(wb, `test.xlsx`);
  //
  //   // 转为blob
  //   // 不会阻止文件下载行为
  //   let blob = XLSX.write(wb,{ bookSST:false, type:'base64' });
  //   window.saveAs(new Blob([blob],{type:"application/octet-stream"}), "test.xlsx");
  // }
  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    // 表单头
    const columns = [
      {title: '小票照片', dataIndex: 'pictureUrl', key: 'pictureUrl', width: 140,
        render: (text, record) => (
          <Button onClick={this.openPreview.bind(this,record.pictureUrl)}
          >点击查看</Button>
        ),
      },
      {title: '护照首页照片', dataIndex: 'passport', key: 'passport', width: 140,
        render: (text, record) => (
          <Button onClick={this.openPreview.bind(this,record.passport)}
          >点击查看</Button>
        ),
      },
      {title: '小票购买时间', dataIndex: 'consumeDate', key: 'consumeDate', width: 140},
      {title: '小票金额', dataIndex: 'consumeMoney', key: 'consumeMoney', width: 140},
      // {title: 'reactDOM示例', dataIndex: 'sugPostway', key: 'sugPostway', width: 100,
      //   render: (text, record) => (
      //     // 这里调用方法判断行邮方式
      //     <a href="https://baidu.com">{record.sugPostway}</a>
      //   ),
      // },
    ];
    const { tableDataList, verifyStatus, previewVisible, previewImage, } = this.state;
    return (
      <div className="countBillList">
        {/*查询条件单选行*/}
        <RadioGroup buttonStyle="solid"
                    className="radioBtn"
                    value={verifyStatus}
                    onChange={this.changeVerifyStatus.bind(this)}
        >
          <RadioButton value={0}>未发送</RadioButton>
          <RadioButton value={1}>已发送</RadioButton>
        </RadioGroup>

        {/*执行行*/}
        <div className="btnLine">
          <Button type="primary"
                  onClick={this.submit.bind(this)}
          >选中发送对账</Button>
        </div>

        {/*图片预览弹窗*/}
        <Modal visible={previewVisible}
               footer={null}
               onCancel={this.closePreview.bind(this)}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        {/*表单主体*/}
        <Table className="tableList"
               dataSource={tableDataList}
               columns={columns}
               pagination={false}
               // loading
               bordered
               rowSelection={{
                 // 选择框变化时触发
                 onChange: (selectedRowKeys, selectedRows) => {
                   this.setState({selectedList: selectedRows})
                   console.log(selectedRowKeys, selectedRows)
                 },
               }}
               scroll={{ y: 600 }}
               // style={{maxWidth: 1200}}
               rowKey={(record, index) => `${record.reciptId}`}
        />
      </div>
    )
  }
}

export default countBillList;