import React from 'react';
import { Radio, Table, Button, Modal, message, Pagination, } from 'antd';
import moment from 'moment';

import './index.less'

class appointmentTeamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 预约状态
      appointmentStatus: 0,
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0,
      pageSizeOptions: [`10`,`20`,`30`,`40`],
    };
  }
  componentDidMount(pageNum = this.state.pageNum, pageSize = this.state.pageSize) {
    let status = 0;
    fetch(`http://192.168.3.32:8000/AppointmentMangement/getAppointmentByStatus`,{
      method: `POST`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      console.log(r)
    })
  }
  // 换页
  changePage(pageNum,pageSize) {
    console.log(pageNum,pageSize)
  }
  // 更改状态
  changeAppointmentStatus(v) {
    this.setState({
      appointmentStatus: v
    })
  }

  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const {dataList, pageTotal, pageSize, pageNum, pageSizeOptions,} = this.state;
    // 表单头
    const columns = [
      {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160,
        render: (text, record) => (
          <div>{!!record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        )
      },
      {title: '商品名称', dataIndex: 'name', key: 'name', width: 160},
      {title: '毛重(kg)', dataIndex: 'grossWeight', key: 'grossWeight', width: 80},
      {title: '采购价', dataIndex: 'costPrice', key: 'costPrice', width: 120},
      {title: '商品品牌', dataIndex: 'brand', key: 'brand', width: 140},
      {title: '商品品类', dataIndex: 'category', key: 'category', width: 140},
      {title: '行邮方式', dataIndex: 'sugPostway', key: 'sugPostway', width: 100,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{this.postWay(record.sugPostway)}</div>
        ),
      },
      {title: '数量', dataIndex: 'stock', key: 'stock', width: 80},
      {title: 'etk备案价(¥)', dataIndex: 'recordPrice', key: 'recordPrice', width: 120,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.recordPrice ? record.recordPrice : '无'}</div>
        ),
      },
      {title: '税率', dataIndex: 'taxRate', key: 'taxRate', width: 80,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.taxRate ? record.taxRate : '无'}</div>
        ),
      },
      {title: '操作', dataIndex: '操作', key: '操作',
        // width: 100,
        // fixed: 'right',
        render: (text, record) => (
          <div>
            <Button type="primary"
                    style={{'margin':0}}
                    onClick={this.toCE.bind(this,'edit',record.skuId)}
            >编辑</Button>
          </div>
        ),
      }
    ];
    return (
      <div className="appointmentStatus">
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
        {/*表单主体*/}
        <Table className="tableList"
               id="tableList"
               ref={'commoditiesTable'}
               dataSource={dataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 600, x: 1300 }}
               rowKey={(record, index) => `id_${index}`}
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
    )
  }
}

export default appointmentTeamManage;