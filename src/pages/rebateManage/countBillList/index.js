import React from 'react';
import { Radio, Table, Button, Modal, message, Pagination, } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
// xlsx转blob
// import '@js/FileSaver.min.js';

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
      pageTotal: 0,
      pageNum: 1,
      pageSize: 200,
      pageSizeOptions: [`100`,`200`,`300`,`500`],
      // 图片弹窗
      previewVisible: false,
      previewImage: '',
      btnIsLoading: false,
      tableIsLoading: false,
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
    this.setState({tableIsLoading: true});
    fetch(`${window.fandianUrl}/recipt/getReciptByVerify`,{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`verifyStatus=${n}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      if (r.status === 10000) {
        if (r.data) {
          if (this.state.pageSize >= r.data.total) {
            for (let i in r.data.list) {
              r.data.list[i].id = (parseInt(i)+1)
            }
            this.setState({
              tableDataList: r.data.list,
              pageTotal: r.data.total,
              pageSizeOptions: [`100`,`200`,`300`,`${r.data.total > 500 ? r.data.total : 500}`],
              selectedList: [],
              selectedIds: [],
            })
          } else {
            this.setState({pageSize: r.data.total}, () => {
              this.getReciptByVerify()
            })
          }
        } else {
          message.warn(`${r.msg}`);
          this.setState({tableDataList: [],pageTotal: 0})
        }
      } else {
        if (r.state) { message.error(`${r.msg}, 错误码: ${r.status}`);
          this.setState({tableDataList: [],pageTotal: 0}) }
        else { message.error(`后端数据错误`);
          this.setState({tableDataList: [],pageTotal: 0}) }
      }
      this.setState({tableIsLoading: false});
    }).catch(()=>{
      message.error(`前端错误: 对账表信息接口调取失败`);
      this.setState({tableDataList: [],pageTotal: 0,tableIsLoading: false})
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
  changePage(pageNum,pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },()=>{
      this.getReciptByVerify()
    })
  }
  // 发送
  submit() {
    const { selectedList, selectedIds, } = this.state;
    if (selectedList.length > 0 && selectedIds.length > 0) {
      this.setState({btnIsLoading: true});

      let elt = document.getElementById('tableListForExport');
      let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
      XLSX.writeFile(wb, `对账表单 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`);

      let data = {};
      data.list = [];
      data.reciptIdList = selectedIds;
      for (let v of selectedList) {
        data.list.push({
          // consumeDate: v.consumeDate,
          // consumeMoney: `${v.consumeMoney}`,
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
            btnIsLoading: false,
            selectedList: [],
            selectedIds: [],
          });
          this.getReciptByVerify();
        } else {
          if (r.status) {
            message.error(`${r.data} 错误码: ${r.status}`)
          } else {
            message.error(`后端数据错误`)
          }
        }
      }).catch(()=>{
        message.error(`前端错误: 请求发送失败`)
      })
    } else {
      message.error('未选择小票')
    }
  }
  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    // 表单头
    const columns = [
      {title: `序号`, dataIndex: `id`, key: 'id', width: 50},
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
      // {title: '小票购买时间', dataIndex: 'consumeDate', key: 'consumeDate', width: 140},
      // {title: '小票金额', dataIndex: 'consumeMoney', key: 'consumeMoney', width: 140},
    ];
    const columnsAdd = {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 140,};
    const columnsForExport = [
      {title: `序号`, dataIndex: `id`, key: 'id', width: 50},
      {title: '小票照片', dataIndex: 'pictureUrl', key: 'pictureUrl', width: 140},
      {title: '护照号码', dataIndex: 'passportNum', key: 'passportNum', width: 140},
      {title: '护照首页照片', dataIndex: 'passport', key: 'passport', width: 140},
    ];
    const { tableDataList, verifyStatus, previewVisible, previewImage, btnIsLoading, selectedList, selectedIds, pageTotal, pageSize, pageNum, pageSizeOptions, tableIsLoading, } = this.state;
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

        <span>共计: {pageTotal} 条</span>

        {/*执行行*/}
        <div className="btnLine" style={{marginLeft: 10}}>
          {verifyStatus === 0 && <Button type="primary"
                                         onClick={this.submit.bind(this)}
                                         loading={btnIsLoading}
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

        {/*导出用表单*/}
        <Table className="tableListForExport"
               id="tableListForExport"
               dataSource={selectedList}
               columns={columnsForExport}
               pagination={false}
               style={{display: `none`}}
        />

        {/*表单主体*/}
        <Table className="tableList"
               dataSource={tableDataList}
               columns={verifyStatus === 0 ? columns : columns.concat(columnsAdd)}
               pagination={false}
               loading={tableIsLoading}
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
        {/*分页*/}
        <Pagination className="tablePagination"
                    total={pageTotal}
                    pageSize={pageSize}
                    current={pageNum}
                    showTotal={(total, range) =>
                      `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`
                    }
                    style={{float:'right',marginRight:20,marginTop:10,marginBottom: 20}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={pageSizeOptions}
                    onShowSizeChange={this.changePage.bind(this)}
        />
      </div>
    )
  }
}

export default countBillList;