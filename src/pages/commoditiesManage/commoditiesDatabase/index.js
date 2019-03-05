import React from 'react';
import {Radio, Table, Pagination, Button, Input, message, Modal, Icon, } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import PageLoading from '@components/pageLoading/';

import './index.less';

class commoditiesDataBase extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      importModalVisible: false,
      excelDataListOrigin: [],
      excelDataList: [],
      errorList: [],
      // 自增用序列号
      Num: 0,
      failList: [],
      failListNum: [],
      successList: [],
      // 表单数据
      dataList: [],
      // 搜索字段
      searchValue: '',
      // 搜索备案类型
      record: 0,
      pageNum: 1,
      pageSize: 100,
      pageTotal: 0,
      // 每页显示数据条数选择框
      pageSizeOptions: [`50`,`100`,`200`,`300`],
      loadingTxt: ``,
      tableIsLoading: false,
      isSubmit: false,
    };
    window.commoditiesDataBase = this;
    // window.moment = moment;
  }
  // 这里需要在组件即将加载时优先生成input
  componentWillMount() {
    // 创建导入用input
    let input = document.createElement(`input`);
    input.type = `file`;
    input.className = "inputImport";
    input.onchange = this.showModal.bind(this);
    this.setState({input: input});
  }
  // 默认读取表格
  componentDidMount() {
    // 默认载入表格数据
    const record = window.getQueryString('record');
    this.setState({tableIsLoading:true,record: record && record !== 'null' ? parseInt(record) : 0},() => {
      this.getSku();
    });
  }
  // 打开弹窗
  showModal(e) {
    const { input } = this.state;
    let item = e.target.files[0];
    // 格式校验
    if (item.type === `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
      || item.type === `application/vnd.ms-excel`) {
      let reader = new FileReader();
      // 定义reader的加载方法, 于加载完成后触发
      reader.onload = (e) => {
        let data = e.target.result,wb;
        wb = XLSX.read(data, {
          type: 'binary'
        });
        // 这里对list进行复制, 并且于此改写形式
        let excelDataListOrigin = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]),excelDataList = [],errorList = [];
        for (let i in excelDataListOrigin) {
          // i + 2 = 表单内行数号
          let code = excelDataListOrigin[i].商品货号, price = excelDataListOrigin[i].成本价;
          if (!code || !price) {
            errorList.push({
              Num: parseInt(i),
              errValue: `${!code ? `商品货号 ` : ``}${!price ? `成本价` : ``}`,
            })
          } else {
            excelDataList.push({
              skuCode: code,
              recordPrice: price,
              Num: parseInt(i),
            });
          }
        }
        // console.log(`这里显示表单内源数据: `);
        // console.log(excelDataListOrigin);
        // console.log(`这里显示处理后数据: `);
        // console.log(excelDataList);
        this.setState({
          importModalVisible: true,
          excelDataListOrigin: excelDataListOrigin,
          excelDataList: excelDataList,
          errorList: errorList,
        })
      };
      // 执行reader进行加载
      reader.readAsBinaryString(e.target.files[0]);
    } else {
      message.warn(`所选文件格式不正确`);
      this.setState({importModalVisible: false},() => { input.value = null; })
    }
  }
  // 寻找 input 进行点击
  clickIT() {
    const { input, } = this.state;
    input.click();
  }
  // 获取表单列表
  getSku(searchValue = this.state.searchValue,
         record = this.state.record,
         pageNum = this.state.pageNum,
         pageSize = this.state.pageSize) {
    fetch(`${window.fandianUrl}/sku/getSku`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`choice=${record}&name=${searchValue}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      if (r.status) {
        if (r.status === 10000) {
          this.setState({
            dataList: r.data.list,
            pageNum: r.data.pageNum,
            pageSize: r.data.pageSize,
            pageTotal: r.data.total,
            pageSizeOptions: [`50`,`100`,`200`,`${r.data.total > 300 ? r.data.total : 300}`]
          })
        } else if (r.status === 10001) {
          message.warn(`${r.msg}`);
          this.setState({dataList: []})
        } else {
          message.error(`${r.msg} 状态码:${r.status}`);
          this.setState({dataList: []})
        }
      } else {
        message.error(`后端数据错误`)
      }
      this.setState({tableIsLoading:false});
    }).catch(() => {
      this.setState({tableIsLoading:false});
      message.error(`商品列表接口调取失败`)
    });
  }
  // 导出excel
  exportExcel () {
    const { record, dataList, } = this.state;
    var elt = document.getElementById('tableList');
    var wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
    XLSX.writeFile(wb, (record === 3 ? `商品资料库备案表.xlsx` : `商品资料库.xlsx`));
    // 导出的同时调取接口,将相应的商品状态改为备案中
    let dataArray = [];
    for (let i of dataList) {
      dataArray.push(i.skuCode)
    }
    fetch(`${window.fandianUrl}/sku/updateProductRecordState`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dataArray),
    }).then(r => r.json()).then(r => {
      if (r.status) {
        if (r.status === 10000) {
          message.success(`${r.msg}`)
        } else {
          message.error(`${r.msg}, 错误码:${r.status}`)
        }
      } else {
        message.error(`后端数据错误`)
      }
    }).catch(()=>{
      message.error(`前端错误: 将未备案数据改为已备案状态接口调取失败`)
    })
  }
  // 判断行邮方式
  postWay(q) {
    let way;
    switch (q) {
      case 0: way = '无'; break;
      case 1: way = 'ETK'; break;
      case 2: way = 'BC'; break;
      default : way = '数据错误'
    }
    return way;
  }
  // 更改是否已备案条件触发
  changeRecord(e) {
    // 参数项设为 undefined 时, 将使用函数自带默认参数
    this.setState({tableIsLoading:true});
    this.getSku(undefined, e.target.value, 1, 100);
    this.setState({
      record: e.target.value,
      pageNum: 1,
      pageSize: 100,
    })
  }
  // 调取根据skuId修改备案价以及备案状态接口
  updateSkuByUploadExcel() {
    const { Num, excelDataList, successList, failList, failListNum, } = this.state;
    if (Num < excelDataList.length) {
      this.setState({isSubmit: true});
      fetch(`${window.fandianUrl}/sku/updateSkuByUploadExcel`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          skuCode: excelDataList[Num].skuCode,
          recordPrice: excelDataList[Num].recordPrice,
          isRecord: 1,
        }),
      }).then(r => r.json()).then(r => {
        if (r.status) {
          if (r.status === 10000) {
            successList.push(excelDataList[Num]);
            // 后端处理数据成功
            this.setState({Num: (Num + 1), successList: successList,}, () => {
              this.updateSkuByUploadExcel();
            })
          } else {
            // 后端处理数据失败
            message.error(`${r.msg}, 错误码: ${r.status}`);
            let dataObj = Object.assign({},excelDataList[Num]);
            dataObj.msg = r.msg;
            dataObj.status = r.status;
            failList.push(dataObj);
            failListNum.push(dataObj.Num + 2);
            this.setState({Num: (Num + 1), failList: failList, failListNum: failListNum,}, () => {
              this.updateSkuByUploadExcel();
            })
          }
        } else {
          message.error(`后端数据类型错误`)
        }
      }).catch(() => {
        message.error(`更改备案价接口调取失败`)
      })
    } else {
      message.success(`导入结束, 如需继续, 请重新选择excel文件`);
      this.setState({tableIsLoading:true,isSubmit: false},()=>{
        this.getSku();
      });
    }
  }
  // 更改当前页或每页显示条数
  changePage(n,s) {
    this.setState({
      pageNum: n,
      pageSize: s,
      tableIsLoading:true
    },()=>{
      this.getSku(undefined,undefined)
    });

  }
  // 跳转至编辑界面
  toCE(type,skuId) {
    const { record, } = this.state;
    // 使用query传值
    // 在这里清空本地相关数据, 使得编辑和新增功能不受干扰
    localStorage.removeItem('imgList');
    localStorage.removeItem('newImgList');
    this.props.history.push(`/commodities-manage/commodities-database/create-and-edit?type=${type}&skuId=${skuId}&record=${record}`);
  }
  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const { dataList, searchValue, pageNum, pageSize, pageTotal, pageSizeOptions, record, loadingTxt, importModalVisible, input, errorList, isSubmit, failList, failListNum, excelDataList, successList, tableIsLoading, } = this.state;
    const Search = Input.Search;
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
      {title: '备案价(¥)', dataIndex: 'recordPrice', key: 'recordPrice', width: 120,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.recordPrice ? record.recordPrice : '无'}</div>
        ),
      },
      {title: '税率', dataIndex: 'taxRate', key: 'taxRate', width: 80,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.taxRate ? `${record.taxRate}%` : '无'}</div>
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
    const columnsForExport = [
      // 非必填字段于表中隐藏, 不对应实际dataIndex, 只填写必须部分
      // {title: `商家编码`, dataIndex: `商家编码`, key: `商家编码`, width: 80},
      // 商家编码暂存skuId
      {title: `商家编码`, dataIndex: `商家编码`, key: `商家编码`, width: 80},
      {title: `商品名称`, dataIndex: `name`, key: `name`, width: 80},
      // 即备案价, 返回以后用于导入, 覆盖原有备案价
      {title: `成本价`, dataIndex: `recordPrice`, key: `recordPrice`, width: 80},
      {title: `服务费`, dataIndex: `服务费`, key: `服务费`, width: 50},
      {title: `税率`, dataIndex: `税率`, key: `税率`, width: 80},
      {title: `库存地`, dataIndex: `库存地`, key: `库存地`, width: 50},
      {title: `商品货号`, dataIndex: `skuCode`, key: `skuCode`, width: 50},
      {title: `HS编码`, dataIndex: `HS编码`, key: `HS编码`, width: 50},
      {title: `计量单位`, dataIndex: `计量单位`, key: `计量单位`, width: 80},
      {title: `法定单位`, dataIndex: `法定单位`, key: `法定单位`, width: 50},
      {title: `第二单位`, dataIndex: `第二单位`, key: `第二单位`, width: 50},
      {title: `商品规格`, dataIndex: `specificationType`, key: `specificationType`, width: 80},
      {title: `品牌`, dataIndex: `brand`, key: `brand`, width: 80},
      {title: `行邮税号`, dataIndex: `行邮税号`, key: `行邮税号`, width: 80},
      {title: `行邮税名称`, dataIndex: `行邮税名称`, key: `行邮税名称`, width: 80},
      {title: `净重`, dataIndex: `netWeight`, key: `netWeight`, width: 80},
      {title: `毛重`, dataIndex: `grossWeight`, key: `grossWeight`, width: 80},
      {title: `原产国`, dataIndex: `原产国`, key: `原产国`, width: 80},
      {title: `生产厂家`, dataIndex: `brand`, key: `brandOrigin`, width: 80},
      {title: `商检备案号`, dataIndex: `商检备案号`, key: `商检备案号`, width: 50},
      {title: `这行不能修改任何名称`, dataIndex: `这行不能修改任何名称`, key: `这行不能修改任何名称`},
      // 暂不显示skuId
      // {title: `这一列请勿修改任何数据`, dataIndex: `skuId`, key: `skuId`, width: 80},
    ];
    return (
      <div className="dataBase">
        {/*加载*/}
        {loadingTxt && <PageLoading loadingTxt={loadingTxt}/>}

        {/*导入弹窗*/}
        <Modal title="导入"
               className="importModal"
               visible={importModalVisible}
               confirmLoading={!!isSubmit}
               onOk={this.updateSkuByUploadExcel.bind(this)}
               onCancel={
                 () => { isSubmit ?
                   message.warn(`文件导入中,请勿关闭`)
                   : this.setState({
                     // 复位数据
                     importModalVisible: false,
                     excelDataListOrigin: [],
                     excelDataList: [],
                     errorList: [],
                     Num: 0,
                     failList: [],
                     failListNum: [],
                     successList: [],
                   },() => { input.value = null; })
                 }
               }
        >
          <p>所选文件名: {!!input.value ? input.files[0].name : null}</p>
          {isSubmit ? <p><Icon type="loading" /> <span style={{color:`red`}}>正在上传数据中... 请勿关闭页面!!!</span></p> : null}
          <p>{`当前上传条数 ${successList.length}/${excelDataList.length}, 成功${successList.length}条, 失败${failList.length}条`}</p>
          <p style={{color: `red`}}>请注意备份本页报错数据, 并根据报错提示检查备案表内数据</p>
          <div className="failList">
            <p>{`excel表内出错数据行数: ${failListNum}`}</p>
            {failList.map((item,i) => (
              <p key={i}>{`excel表内出错数据行数: ${item.Num+2}, 出错原因: ${item.msg}, 错误码: ${item.status}`}</p>
            ))}
          </div>
          {errorList.length > 0 ? <p>当前excel表格存在数据漏填, 如继续导入, 以下行数数据则不会进行处理</p> : ``}
          <div className="errorList">
            {errorList.map((item,i) => (
              <p key={i}>{`excel表内出错数据行数: ${item.Num+2}, 出错数据值: ${item.errValue}`}</p>
            ))}
          </div>
        </Modal>

        {/*查询条件单选行*/}
        <RadioGroup value={record}
                    buttonStyle="solid"
                    className="radioBtn"
                    onChange={this.changeRecord.bind(this)}
        >
          <RadioButton value={0}>全部</RadioButton>
          <RadioButton value={1}>已备案</RadioButton>
          <RadioButton value={2}>待导出备案(未备案)</RadioButton>
          <RadioButton value={3}>备案中</RadioButton>
          <RadioButton value={4}>作废</RadioButton>
        </RadioGroup>

        {/*新增按钮 excel导出 搜索框*/}
        <div className="searchLine">
          <Button type="primary"
                  className="createNew"
                  onClick={this.toCE.bind(this,'create',null)}
          >新增商品</Button>
          {record === 2 && <Button type="primary"
                  className="exportExcelBtn"
                  onClick={this.exportExcel.bind(this)}
          >excel导出</Button>}
          {(record === 3 && (window.isLocalTest || window.isServerTest)) &&
          <Button type="primary"
                  onClick={this.clickIT.bind(this)}
                  className="importExcelBtn"
          >excel导入更新备案价</Button>}
          <Search className="searchInput"
                  placeholder="请输入关键字进行搜索"
                  value={searchValue}
                  // 根据条件搜索
                  onSearch={(e) => this.getSku(e)}
                  // 保存搜索框值
                  onChange={(e) => this.setState({searchValue: e.target.value})}
          />
        </div>

        {/*表单主体*/}
        <Table className="tableList"
               // id="tableList"
               ref={'commoditiesTable'}
               dataSource={dataList}
               // columns={record === 2 ? columnsForExport : columns}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 500, x: 1300 }}
               rowKey={(record, index) => `id_${index}`}
               loading={tableIsLoading}
        />

        {/*导出用表单*/}
        {record === 2 && <Table className="tableListForExport"
               id="tableList"
               columns={columnsForExport}
               dataSource={dataList}
               pagination={false}
               style={{display:'none'}}
               rowKey={(record, index) => `id_${index}`}
        />}

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

export default commoditiesDataBase;