import React from 'react';
import { Radio, Table, Button, Modal, message, Pagination, Input, } from 'antd';
import moment from 'moment';

import './index.less';

class appointmentTeamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 预约状态
      appointmentStatus: 0,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      pageSizeOptions: [`10`,`20`,`30`,`40`],
      // 表格所选行
      selectedList: [],
      selectedIds: [],
      // 表单数据
      dataList: [],
      // 弹窗查看图片
      previewVisible: false,
      previewImage: ``,
      // 编辑行
      showEdit: {},
      // 按钮loading状态
      isLoading: false,
      // input输入框
      inputValue: {},
    };
    window.appointmentTeamManage = this;
  }
  componentDidMount() {
    this.getAppointmentByStatus()
  }
  // 搜索预约信息
  getAppointmentByStatus(status = this.state.appointmentStatus,pageNum = this.state.pageNum, pageSize = this.state.pageSize) {
    fetch(`${window.fandianUrl}/AppointmentMangement/getAppointmentByStatus`,{
      method: `POST`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      if (r.status === 10000) {
        this.setState({
          dataList: r.data.list,
          pageSizeOptions: [`10`,`20`,`30`,(r.data.total > 40 ? r.data.total.toString() : `40`)],
          pageTotal: r.data.total,
        })
      } else {
        message.error(`${r.msg} 错误码: ${r.status}`)
      }
    }).catch(()=>{
      message.error(`接口调取失败`)
    })
  }
  // 打开图片弹窗
  openPreview(url) {
    this.setState({
      previewVisible: true,
      previewImage: url,
    })
  }
  // 切换编辑
  toggleEdit(v,b) {
    const { showEdit, } = this.state;
    let dataObj = {};
    for (let n in showEdit) {
      dataObj[n] = false;
    }
    dataObj[`editRow_${v}`] = b;
    this.setState({showEdit: dataObj},()=>{
      // 当切换为 input 输入框时, 自动对焦, 使焦点锁定当前所打开的 input 框,
      // 从而使 input 失去焦点时, 可以恢复为其他显示方式
      let item = document.getElementsByClassName(`input_${v}`)[0];
      if (!!item) {
        // toggle 为双向绑定, 当关闭 input 时, 无需强制对焦
        item.focus();
      }
    })
  }
  // 失去焦点
  loseBlur(v,b) {
    const { inputValue, } = this.state;
    if (!inputValue[`input_${v}`]) {
      this.toggleEdit(v,b);
    }
  }
  // 更改团号
  submitMassNo(v,id) {
    const { inputValue, } = this.state;
    if (!!inputValue[`input_${v}`]) {
      fetch(`${window.fandianUrl}/AppointmentMangement/editMassNoById`, {
        method: `POST`,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id:id,massNo:inputValue[`input_${v}`]}),
      }).then(r => r.json()).then(r => {
        console.log(r);
        if (r.status === 10000) {
          message.success(r.data);
          this.getAppointmentByStatus();
          this.toggleEdit(v,false);
          let dataObj = inputValue;
          dataObj[`input_${v}`] = ``;
          this.setState({inputValue: dataObj})
        } else {
          message.error(`${r.msg} 错误码: ${r.status}`)
        }
      }).catch(()=>{
        message.error(`接口调取失败`)
      })
    } else {
      // 理论上说, 当对应的 inputValue 为空时, 无法点击进入该事件
      // 这里仅做保险, 进行预判报错
      message.error(`请输入团号`)
    }
  }
  // 改变团号输入框
  changeMassNo(n,e) {
    const { inputValue, } = this.state;
    let dataObj = {};
    for (let name in inputValue) {
      dataObj[name] = ``
    }
    dataObj[n] = e.target.value;
    this.setState({inputValue: dataObj})
  }
  // 换页
  changePage(pageNum,pageSize) {
    // console.log(pageNum,pageSize)
    this.getAppointmentByStatus(undefined,pageNum,pageSize);
    this.setState({pageNum:pageNum,pageSize:pageSize})
  }
  // 更改状态
  changeAppointmentStatus(v) {
    this.getAppointmentByStatus(v.target.value);
    this.setState({
      appointmentStatus: v.target.value
    })
  }
  // 发送申请
  submitAppointment() {
    const {selectedList, selectedIds,} = this.state;
    // console.log(selectedList, selectedIds);
    let dataList = [], idList = selectedIds;
    for (let v of selectedList) {
      dataList.push({
        passportName: v.passportName,
        mallName: v.mallName,
        airTicket: v.airTicket,
        passport: v.passport,
        passportNum: v.passportNum,
      })
    }
    if (selectedList.length > 0) {
      this.setState({isLoading: true});
      fetch(`${window.fandianUrl}/AppointmentMangement/sendAppointmentInselected`, {
        method: `POST`,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({appointmentList:dataList,appointmentIdList: idList}),
      }).then(r => r.json()).then(r => {
        // console.log(r)
        if (r.status === 10000) {
          message.success(`${r.data}`);
          this.getAppointmentByStatus();
          this.setState({
            isLoading: false,
            selectedList: [],
            selectedIds: [],
          })
        } else {
          message.error(`${r.msg} 错误码: ${r.status}`)
        }
      }).catch(()=>{
        message.error(`接口调取失败`)
      })
    } else {
      message.error(`至少选择一列`)
    }
  }

  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const {dataList, pageTotal, pageSize, pageNum, pageSizeOptions, appointmentStatus, previewVisible, previewImage, showEdit, selectedIds, isLoading, inputValue, selectedList, } = this.state;
    // 表单头
    const columnsNoMassNo = [
      {title: '姓名', dataIndex: 'passportName', key: 'passportName', width: 120},
      {title: '护照号码', dataIndex: 'passportNum', key: 'passportNum', width: 140},
      {title: '护照首页照片', dataIndex: 'passport', key: 'passport', width: 120,
        render: (text, record) => (
          <Button type="default"
                  onClick={this.openPreview.bind(this,record.passport)}
          >点击查看</Button>
        ),
      },
      {title: '返程机票', dataIndex: 'airTicket', key: 'airTicket', width: 120,
        render: (text, record) => (
          <Button type="default"
                  onClick={this.openPreview.bind(this,record.airTicket)}
          >点击查看</Button>
        ),
      },
      {title: '商场', dataIndex: 'mallName', key: 'mallName', width: 140},
      {title: '预约时间', dataIndex: 'createTime', key: 'createTime', width: 160,
        render: (text, record) => (
          <div>{!!record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
        )
      }
    ];
    const columns = [];
    for (let v of columnsNoMassNo) {
      columns.push(v)
    }
    columns.push(
      {title: '团号', dataIndex: 'massNo', key: 'massNo',
        render: (text, record, index) => (
          <div>
            {appointmentStatus === 1 &&
              (showEdit[`editRow_${index}`] ? <div className="editMassNo">
                <Input style={{width: 200}}
                       value={inputValue[`input_${index}`]}
                       onChange={this.changeMassNo.bind(this,`input_${index}`)}
                       className={`input_${index}`}
                       placeholder="请输入团号"
                       onBlur={this.loseBlur.bind(this,index,false)}
                />
                <Button type="primary"
                        style={{marginLeft: 10}}
                        onClick={this.submitMassNo.bind(this,index,record.id)}
                >保存</Button>
              </div>
              : <div className={`showMassNo editable-cell-value-wrap editRow_${index}`}
                     onClick={this.toggleEdit.bind(this,index,true)}
                >
                  编辑团号
                </div>)
            }
            {appointmentStatus === 2 &&
              <div className="showMassNo">
                {record.massNo}
              </div>
            }
          </div>
        )
      });
    return (
      <div className="appointmentTeamManage">
        {/*查询条件单选行*/}
        <RadioGroup defaultValue={0}
                    buttonStyle="solid"
                    className="radioBtn"
                    onChange={this.changeAppointmentStatus.bind(this)}
        >
          <RadioButton value={0}>待申请挂团</RadioButton>
          <RadioButton value={1}>待反馈团号</RadioButton>
          <RadioButton value={2}>已反馈团号</RadioButton>
        </RadioGroup>

        {/*按钮行*/}
        <div className="btnLine">
          {appointmentStatus === 0 &&
          <Button type="primary"
                  onClick={this.submitAppointment.bind(this)}
                  loading={isLoading}
                  disabled={selectedList.length === 0}
          >发送所选申请</Button>}
        </div>

        {/*这里给出表单和分页最大宽度, 防止 table 过宽*/}
        <div className="main"
             style={{maxWidth: 1200}}
        >
          {/*表单主体*/}
          <Table className="tableList"
                 dataSource={dataList}
                 columns={(appointmentStatus === 0 ? columnsNoMassNo : columns)}
                 pagination={false}
                 bordered
                 scroll={{ y: 600, x: 1100 }}
                 rowKey={(record, index) => `${record.id}`}
                 rowSelection={appointmentStatus === 0 ? {
                   selectedRowKeys: selectedIds,
                   // 选择框变化时触发
                   onChange: (selectedRowKeys, selectedRows) => {
                     this.setState({selectedList: selectedRows,selectedIds: selectedRowKeys});
                   },
                 } : null}
          />

          {/*分页*/}
          <Pagination className="tablePagination"
                      total={pageTotal}
                      pageSize={pageSize}
                      current={pageNum}
                      showTotal={(total, range) =>
                        `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`
                      }
                      style={{float:'right',marginRight:'20px',marginTop:'10px'}}
                      onChange={this.changePage.bind(this)}
                      showSizeChanger
                      pageSizeOptions={pageSizeOptions}
                      onShowSizeChange={this.changePage.bind(this)}
          />
        </div>

        {/*图片预览弹窗*/}
        <Modal visible={previewVisible}
               width={800}
               footer={null}
               onCancel={()=>{this.setState({previewVisible: false,previewImage: ``})}}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default appointmentTeamManage;