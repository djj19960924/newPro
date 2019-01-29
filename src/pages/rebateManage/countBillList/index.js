import React from 'react';
import { Radio, Table, Button, Modal, message, } from 'antd';
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
      // 选中条目ID
      selectedIds: [],
      // 分页
      pageNum: 1,
      pageSize: 20,
      // 图片弹窗
      previewVisible: false,
      previewImage: '',
      isLoading: false,
    };
    window.countBillList = this;
    // window.XLSX = XLSX;
  }
  // 默认读取表格
  componentDidMount() {
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
    fetch(`${window.fandianUrl}/recipt/getReciptByVerify`,{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`verifyStatus=${n}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      if (r.status === 10000) {
        this.setState({
          tableDataList: r.data ? r.data.list : []
        })
      } else {
        message(`${r.msg} 错误码: ${r.status}`)
      }
    })
  }
  // 打开弹窗
  openPreview(url) {
    // console.log(url)
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
    const { selectedList, selectedIds, } = this.state;
    if (selectedList.length > 0 && selectedIds.length > 0) {
      this.setState({isLoading: true});
      let data = {};
      data.list = [];
      data.reciptIdList = selectedIds;
      for (let v of selectedList) {
        data.list.push({
          consumeDate: v.consumeDate,
          consumeMoney: `${v.consumeMoney}`,
          passport: v.passport,
          passportNum: v.passportNum,
          pictureUrl: v.pictureUrl,
        });
      }
      // console.log(data);
      fetch(`${window.fandianUrl}/recipt/sendReciptInSelected`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      }).then(r => r.json()).then(r => {
        if (r.status === 10000) {
          message.success(r.data);
          this.setState({
            isLoading: false,
            selectedList: [],
            selectedIds: [],
          });
          this.getReciptByVerify();
        } else {
          message.error(`${r.data} 错误码: ${r.status}`)
        }
      }).catch(r=>{
        message.error(`请求发送失败`)
      })
    } else {
      message.error('未选择小票')
    }
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
      {title: '护照号码', dataIndex: 'passportNum', key: 'passportNum', width: 140},
      {title: '护照首页照片', dataIndex: 'passport', key: 'passport', width: 140,
        render: (text, record) => (
          <Button onClick={this.openPreview.bind(this,record.passport)}
          >点击查看</Button>
        ),
      },
      {title: '小票购买时间', dataIndex: 'consumeDate', key: 'consumeDate', width: 140},
      {title: '小票金额', dataIndex: 'consumeMoney', key: 'consumeMoney', width: 140},
    ];
    const { tableDataList, verifyStatus, previewVisible, previewImage, isLoading, selectedList, selectedIds,} = this.state;
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
        <div className="btnLine" style={{marginLeft: 10}}>
          {verifyStatus === 0 && <Button type="primary"
                                         onClick={this.submit.bind(this)}
                                         loading={isLoading}
                                         disabled={selectedList.length === 0}
          >发送所选小票</Button>}
        </div>

        {/*图片预览弹窗*/}
        <Modal visible={previewVisible}
               width={800}
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
               rowSelection={verifyStatus === 0 ? {
                 selectedRowKeys: selectedIds,
                 // 选择框变化时触发
                 onChange: (selectedRowKeys, selectedRows) => {
                   this.setState({selectedList: selectedRows,selectedIds: selectedRowKeys});
                   // console.log(selectedRowKeys, selectedRows)
                 },
               } : null}
               scroll={{ y: 600, x: 800 }}
               rowKey={(record, index) => `${record.reciptId}`}
        />
      </div>
    )
  }
}

export default countBillList;