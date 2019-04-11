import React from 'react';
import {Radio, Table, Pagination, Button, Input, message, Modal, Icon,} from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import PageLoading from '@components/pageLoading/';
import Country from "@js/countryForCD";
import JsZip from 'jszip';
import './index.less';

let zip = new JsZip();//*****创建实例，zip是对象实例

let image = new Image();
// image.setAttribute("crossOrigin",'Anonymous')
image.crossOrigin = "*";  // 支持跨域图片
class commoditiesDataBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count:0,//当前下载图片的数目
      skuCodeList: [],//保存当前页的商品码
      picList:[],//下载图片的数据
      dowmloadFailPic:[],//图片下载失败
      downloadVisible:false,//下载图片弹窗
      input: null,
      importModalVisible: false,
      exportModalVisible: false,
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
      pageSizeOptions: [`50`, `100`, `200`, `300`],
      loadingTxt: ``,
      tableIsLoading: false,
      isSubmit: false,
      isExport: false,
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
    this.setState({tableIsLoading: true, record: record && record !== 'null' ? parseInt(record) : 0}, () => {
      this.getSku();
    });
  }

  // 打开弹窗
  showModal(e) {
    const {input} = this.state;
    let item = e.target.files[0];
    // 格式校验
    if (item.type === `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
      || item.type === `application/vnd.ms-excel`) {
      let reader = new FileReader();
      // 定义reader的加载方法, 于加载完成后触发
      reader.onload = (e) => {
        let data = e.target.result, wb;
        wb = XLSX.read(data, {
          type: 'binary'
        });
        // 这里对list进行复制, 并且于此改写形式
        let excelDataListOrigin = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]), excelDataList = [],
          errorList = [];
        for (let i in excelDataListOrigin) {
          // i + 2 = 表单内行数号
          let code = excelDataListOrigin[i].商品货号,
            price = excelDataListOrigin[i].成本价,
            name = excelDataListOrigin[i].商品名称,
            brand = excelDataListOrigin[i].品牌,
            netWeight = excelDataListOrigin[i].净重,
            grossWeight = excelDataListOrigin[i].毛重,
            purchaseArea = Country[excelDataListOrigin[i].原产国];
          if (!code || !price) {
            errorList.push({
              Num: parseInt(i),
              errValue: `${!code ? `商品货号 ` : ``}${!code ? '商品名称 ' : ''}${!code ? '品牌 ' : ''}${!code ? '净重 ' : ''}${!code ? '毛重 ' : ''}${!code ? '原产国 ' : ''}${!price ? `成本价` : ``}`,
            })
          } else {
            excelDataList.push({
              skuCode: code,
              recordPrice: price,
              Num: parseInt(i),
              name: name,
              brand: brand,
              netWeight: netWeight,
              grossWeight: grossWeight,
              purchaseArea: purchaseArea,
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
      this.setState({importModalVisible: false}, () => {
        input.value = null;
      })
    }
  }

  // 寻找 input 进行点击
  clickIT() {
    const {input,} = this.state;
    input.click();
  }

  // 获取表单列表
  getSku(searchValue = this.state.searchValue,
         record = this.state.record,
         pageNum = this.state.pageNum,
         pageSize = this.state.pageSize) {
    fetch(`${window.fandianUrl}/sku/getSku`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({choice: record, pageNum: pageNum, pageSize: pageSize, searchParm: searchValue.trim()}),
    }).then(r => r.json()).then(r => {
      this.setState({tableIsLoading: false, dataList: []});
      if (r.status) {
        if (r.status === 10000) {
          let skuCodeList=[];
          for (let i = 0; i < r.data.list.length; i++) {
            skuCodeList.push(r.data.list[i].skuCode);
          }

          this.setState({
            skuCodeList:skuCodeList,
            dataList: r.data.list,
            pageNum: r.data.pageNum,
            pageSize: r.data.pageSize,
            pageTotal: r.data.total,
            pageSizeOptions: [`50`, `100`, `200`, `${r.data.total > 300 ? r.data.total : 300}`]
          })
        } else if (r.status === 10001) {
          message.warn(`${r.msg}`);
        } else {
          message.error(`${r.msg} 状态码:${r.status}`);
        }
      } else {
        message.error(`后端数据错误`)
      }
    }).catch(() => {
      this.setState({tableIsLoading: false, dataList: []});
      message.error(`商品列表接口调取失败`)
    });
  }

  // 导出备案excel
  exportExcel_record_1() {
    let elt = document.getElementById('tableList_record_1');
    let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
    XLSX.writeFile(wb, `商品资料库 (美渠) ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`);
  }

  // 导出未备案excel
  exportExcel() {
    const {record, dataList,} = this.state;
    let elt = document.getElementById('tableList');
    let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
    XLSX.writeFile(wb, (record === 3 ? `商品资料库备案表 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx` : `商品资料库 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`));
    // 导出的同时调取接口,将相应的商品状态改为备案中
    let dataArray = [], dataArrayAll = [];
    for (let i of dataList) {
      dataArray.push(i.skuCode);
      dataArrayAll.push({
        skuId: i.skuId, name: i.name, recordPrice: i.recordPrice,
        // skuCode: i.skuCode,
        skuCode: `${i.skuCode}`,
        specificationType: i.specificationType, brand: i.brand, netWeight: i.netWeight, grossWeight: i.grossWeight
      })
    }
    // loading
    this.setState({isExport: true});
    fetch(`${window.fandianUrl}/sku/sendExcel`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dataArrayAll),
    }).then(r => r.json()).then(r => {
      if (r.status) {
        if (r.status === 10000) {
          // 当备份excel文件接口调取成功以后,再行处理更改备案状态接口以做保险
          // message.success(`${r.msg}`);
          fetch(`${window.fandianUrl}/sku/updateProductRecordState`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataArray),
          }).then(r => r.json()).then(r => {
            if (r.status) {
              if (r.status === 10000) {
                message.success(`${r.msg}`);
                this.setState({exportModalVisible: false})
              } else {
                message.error(`${r.msg}, 错误码:${r.status}`)
              }
            } else {
              message.error(`后端数据错误`)
            }
            this.setState({tableIsLoading: true, isExport: false}, () => {
              this.getSku();
            });
          }).catch(() => {
            message.error(`前端错误: 将未备案数据改为已备案状态接口调取失败`)
          })
        } else {
          message.error(`${r.msg}, 错误码: ${r.status}`)
        }
      } else {
        message.error(`后端数据错误`)
      }
    }).catch(() => {
      message.error(`前端错误: 备份excel文件接口调取失败`);
      this.setState({tableIsLoading: true, isExport: false}, () => {
        this.getSku();
      });
    });
  }

  // 判断行邮方式
  postWay(q) {
    let way;
    switch (q) {
      case 0:
        way = '无';
        break;
      case 1:
        way = 'ETK';
        break;
      case 2:
        way = 'BC';
        break;
      default :
        way = '数据错误'
    }
    return way;
  }

  // 更改是否已备案条件触发
  changeRecord(e) {
    this.props.history.push(`/commodities-manage/commodities-database?record=${e.target.value}`);
    this.setState({
      tableIsLoading: true,
      record: e.target.value,
      pageNum: 1,
      pageSize: 100,
    }, () => {
      this.getSku()
    })
  }

  // 调取根据skuId修改备案价以及备案状态接口
  updateSkuByUploadExcel() {
    const {Num, excelDataList, successList, failList, failListNum,} = this.state;
    if (Num < excelDataList.length) {
      this.setState({isSubmit: true});
      fetch(`${window.fandianUrl}/sku/updateSkuByUploadExcel`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          // skuCode: excelDataList[Num].skuCode,
          skuCode: excelDataList[Num].skuCode.split(`JD`)[1],
          recordPrice: excelDataList[Num].recordPrice,
          isRecord: 1,
          brand: excelDataList[Num].brand,
          name: excelDataList[Num].name,
          netWeight: excelDataList[Num].netWeight,
          grossWeight: excelDataList[Num].grossWeight,
          purchaseArea: excelDataList[Num].purchaseArea,
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
            // 于后端约定, 10000 为成功,当大于 10000 为 error 报错, 当小于 10000 则为 warn 警告
            if (parseInt(r.status) < 10000) {
              message.warn(`${r.msg}, 状态码: ${r.status}`);
            } else {
              message.error(`${r.msg}, 状态码: ${r.status}`);
            }
            let dataObj = Object.assign({}, excelDataList[Num]);
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
      this.setState({tableIsLoading: true, isSubmit: false}, () => {
        this.getSku();
      });
    }
  }

  // 更改当前页或每页显示条数
  changePage(n, s) {
    this.setState({
      pageNum: n,
      pageSize: s,
      tableIsLoading: true
    }, () => {
      this.getSku(undefined, undefined)
    });

  }

  // 跳转至编辑界面
  toCE(type, skuId) {
    const {record,} = this.state;
    // 使用query传值
    // 在这里清空本地相关数据, 使得编辑和新增功能不受干扰
    localStorage.removeItem('imgList');
    localStorage.removeItem('newImgList');
    this.props.history.push(`/commodities-manage/commodities-database/create-and-edit?type=${type}&skuId=${skuId}&record=${record}`);
  }

  //下载图片
  downLoadPic() {
    var that = this;
    this.setState({loadingTxt: '图片下载中...',count: 0,dowmloadFailPic:[]});
    fetch(`${window.fandianUrl}/sku/selectNoRecord`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state.skuCodeList)
    }).then(r => r.json()).then((res) => {
      if (res.status === 10000) {
        this.setState({picList:res.data});
        this.main(res.data[this.state.count].imgUrl);

      }
      if (res.status !== 10000) {
        message.error(`${res.status}:${res.msg}`);
      }
    })
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/jpeg");  // 可选其他值 image/jpeg
    return dataURL;
  }

  main(src) {
    image.onload = function () {
      var base64 = window.commoditiesDataBase.getBase64Image(image);
      //that.dataURLtoFile(base64);
      //console.error(base64.split(',')[1]) ;
      var data = base64.split(',')[1];
      //zip.file(`123.png`, "213", {base64: true});
      zip.file(`JD${window.commoditiesDataBase.state.picList[window.commoditiesDataBase.state.count].skuCode}.jpg`, data, {base64: true});
      if(window.commoditiesDataBase.state.count == window.commoditiesDataBase.state.picList.length-1){
        window.commoditiesDataBase.setState({downloadVisible: true})

        var file_name = `未备案商品图片(${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}).zip`;
        zip.generateAsync({type: "blob"}).then(function (content) {
          // see FileSaver.js
          //console.error(content);
          window.commoditiesDataBase.setState({loadingTxt: ''});
          saveAs(content, file_name);
        });
      }else{
        window.commoditiesDataBase.setState({count:window.commoditiesDataBase.state.count+1},function () {
          window.commoditiesDataBase.main(window.commoditiesDataBase.state.picList[window.commoditiesDataBase.state.count].imgUrl);
        })
      }
    }
    image.onerror = () => {
      window.commoditiesDataBase.state.dowmloadFailPic.push(window.commoditiesDataBase.state.picList[window.commoditiesDataBase.state.count].skuCode);
      if(window.commoditiesDataBase.state.count == window.commoditiesDataBase.state.picList.length-1){
        this.setState({downloadVisible: true})
        var file_name = `未备案商品图片(${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}).zip`;
        zip.generateAsync({type: "blob"}).then(function (content) {
          // see FileSaver.js
          //console.error(content);
          window.commoditiesDataBase.setState({loadingTxt: ''});
          saveAs(content, file_name);
        });
      }else{
        window.commoditiesDataBase.setState({count:window.commoditiesDataBase.state.count+1},function () {
          window.commoditiesDataBase.main(window.commoditiesDataBase.state.picList[window.commoditiesDataBase.state.count].imgUrl);
        })
      }

    }
    image.src = src + '?v=' + Math.random(); // 处理缓存
  }
  downloadPicModal (){
    this.setState({downloadVisible: false})
  }
  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const {dataList, searchValue, pageNum, pageSize, pageTotal, pageSizeOptions, record, loadingTxt, importModalVisible, dowmloadFailPic,downloadVisible,input, errorList, isSubmit, failList, failListNum, excelDataList, successList, tableIsLoading, exportModalVisible, isExport,} = this.state;
    const Search = Input.Search;
    // 表单头
    const columns = [
      {
        title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160,
        render: (text, record) => (
          <div>{!!record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        )
      },
      {title: '商品名称', dataIndex: 'name', key: 'name', width: 160},
      {title: '商品条码', dataIndex: 'skuCode', key: 'skuCode', width: 160},
      {
        title: '备案价(¥)', dataIndex: 'recordPrice', key: 'recordPrice', width: 120,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.recordPrice ? record.recordPrice : '无'}</div>
        ),
      },
      {
        title: '行邮方式', dataIndex: 'sugPostway', key: 'sugPostway', width: 100,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{this.postWay(record.sugPostway)}</div>
        ),
      },
      {title: '商品品牌', dataIndex: 'brand', key: 'brand', width: 140},
      {title: '毛重(kg)', dataIndex: 'grossWeight', key: 'grossWeight', width: 80},
      {title: '采购价', dataIndex: 'costPrice', key: 'costPrice', width: 120},
      // {title: '商品品类', dataIndex: 'category', key: 'category', width: 140},
      {title: '数量', dataIndex: 'stock', key: 'stock', width: 80},
      {
        title: '税率', dataIndex: 'taxRate', key: 'taxRate', width: 80,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.taxRate ? `${record.taxRate}%` : '无'}</div>
        ),
      },
      {
        title: '操作', dataIndex: '操作', key: '操作',
        // width: 100,
        // fixed: 'right',
        render: (text, record) => (
          <div>
            <Button type="primary"
                    style={{'margin': 0}}
                    onClick={this.toCE.bind(this, 'edit', record.skuId)}
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
      {title: `原产国`, dataIndex: `purchaseArea`, key: `purchaseArea`, width: 80,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{
            record.purchaseArea ? (()=>{
              let code = null;
              for (let n in Country) {
                if (Country[n] === record.purchaseArea) code = n;
              }
              return code;
            })() : ''
          }</div>
        ),
      },
      {title: `生产厂家`, dataIndex: `brand`, key: `brandOrigin`, width: 80},
      {title: `商检备案号`, dataIndex: `商检备案号`, key: `商检备案号`, width: 50},
      {title: `这行不能修改任何名称`, dataIndex: `这行不能修改任何名称`, key: `这行不能修改任何名称`},
      // 暂不显示skuId
      // {title: `这一列请勿修改任何数据`, dataIndex: `skuId`, key: `skuId`, width: 80},
    ];
    return (
      <div className="dataBase">
        {/*加载*/}
        {loadingTxt && <PageLoading loadingTxt={loadingTxt} percentage={`${this.state.count}/${this.state.picList.length}`}/>}

        {/*导出弹窗*/}
        <Modal title="导出"
               className="exportModal"
               visible={exportModalVisible}
               onOk={this.exportExcel.bind(this)}
               confirmLoading={!!isExport}
               onCancel={() => {
                 isExport ?
                   message.warn(`数据备案中,请勿关闭`)
                   : this.setState({exportModalVisible: false})
               }}
        >
          <p>确认是否导出该页全部商品excel文件, 并将他们移至至备案中</p>
          <p style={{color: `red`, opacity: .8}}>请将导出的excel文件妥善保存</p>
        </Modal>

        {/*导入弹窗*/}
        <Modal title="导入"
               className="importModal"
               visible={importModalVisible}
               confirmLoading={!!isSubmit}
               onOk={this.updateSkuByUploadExcel.bind(this)}
               onCancel={
                 () => {
                   isSubmit ?
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
                     }, () => {
                       input.value = null;
                     })
                 }
               }
        >
          <p>所选文件名: {!!input.value ? input.files[0].name : null}</p>
          {isSubmit ? <p><Icon type="loading"/> <span style={{color: `red`}}>正在上传数据中... 请勿关闭页面!!!</span></p> : null}
          <p>{`当前上传条数 ${successList.length}/${excelDataList.length}, 成功${successList.length}条, 失败${failList.length}条`}</p>
          <p style={{color: `red`}}>请注意备份本页报错数据, 并根据报错提示检查备案表内数据</p>
          <div className="failList">
            <p>{`excel表内出错数据行数: ${failListNum}`}</p>
            {failList.map((item, i) => (
              <p key={i}>{parseInt(item.status) < 10000 ?
                (`excel表内警告数据行数: ${item.Num + 2}, 警告原因: ${item.msg}, 状态码: ${item.status}`)
                : (`excel表内出错数据行数: ${item.Num + 2}, 出错原因: ${item.msg}, 状态码: ${item.status}`)
              }</p>
            ))}
          </div>
          {errorList.length > 0 ? <p>当前excel表格存在数据漏填, 如继续导入, 以下行数数据则不会进行处理</p> : ``}
          <div className="errorList">
            {errorList.map((item, i) => (
              <p key={i}>{`excel表内出错数据行数: ${item.Num + 2}, 出错数据值: ${item.errValue}`}</p>
            ))}
          </div>
        </Modal>
        {/*下载图片弹窗*/}
        <Modal title="下载图片"
               className="exportModal"
               visible={downloadVisible}
               onOk={this.downloadPicModal.bind(this)}
               onCancel={this.downloadPicModal.bind(this)}
        >
          {this.state.dowmloadFailPic.length===0 ? <p>下载成功</p> : <p>下载失败的商品条码为:</p>}
          {
            dowmloadFailPic.map((item,index)=>{
              return (
                <p key={index} style={{color: `red`, opacity: .8}} >{item}</p>
                )
            })
          }
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
                  onClick={this.toCE.bind(this, 'create', null)}
          >新增商品</Button>


          {record === 1 && <Button type="primary"
                                   className="exportExcelBtn"
                                   onClick={this.exportExcel_record_1.bind(this)}
          >导出已备案资料</Button>}

          {record === 2 && <Button type="primary"
                                   className="exportExcelBtn"
                                   onClick={() => this.setState({exportModalVisible: true})}
          >excel导出</Button>}
          {record === 2 && <Button type="primary" className="importExcelBtn" onClick={this.downLoadPic.bind(this)}>下载图片</Button>}
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
               ref={'commoditiesTable'}
               dataSource={dataList}
          // columns={record === 2 ? columnsForExport : columns}
               columns={columns}
               pagination={false}
               bordered
               scroll={{y: 500, x: 1400}}
               rowKey={(record, index) => `id_${index}`}
               loading={tableIsLoading}
        />

        {/*分页*/}
        <Pagination className="tablePagination"
                    total={pageTotal}
                    pageSize={pageSize}
                    current={pageNum}
                    showTotal={(total, range) =>
                      `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 `}共 ${total} 条记录`
                    }
                    style={{float: 'right', marginRight: 20, marginTop: 10, marginBottom: 20}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={pageSizeOptions}
                    onShowSizeChange={this.changePage.bind(this)}
        />

        {/*导出用表单*/}
        {record === 2 && <Table className="tableListForExport"
                                id="tableList"
                                columns={columnsForExport}
                                dataSource={dataList}
                                pagination={false}
                                style={{display: 'none'}}
                                rowKey={(record, index) => `id_${index}`}
        />}

        {/*已备案导出用表单, 美渠推单用*/}
        {record === 1 && <Table className="tableListForExport_20190312"
                                id="tableList_record_1"
                                columns={[
                                  {title: `商品条形码`, dataIndex: `skuCode`, key: `skuCode`},
                                  {title: `商品名称`, dataIndex: `name`, key: `name`},
                                  {title: `备案价`, dataIndex: `recordPrice`, key: `recordPrice`, width: 80},
                                  {title: `净重(kg)`, dataIndex: `netWeight`, key: `netWeight`},
                                  {title: `毛重(kg)`, dataIndex: `grossWeight`, key: `grossWeight`},
                                  {title: `商品品牌`, dataIndex: `brand`, key: `brand`},
                                  {title: `规格型号`, dataIndex: `specificationType`, key: `specificationType`},
                                  {title: `单位`, dataIndex: `modelNumber`, key: `modelNumber`},
                                  {title: `数量/库存`, dataIndex: `stock`, key: `stock`},
                                  {title: `税率(%)`, dataIndex: `taxRate`, key: `taxRate`},
                                  {title: `采购地`, dataIndex: `purchaseArea`, key: `purchaseArea`},
                                  {title: `海关编码`, dataIndex: `customsCode`, key: `customsCode`},
                                  {
                                    title: `建议行邮方式`, dataIndex: `sugPostway`, key: `sugPostway`,
                                    render: (text, record) => (
                                      // 这里判断行邮方式
                                      <div>{record.sugPostway === 1 ? `ETK` : (record.sugPostway === 2 ? `BC` : `无`)}</div>
                                    ),
                                  },
                                  {title: `品类`, dataIndex: `category`, key: `category`},
                                  {title: `行邮税号`, dataIndex: `postcode`, key: `postcode`},
                                ]}
                                dataSource={dataList}
                                pagination={false}
                                style={{display: 'none'}}
                                rowKey={(record, index) => `id_${index}`}
        />}
      </div>
    )
  }
}

export default commoditiesDataBase;