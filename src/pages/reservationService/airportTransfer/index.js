import React from 'react';
import {Button, DatePicker, message, Modal, Pagination, Radio, Table,} from 'antd';
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
    // window.airportTransfer = this;
    // window.moment = moment;
  }

  componentDidMount() {
    // 组件加载成功时
    this.getAirportInfo();
  }

  // 获取接送机用户信息
  // infoType: 0 - 送机, 1 - 接机
  getAirportInfo(infoType = this.state.infoType, pageNum=this.state.pageNum, pageSize=this.state.pageSize,) {
    const { startTime, endTime, } = this.state;
    this.setState({tableIsLoading: {spinning:true,tip:`正在加载中...`}});
    fetch(`${window.fandianUrl}/airportManagement/${infoType === 0 ? `getAirportDropInfo` : `getAirportPickInfo`}`,{
      method:"POST",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({
        pageNum: pageNum,
        pageSize: pageSize,
        startTime: startTime ? `${moment(startTime).format('YYYY-MM-DD')} 00:00:00` : null,
        endTime: endTime ? `${moment(endTime).format('YYYY-MM-DD')} 23:59:59` : null,
      }),
    }).then(r => r.json()).then(r => {
      // 这里成功调取后端服务器
      if (r.status) {
        // 后端成功处理请求
        if (r.status === 10000) {
          // 请求结果状态码为10000(成功)
          if (r.msg) {
            // 成功获取数据, 但结果为空
            message.warn(`${r.msg}`);
            this.resetTableDataList();
          } else {
            // 成功获取数据, 处理表单
            this.setState({
              tableIsLoading: false,
              tableDataList: r.data.list,
              pageTotal: r.data.total,
              pageSizeOptions: ['30','50','80',`${r.data.total > 100 ? r.data.total : 100}`],
            })
          }
        } else {
          // 请求结果状态码不为10000, 进行报错提示
          message.error(`${r.msg}, 错误码:${r.status}`); this.resetTableDataList();
        }
      } else {
        // 后端处理请求失败, 返回结果有误
        message.error(`后端数据错误`); this.resetTableDataList();
      }
    }).catch(() => {
      // 前端未能成功调取后端数据, 或处理接收数据方法出错, 需检查前端部分代码执行
      message.error(`前端接口调用错误: 获取用户信息接口调取失败`); this.resetTableDataList();
    })
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

  // 起始时间校验
  disabledStartTime(current) {
    const { endTime, } = this.state;
    // 这里表示, 如果该时间点晚于(大于)某一时间点, 则不可选
    // 校验的current为选择框内所有日期值, 做穷举判断
    return current > moment(endTime)
  }
  // 结束时间校验
  disabledEndTime(current) {
    const { startTime, } = this.state;
    // 该时间点早于(小于)某一时间点
    return current < moment(startTime)
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
          <div>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
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
          <RadioButton value={0}>送机用户信息</RadioButton>
          <RadioButton value={1}>接机用户信息</RadioButton>
        </RadioGroup>
        <div className="datePickerLine">
          <span>开始时间: </span>
          <DatePicker value={startTime}
                      onChange={(date, dateString) => this.setState({startTime: date})}
                      disabledDate={this.disabledStartTime.bind(this)}
          />
          <span style={{marginLeft: 10}}>结束时间: </span>
          <DatePicker value={endTime}
                      onChange={(date, dateString) => this.setState({endTime: date})}
                      disabledDate={this.disabledEndTime.bind(this)}
          />
          <Button type="primary"
                  style={{marginLeft: 10}}
                  onClick={this.getAirportInfo.bind(this,infoType,undefined,undefined)}
          >查询</Button>
        </div>
        <div style={{maxWidth: 1320}}>
          <Table className="tableList"
                 dataSource={tableDataList}
                 columns={infoType === 0 ? dropColumns : pickColumns }
                 pagination={false}
                 bordered
                 scroll={{ x:1300, y: 500 }}
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