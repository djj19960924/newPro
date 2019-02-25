import React from 'react';
import { Radio, Table, Pagination, message, Modal, Button, DatePicker , } from 'antd';
import moment from 'moment';

import './index.less';

class airportTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoType: 0,
      pageTotal: 0,
      pageSize: 30,
      pageSizeOptions: ['30','50','80','100'],
      pageNum: 1,
      tableDataList: [],
      previewVisible: false,
      previewImage: ``,
      tableIsLoading: false,
      startTime: moment(new Date()),
      endTime: null,
    };
    window.airportTransfer = this;
  }

  componentDidMount() {
    // 组件加载成功时
    this.getAirportInfo();
  }

  // 获取接送机用户信息
  // infoType: 0 - 送机, 1 - 接机
  getAirportInfo(infoType = this.state.infoType, pageNum=this.state.pageNum, pageSize=this.state.pageSize) {
    this.setState({tableIsLoading: {spinning:true,tip:`正在加载中...`}});
    fetch(`${window.apiUrl}/airportManagement/${infoType === 0 ? `getAirportDropInfo` : `getAirportPickInfo`}`,{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`pageNum=${pageNum}&pageSize=${pageSize}`
    }).then(r => r.json()).then(r => {
      if (r.status) {
        if (r.status === 10000) {
          this.setState({
            tableIsLoading: false,
            tableDataList: r.data.list,
            pageTotal: r.data.total,
            pageSizeOptions: ['30','50','80',`${r.data.total > 100 ? r.data.total : 100}`],
          })
        } else { message.error(`${r.msg}, 错误码:${r.status}`); this.resetTableDataList(); }
      } else { message.error(`后端数据错误`); this.resetTableDataList(); }
    }).catch(r => { message.error(`前端接口调用错误: 获取送机用户信息接口调取失败`); this.resetTableDataList(); })
  }

  // 复位数据
  resetTableDataList() {
    this.setState({
      tableIsLoading: false,
      tableDataList: [],
      pageTotal: 0,
      pageSizeOptions: ['30','50','80',`100`],
      pageNum: 1,
      pageSize: 30,
    })
  }

  // 翻页事件
  changePage(pageNum,pageSize) {
    this.setState({pageNum:pageNum,pageSize:pageSize});
    this.getAirportInfo(undefined,pageNum,pageSize)
  }

  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const { pageTotal, pageSize, pageNum, tableDataList, infoType, previewVisible, previewImage, pageSizeOptions, tableIsLoading, startTime, endTime, } = this.state;
    const columns = [
      {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 140,
        render: (text, record) => (
          <div>{moment(record.createTime).format('YYYY-MM-DD hh:mm:ss')}</div>
        )
      },
      {title: '送机时间', dataIndex: `${infoType === 0 ? `takeoffTime` : `arrivalTime`}`, key: `${infoType === 0 ? `takeoffTime` : `arrivalTime`}`, width: 140},
      {title: '机票照片', dataIndex: `${infoType === 0 ? `airportDropoffUrl` : `airportPickupUrl`}`, key: `${infoType === 0 ? `airportDropoffUrl` : `airportPickupUrl`}`, width: 160,
        render: (text, record) => (
          <Button type="default"
                  onClick={() => {this.setState({ previewVisible: true,
                    previewImage: (infoType === 0 ? record[`airportDropoffUrl`] : record[`airportPickupUrl`]) })}}
          >点击查看</Button>
        ),},
      {title: '行李件数', dataIndex: 'bagNum', key: 'bagNum', width: 90},
      {title: '微信号', dataIndex: 'wechatNum', key: 'wechatNum', width: 140},
    ];
    const columnsBottom = [
      {title: '用车人数', dataIndex: 'carMember', key: 'carMember', width: 90},
      {title: '用车类型', dataIndex: 'carChoice', key: 'carChoice', width: 140,
        render: (text, record) => (
          <div>{record.carChoice === 0 ? `拼车` : `专车(包车)`}</div>
        ),
      },
      // {title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 140}
    ];
    const dropColumns = columns.concat([
      {title: '所在地址', dataIndex: 'location', key: 'location', width: 140},
    ]).concat(columnsBottom);
    const pickColumns = columns.concat([
      {title: '所在地址1', dataIndex: 'location1', key: 'location1', width: 140},
      {title: '所在地址2', dataIndex: 'location2', key: 'location2', width: 140},
      {title: '所在地址3', dataIndex: 'location3', key: 'location3', width: 140},
    ]).concat(columnsBottom);
    return (
      <div className="airportTransfer">
        <RadioGroup buttonStyle="solid"
                    className="radioBtn"
                    value={infoType}
                    onChange={(e)=> { this.setState({infoType: e.target.value}); this.getAirportInfo(e.target.value) }}
        >
          <RadioButton value={0}>接机用户信息</RadioButton>
          <RadioButton value={1}>送机用户信息</RadioButton>
        </RadioGroup>
        <div className="datePickerLine">
          <span>起始时间: </span>
          <DatePicker value={startTime}
                      onChange={(date, dateString) => this.setState({startTime: date})}
          />
          <span style={{marginLeft: 10}}>结束时间: </span>
          <DatePicker value={endTime}
                      onChange={(date, dateString) => this.setState({endTime: date})}
          />
          <Button type="primary"
                  style={{marginLeft: 10}}
                  onClick={this.getAirportInfo.bind(this,infoType,undefined,undefined)}
          >查询</Button>
        </div>
        <div style={{maxWidth: 1250}}>
          <Table className="tableList"
                 dataSource={tableDataList}
                 columns={infoType === 0 ? dropColumns : pickColumns }
                 pagination={false}
                 bordered
                 scroll={{ x:1200, y: 500 }}
                 rowKey={(record, index) => `id_${index}`}
                 loading={tableIsLoading}
          />
          <Pagination className="tablePagination"
                      total={pageTotal}
                      pageSize={pageSize}
                      current={pageNum}
                      showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
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

export default airportTransfer;