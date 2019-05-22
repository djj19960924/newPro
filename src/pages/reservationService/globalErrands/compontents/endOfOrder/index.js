import React from "react";
import moment from "moment";
import {Table, message, Pagination,Input} from "antd";
import "./index.less";

class EndOfOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNum: 1,
      pageSize: 2,
      pageSizeOptions: ["2","3", "4", "5"],
      dataSource: [],
      tableLoading: false
    };

  }

  componentWillMount() {
    this.getOrderInfo();
  }

  //获取表格信息
  getOrderInfo(pageNum = this.state.pageNum, pageSize = this.state.pageSize,searchParm=this.state.searchParm) {
    let data = {
      isEnd: 1,
      pageNum: pageNum,
      pageSize: pageSize,
      searchParm: searchParm
    };
    this.setState({tableLoading: true});
    fetch(window.apiUrl + "/legworkBackend/getLegworkByIsEnd", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(r => r.json()).then(res => {
        this.setState({tableLoading: false});
        if (res.status === 10000) {
          message.success(res.msg);
          this.setState({dataSource: res.data.list, orderNum: res.data.total})
          if (res.data.total > this.state.pageSizeOptions[this.state.pageSizeOptions.length-1]) {
            let pageSizeOptions=this.state.pageSizeOptions;
            pageSizeOptions.push([res.data.total].toString());
            this.setState({pageSizeOptions:pageSizeOptions})
          }
        } else if (res.status === 10004) {
          message.warn(res.msg);
        } else {
          message.error(res.msg);
        }
      }
    ).catch(r => {
      this.setState({tableLoading: false});
      console.error(r);
      console.log('前端接口调取错误')
    })
  }

//改变pageNum,pageSize
  changePage(pageNum, pageSize) {
    this.setState({pageNum:pageNum,pageSize:pageSize},()=>{
      this.getOrderInfo(pageNum, pageSize);
    })

  }

  render() {
    const columns = [
      {
        title: "最近进度更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
        width: 150,
        render: (text, record) => (
          <div>{moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        )
      },
      {
        title: "预订时间",
        dataIndex: "createTime",
        key: "createTime",
        width: 150,
        render: (text, record) => (
          <div>{moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        )
      },
      {
        title: "微信号",
        dataIndex: "wechatNo",
        key: "wechatNo",
        width: 150
      },
      {
        title: "商品内容",
        dataIndex: "productName",
        key: "productName",
        width: 150
      }
    ];
    const {dataSource, tableLoading, pageSize, pageNum, pageSizeOptions, orderNum} = this.state;
    const Search=Input.Search;
    return (
      <div className="end-order">
        <Search  className="searchInput" placeholder="输入关键字搜索"  onSearch={value => {this.getOrderInfo(undefined,undefined,value);this.setState({searchParm:value})}} />
        <Table bordered
               columns={columns}
               dataSource={dataSource}
               loading={tableLoading}
               rowKey={(record, index) => `${record.id}`}
               pagination={false}
               scroll={{x: 960, y: 600}}
        />
        <Pagination current={pageNum}
                    pageSize={pageSize}
                    pageSizeOptions={pageSizeOptions}
                    total={orderNum}
                    showSizeChanger
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[1]}-${range[0]} 条 `}共 ${total} 条记录`}
                    style={{float: 'right', marginRight: '20px', marginTop: '10px'}}
                    onChange={this.changePage.bind(this)}
                    onShowSizeChange={this.changePage.bind(this)}
        />
      </div>
    );
  }
}


export default EndOfOrder;