import React from 'react';
import { Radio, Table, Button, Modal, message, Pagination, Input, DatePicker, } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import './index.less';

class appointmentTeamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rejectVisible: false,//驳回modal
      rejectId: null,//驳回挂团信息id
      // 预约状态
      appointmentStatus: 0,
      pageNum: 1,
      pageSize: 100,
      pageTotal: 0,
      pageSizeOptions: [`50`,`100`,`200`,`300`],
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
      tableIsLoading: false,
    };
    // window.appointmentTeamManage = this;
  }
  componentDidMount() {
    this.getAppointmentByStatus()
  }
  // 搜索预约信息
  getAppointmentByStatus(status = this.state.appointmentStatus,pageNum = this.state.pageNum, pageSize = this.state.pageSize) {
    this.setState({tableIsLoading: true});
    if (status === 4) {
      fetch(`${window.fandianUrl}/AppointmentMangement/getMassNoByMallName`,{
        method: `POST`,
      }).then(r => r.json()).then(r => {
        if (!r.msg && !r.data) {
          message.error(`后端数据错误`)
        } else {
          if (r.status === 10000) {
            let dataObj = {};
            for (let n in r.data) dataObj[`input_${n}`] = r.data[n].massNo;
            this.setState({
              dataList: r.data,
              inputValue: dataObj,
            })
          } else {
            if (r.status) {
              message.error(`${r.msg} 错误码: ${r.status}`)
            } else {
              message.error(`后端数据错误`)
            }
          }
        }
        this.setState({tableIsLoading: false});
      }).catch(()=>{
        message.error(`前端接口调取出错`);
        this.setState({tableIsLoading: false});
      })
    } else {
      fetch(`${window.fandianUrl}/AppointmentMangement/getAppointmentByStatus`,{
        method: `POST`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`,
      }).then(r => r.json()).then(r => {
        if (!r.msg && !r.data) {
          message.error(`后端数据错误`)
        } else {
          if (r.status === 10000) {
            let dataObj = {};
            if (!!r.data.list) if (!!r.data.list[0].massNo) for (let n in r.data.list) dataObj[`input_${n}`] = r.data.list[n].massNo;
            this.setState({
              inputValue: dataObj,
              dataList: r.data.list,
              pageSizeOptions: [`50`,`100`,`200`, `${r.data.total > 300 ? r.data.total : 300}`],
              pageTotal: r.data.total,
              selectedList: [],
              selectedIds: [],
            })
          } else {
            if (r.status) {
              message.error(`${r.msg} 错误码: ${r.status}`)
            } else {
              message.error(`后端数据错误`)
            }
          }
        }
        this.setState({tableIsLoading: false});
      }).catch(()=>{
        message.error(`接口调取失败`);
        this.setState({tableIsLoading: false});
      });
    }
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
      let item = document.querySelector(`.input_${v}`);
      if (!!item) {
        // toggle 为双向绑定, 当关闭 input 时, 无需强制对焦
        item.focus();
      }
    })
  }
  // 失去焦点
  loseBlur(v,b) {
    const { inputValue, } = this.state;
    // 当输入框有值时, 默认无法直接在失去焦点时关闭输入框, 以防误操作
    // 阻止在失去焦点时, 强制刷新页面, 以防无法点击保存按钮
    // 这里逻辑无法将团号值置空
    if (!inputValue[`input_${v}`]) {
      this.toggleEdit(v,b);
    }
  }
  // 更改团号
  submitMassNo(i,v,momentDate,Date) {
    const { inputValue, appointmentStatus, } = this.state;
    if (!!inputValue[`input_${i}`]) {
      if (appointmentStatus === 4) {
        let dataObj = {mallName: v,};
        // 如果由日期选择插件调用, 则会带入Date参数, 以此为依据判断修改 massNo 还是 deadline
        if (!!Date) { dataObj.deadline = Date
        } else { dataObj.massNo = inputValue[`input_${i}`] }
        fetch(`${window.fandianUrl}/AppointmentMangement/editMassNoByMallName`, {
          method: `POST`,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataObj),
        }).then(r => r.json()).then(r => {
          // console.log(r);
          if (!r.msg && !r.data) {
            message.error(`后端数据错误`)
          } else {
            if (r.status === 10000) {
              message.success(r.data);
              this.getAppointmentByStatus();
              this.toggleEdit(i, false);
            } else {
              if (r.status) {
                message.error(`${r.msg} 错误码: ${r.status}`)
              } else {
                message.error(`后端数据错误`)
              }
            }
          }
        }).catch(()=>{
          message.error(`接口调取失败`)
        })
      } else {
        fetch(`${window.fandianUrl}/AppointmentMangement/editMassNoById`, {
          method: `POST`,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id:v,massNo:inputValue[`input_${i}`]}),
        }).then(r => r.json()).then(r => {
          if (!r.msg && !r.data) {
            message.error(`后端数据错误`)
          } else {
            if (r.status === 10000) {
              message.success(r.data);
              this.getAppointmentByStatus();
              this.toggleEdit(i, false);
            } else {
              if (r.status) {
                message.error(`${r.msg} 错误码: ${r.status}`)
              } else {
                message.error(`后端数据错误`)
              }
            }
          }
        }).catch(()=>{
          message.error(`接口调取失败`)
        })
      }
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
    this.setState({pageNum:pageNum,pageSize:pageSize},()=>{
      this.getAppointmentByStatus();
    })
  }
  // 更改状态
  changeAppointmentStatus(v) {
    this.setState({
      appointmentStatus: v.target.value,pageNum: 1,pageSize: 30
    },()=>{
      this.getAppointmentByStatus();
    })
  }
  //显示驳回modal
  rejectRegiment (id){
    this.setState({rejectVisible:true,rejectId:id});
  }
  sureReject (){
    this.apointmentToRejected(this.state.rejectId);
    this.setState({rejectVisible:false});
  }
  cancelReject (){
    this.setState({rejectVisible:false});
  }
  // 驳回用户的预约挂团数据
  apointmentToRejected(id) {
    fetch(`${window.fandianUrl}/AppointmentMangement/apointmentToRejected`, {
      method: `POST`,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    }).then(r => r.json()).then(r => {
      if (!r.msg && !r.data) {
        message.error(`后端数据错误`)
      } else {
        if (r.status === 10000) {
          message.success(`${r.msg}`);
          this.getAppointmentByStatus();
        } else {
          message.error(`${r.msg} 错误码: ${r.status}`)
        }
      }
    }).catch(()=>{
      message.error(`前端接口调取失败`)
    })
  }
  // 发送申请
  submitAppointment() {
    const {selectedList, selectedIds,} = this.state;
    let dataList = [], idList = selectedIds;
    for (let v of selectedList) {
      dataList.push({
        passportName: v.passportName,
        mallName: v.mallName,
        airTicket: v.airTicket,
        passport: v.passport,
        passportNum: v.passportNum,
        id: v.id,
      })
    }
    if (selectedList.length > 0) {
      this.setState({isLoading: true});
      let elt = document.getElementById('tableListForExport');
      let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
      XLSX.writeFile(wb, `预约挂团 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`);

      fetch(`${window.fandianUrl}/AppointmentMangement/sendAppointmentInselected`, {
        method: `POST`,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({appointmentList:dataList,appointmentIdList: idList}),
      }).then(r => r.json()).then(r => {
        // console.log(r)
        if (r.status === 10000) {
          message.success(`${r.data}`);
          this.getAppointmentByStatus();
          this.setState({isLoading: false})
        } else {
          if (r.status) {
            message.error(`${r.msg} 错误码: ${r.status}`)
          } else {
            message.error(`后端数据错误`)
          }
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
    const {dataList, pageTotal, pageSize, pageNum, pageSizeOptions, appointmentStatus, previewVisible, previewImage, showEdit, selectedIds, isLoading, inputValue, selectedList, tableIsLoading, } = this.state;
    // 表单头
    const columnsNoMassNo = [
      {title: '提交时间', dataIndex: 'createTime', key: 'createTime', width: 180,
        render: (text,record)=>(
          <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
      },

      {title: '姓名', dataIndex: 'passportName', key: 'passportName', width: 180},
      {title: '出生年月日', dataIndex: 'birthday', key: 'birthday', width: 200,},
      {title: '国籍', dataIndex: 'nationality', key: 'nationality', width: 100},
      {title: '护照号码', dataIndex: 'passportNum', key: 'passportNum', width: 140},
      {title: '性别', dataIndex: 'sex', key: 'sex', width: 100,
        render: (text, record) => (
          <p>
            {text==0 ? "男" :(text ==1 ? "女" : "")}
          {/*<Button type="default"*/}
                  {/*onClick={this.openPreview.bind(this,record.passport)}*/}
          {/*>点击查看</Button>*/}
          </p>
        ),
      },
      {title: '护照到期日', dataIndex: 'maturityDate', key: 'maturityDate', width: 240},
      {title: '入店日期', dataIndex: 'arrivalDate', key: 'arrivalDate', width: 240},
      {title: '出境日期', dataIndex: 'outboundDate', key: 'outboundDate', width: 240},
      {title: '出境时间', dataIndex: 'outboundDatetime', key: 'outboundDatetime', width: 180},
      {title: '航班号', dataIndex: 'flightNo', key: 'flightNo', width: 160,},
      {title: '机场', dataIndex: 'airportTerminal', key: 'airportTerminal', width: 160,},
      {title: '商场', dataIndex: 'mallName', key: 'mallName', width: 250},
    ];
    const columns = [];
    for (let v of columnsNoMassNo) {
      columns.push(v)
    }
    columns.push(
      {title: '团号', dataIndex: 'massNo', key: 'massNo',
        render: (text, record, index) => (
          <div>
            {showEdit[`editRow_${index}`] ? <div className="editMassNo">
                <Input style={{width: 160}}
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
                <Button type="danger"
                        style={{marginLeft: 10}}
                        onClick={this.toggleEdit.bind(this,index,false)}
                >取消</Button>
              </div>
              : <div className={`showMassNo editable-cell-value-wrap editRow_${index}`}
                     onClick={this.toggleEdit.bind(this,index,true)}
              >
                {record.massNo ? record.massNo : `编辑团号`}
              </div>}
          </div>
        )
      });
    const columnsMallMassNo = [
      {title: '商场', dataIndex: 'mallName', key: 'mallName', width: 140},
      {title: '团号', dataIndex: 'massNo', key: 'massNo',
        render: (text, record, index) => (
          <div>
            {showEdit[`editRow_${index}`] ? <div className="editMassNo">
                <Input style={{width: 160}}
                       value={inputValue[`input_${index}`]}
                       onChange={this.changeMassNo.bind(this,`input_${index}`)}
                       className={`input_${index}`}
                       placeholder="请输入团号"
                       onBlur={this.loseBlur.bind(this,index,false)}
                />
                <Button type="primary"
                        style={{marginLeft: 10}}
                        onClick={this.submitMassNo.bind(this,index,record.mallName)}
                >保存</Button>
                <Button type="danger"
                        style={{marginLeft: 10}}
                        onClick={this.toggleEdit.bind(this,index,false)}
                >取消</Button>
              </div>
              : <div className={`showMassNo editable-cell-value-wrap editRow_${index}`}
                     onClick={this.toggleEdit.bind(this,index,true)}
              >
                {record.massNo ? record.massNo : `编辑团号`}
              </div>}
          </div>
        )
      },
      {
        title: '失效时间', dataIndex: 'date', key: 'date', width: 160,
        render: (text, record, index) => (
          <div>
            <DatePicker style={{width: 130}}
                        dropdownClassName="datePickerPopup"
                        allowClear={false}
                        value={moment(record.deadline)}
                        onChange={this.submitMassNo.bind(this,index,record.mallName)}
            />
          </div>
        )
      }
    ];
    const columnsAdd = {
      title: '操作', dataIndex: 'operation', key: 'operation', width: 90,
      fixed: 'right',
      render: (text, record, index) => (
        <div>
          <Button type="danger"
                  onClick={this.rejectRegiment.bind(this,record.id)}
          >驳回</Button>
        </div>
      )
    };
    return (
      <div className="appointmentTeamManage">
        {/*查询条件单选行*/}
        <RadioGroup defaultValue={0}
                    buttonStyle="solid"
                    className="radioBtn"
                    value={appointmentStatus}
                    onChange={this.changeAppointmentStatus.bind(this)}
        >
          <RadioButton value={0}>申请挂团</RadioButton>
          <RadioButton value={1}>待反馈团号</RadioButton>
          <RadioButton value={2}>已反馈团号</RadioButton>
          <RadioButton value={3}>已驳回团号</RadioButton>
          <RadioButton value={4}>编辑商场团号</RadioButton>
        </RadioGroup>
        {/*驳回*/}
        <Modal
          title="是否驳回"
          visible={this.state.rejectVisible}
          onOk={this.sureReject.bind(this)}
          onCancel={this.cancelReject.bind(this)}
        >
          <p>该申请不符合标准</p>
        </Modal>
        {/*按钮行*/}
        <div className="btnLine">
          {appointmentStatus === 0 &&
          <Button type="primary"
                  onClick={this.submitAppointment.bind(this)}
                  loading={isLoading}
                  disabled={selectedList.length === 0}
          >导出挂团信息</Button>}
        </div>

        {/*这里给出表单和分页最大宽度, 防止 table 过宽*/}
        <div className="main"
             style={{maxWidth: (appointmentStatus === 4 ? 660
                 : (appointmentStatus === 1 ? 1350
                   : 1250))}}
        >
          {/*导出用表单*/}
          <Table className="tableListForExport"
                 id="tableListForExport"
                 dataSource={selectedList}
                 columns={columnsNoMassNo}
                 pagination={false}
                 style={{display: `none`}}
                 rowKey={(record, index) => `${index}`}
          />
          {/*表单主体*/}
          <Table className="tableList"
                 dataSource={dataList}
                 columns={(appointmentStatus === 0 ? columnsNoMassNo.concat(columnsAdd) :(appointmentStatus === 3 ?
                   columnsNoMassNo
                   : ( appointmentStatus === 4 ?
                     columnsMallMassNo
                     :  columns )))}
                 pagination={false}
                 loading={tableIsLoading}
                 bordered
                 scroll={{ y: 540, x: (appointmentStatus === 4 ? 560
                     : (appointmentStatus === 1 ? 1300
                       : 1150))}}
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
          {appointmentStatus === 4 || <Pagination className="tablePagination"
                      total={pageTotal}
                      pageSize={pageSize}
                      current={pageNum}
                      showTotal={(total, range) =>
                        `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`
                      }
                      style={{float:'right',marginRight:20,marginTop:10,paddingBottom:20}}
                      onChange={this.changePage.bind(this)}
                      showSizeChanger
                      pageSizeOptions={pageSizeOptions}
                      onShowSizeChange={this.changePage.bind(this)}
          />}
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