import React from 'react';
import { Radio, Table, Button, Modal, message, Pagination, } from 'antd';
import moment from 'moment';

import './index.less';

class appointmentTeamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 预约状态
      status: 0,
      // 预约状态
      appointmentStatus: 0,
      pageNum: 1,
      pageSize: 20,
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
    };
    window.appointmentTeamManage = this;
  }
  componentDidMount() {
    this.getAppointmentByStatus()
  }
  // 搜索预约信息
  getAppointmentByStatus(status = this.state.status,pageNum = this.state.pageNum, pageSize = this.state.pageSize) {
    fetch(`http://192.168.3.32:8000/AppointmentMangement/getAppointmentByStatus`,{
      method: `POST`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      // console.log(r)
      this.setState({
        dataList: r.data.list,
        pageSizeOptions: [`10`,`20`,`30`,(r.data.total > 40 ? r.data.total.toString() : `40`)],
      })
    })
  }
  // 打开图片弹窗
  openPreview(url) {
    this.setState({
      previewVisible: true,
      previewImage: url,
    })
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

  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const {dataList, pageTotal, pageSize, pageNum, pageSizeOptions, appointmentStatus, previewVisible, previewImage, } = this.state;
    // 表单头
    const columns = [
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
      },
      {title: '团号', dataIndex: 'massNo', key: 'massNo', width: 120},
      {title: '操作', dataIndex: '操作', key: '操作',
        // width: 100,
        // fixed: 'right',
        render: (text, record) => (
          <div>
            <Button type="primary"
                    style={{'margin':0}}
                    // onClick={this.toCE.bind(this,'edit',record.skuId)}
            >编辑</Button>
          </div>
        ),
      }
    ];
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
          {appointmentStatus === 0 && <Button type="primary"
          >发送所选申请</Button>}
        </div>

        {/*表单主体*/}
        <Table className="tableList"
               dataSource={dataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 600, x: 1200 }}
               rowKey={(record, index) => `id_${index}`}
               rowSelection={appointmentStatus === 0 ? {
                 // 选择框变化时触发
                 onChange: (selectedRowKeys, selectedRows) => {
                   this.setState({selectedList: selectedRows,selectedIds: selectedRowKeys});
                 },
               } : null}
        />

        {/*图片预览弹窗*/}
        <Modal visible={previewVisible}
               width={800}
               footer={null}
               onCancel={()=>{this.setState({previewVisible: false,previewImage: ``})}}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

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
    )
  }
}

export default appointmentTeamManage;