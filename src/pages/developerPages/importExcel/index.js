import React from 'react';
import { Button, message, } from 'antd';
import XLSX from 'xlsx';
// xlsx转blob
import '@js/FileSaver.min.js';

import './index.less';
class importExcel extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
    window.importExcel = this;
    window.XLSX = XLSX;
  }

  componentDidMount() {
    let input = document.createElement(`input`);
    input.type = `file`;
    input.className = "inputImport";
    input.onchange = this.importExcel.bind(this);
    this.setState({input: input});
  }

  // 导出excel方法
  exportExcel () {
    let elt = document.getElementById('tableList');
    let wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});

    // 转为下载文件
    XLSX.writeFile(wb, `test.xlsx`);

    // 转为blob
    // 不会阻止文件下载行为
    let blob = XLSX.write(wb,{ bookSST:false, type:'base64' });
    window.saveAs(new Blob([blob],{type:"application/octet-stream"}), "test.xlsx");
  }
  // 导入
  importExcel(e){
    console.log(e.target.files[0]);
    let item = e.target.files[0];
    // 判断文件类型为 .xlsx 或 .xls
    if (item.type === `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
      || item.type === `application/vnd.ms-excel`) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = e.target.result,wb;
        wb = XLSX.read(data, {
          type: 'binary'
        });
        // json
        console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
      };
      reader.readAsBinaryString(e.target.files[0]);
      // 改写标签内容, 将文件名写入
      document.getElementsByClassName(`filesName`)[0].innerHTML = e.target.files[0].name;
    } else {
      message.error(`文件类型错误`);
      e.target.value = ``
    }
  }
  // 寻找 input 进行点击
  clickIIT() {
    const { input, } = this.state;
    input.click();
  }
  render() {
    return (
      <div className="importExcel">
        导入excel
        <div className="btnLine">
          <Button onClick={this.clickIIT.bind(this)}
                  type="primary"
          >点击上传</Button>
          <p className="filesName" />
        </div>
      </div>
    )
  }
}

export default importExcel;