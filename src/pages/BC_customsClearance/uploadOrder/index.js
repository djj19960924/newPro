import React from 'react';
import { Table, Button, Pagination, message, Modal, } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';

import './index.less';

class BCUploadOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableDataList: [],
      pageTotal: 0,
      pageSize: 300,
      pageNum: 1,
      pageSizeOptions: ['50','100','200','300'],
      isTableLoading: false,
      fetchNum: 0,
      showModal: false,
    };
    window.BCUploadOrder = this;
  }

  componentDidMount() {
    this.queryParcelInfoToBc();
  }

  // 导出推单模板excel
  exportExcel () {
    const { tableDataList, } = this.state;
    let dataList = [];
    for (let v of tableDataList) {
      dataList.push({})
    }
    let elt = document.getElementById('tableList');
    let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
    XLSX.writeFile(wb, `BC推单表 ${moment(new Date()).format('YYYYMMDD-HHmmss')}.xlsx`);
    this.setParcelProductIsBC();
  }

  // 推单到BC,导出excel时将商品状态置为已推单
  setParcelProductIsBC() {
    fetch(`${window.fandianUrl}/bcManagement/queryParcelInfoToBc`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({

      }),
    }).then(r => r.json()).then(r => {
      if (!r.msg && !r.data) {
        message.error(`后端数据错误`)
      } else {
        if (r.status === 10000) {

        } else if (r.status < 10000) {
          message.warn(`${r.msg} 状态码:${r.status}`)
        } else if (r.status > 10000) {
          message.error(`${r.msg} 错误码:${r.status}`)
        }
      }
      this.setState({isTableLoading: false});
    }).catch(()=>{
      message.error(`前端错误: 请求发送失败`);
      this.setState({isTableLoading: false});
    })
  }

  // 获取需要导出到BC的推单商品信息
  queryParcelInfoToBc() {
    const { pageNum, pageSize, } = this.state;
    this.setState({isTableLoading: true});
    fetch(`${window.fandianUrl}/bcManagement/queryParcelInfoToBc`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        pageNum: pageNum,
        pageSize: pageSize,
      }),
    }).then(r => r.json()).then(r => {
      if (!r.msg && !r.data) {
        message.error(`后端数据错误`)
      } else {
        if (r.status === 10000) {
          // console.log(r);
          this.setState({tableDataList: r.data.list,pageNum:r.data.pageNum,pageTotal:r.data.total,pageSize:r.data.pageSize,pageSizeOptions: ['50','100','200',`${r.data.total > 300 ? r.data.total : 300}`]});
        } else if (r.status < 10000) {
          message.warn(`${r.msg} 状态码:${r.status}`)
        } else if (r.status > 10000) {
          message.error(`${r.msg} 错误码:${r.status}`)
        }
      }
      this.setState({isTableLoading: false});
    }).catch(()=>{
      message.error(`前端错误: 请求发送失败`);
      this.setState({isTableLoading: false});
    })
  }

  // 改变页码
  changePage(pageNum,pageSize) {
    console.log(pageNum,pageSize);
  }

  render() {
    const columns = [
      // 商品名称	数量	成本价	库存地	商品规格	品牌	净重	毛重	原产国
      {title: '提单号', dataIndex: '提单号', key: '提单号', width: 140},
      {title: '客户内部单号', dataIndex: 'parcelNo', key: 'parcelNo', width: 140},
      {title: '圆通快递单号', dataIndex: 'mailNo', key: 'mailNo', width: 140},
      {title: '身份证号码', dataIndex: 'receiveCard', key: 'receiveCard', width: 140},
      {title: '收件人', dataIndex: 'recipientsName', key: 'recipientsName', width: 140},
      {title: '收件电话', dataIndex: 'recipientsPhone', key: 'recipientsPhone', width: 140},
      {title: '省份', dataIndex: 'recipientsProvince', key: 'recipientsProvince', width: 140},
      {title: '城市', dataIndex: 'recipientsCity', key: 'recipientsCity', width: 140},
      {title: '县区', dataIndex: 'recipientsDistrict', key: 'recipientsDistrict', width: 140},
      {title: '收件地址', dataIndex: 'recipientsAddress', key: 'recipientsAddress', width: 140},
      {title: '下单时间', dataIndex: 'createTime', key: 'createTime', width: 140,
        render: (text, record) => (
              <div>{moment(record.createTime).format(`YYYY/MM/DD`)}</div>
            ),
      },
      {title: '商品货号', dataIndex: 'productCode', key: 'productCode', width: 140},
      {title: '商品名称', dataIndex: 'productName', key: 'productName', width: 140},
      {title: '数量', dataIndex: 'productNum', key: 'productNum', width: 140},
      {title: '成本价', dataIndex: 'costPrice', key: 'costPrice', width: 140},
      {title: '库存地', dataIndex: 'purchaseArea', key: 'purchaseArea', width: 140},
      {title: '商品规格', dataIndex: 'specificationType', key: 'specificationType', width: 140},
      {title: '品牌', dataIndex: 'brand', key: 'brand', width: 140},
      {title: '净重', dataIndex: 'netWeight', key: 'netWeight', width: 140},
      {title: '毛重', dataIndex: 'grossWeight', key: 'grossWeight', width: 140},
      {title: '原产国', dataIndex: 'purchaseArea', key: 'purchaseArea2', width: 140},
    ];
    const { tableDataList, pageTotal, pageSize, pageNum, pageSizeOptions, isTableLoading, } = this.state;
    return (
      <div className="BCUploadOrder">
        <div className="btnLine">
          <Button type="primary"
                  onClick={this.exportExcel.bind(this)}
          >导出当前表格数据</Button>
        </div>
        <div className="TableMain">
          {/*表单主体*/}
          <Table className="tableList"
                 id="tableList"
                 dataSource={tableDataList}
                 columns={columns}
                 pagination={false}
                 loading={isTableLoading}
                 bordered
                 // rowSelection={{
                 //   selectedRowKeys: selectedIds,
                 //   // 选择框变化时触发
                 //   onChange: (selectedRowKeys, selectedRows) => {
                 //     this.setState({selectedList: selectedRows,selectedIds: selectedRowKeys});
                 //     // console.log(selectedRowKeys, selectedRows)
                 //   },
                 // }}
                 scroll={{ y: 500, x: 800 }}
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
          style={{float:'right',marginRight:20,marginTop:10,marginBottom: 20}}
          onChange={this.changePage.bind(this)}
          showSizeChanger
          pageSizeOptions={pageSizeOptions}
          onShowSizeChange={this.changePage.bind(this)}
          />
        </div>
      </div>
    )
  }

}

export default BCUploadOrder;