import React from 'react';
import {Select, Button, Table, message, Form } from 'antd';
import './index.less';

const tableDataList = [{}];
const FormItem = Form.Item;
const Option = Select.Option;

class setRebate extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      shopList: [],
    };
  }
  // 加载商场列表
  componentWillMount() {
    fetch(window.fandianUrl + '/mall/getMallList', {
      method: 'POST'
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        // message.success(r.retcode.msg)
        let dataList = [];
        for (let i of r.data) {
          // console.log(i)
          dataList.push(<Option key={i.mallId} value={i.mallName}>{i.mallName}</Option>)
        }
        this.setState({
          shopList: dataList
        })
        // 成功静默处理
        // message.success(`${r.retcode.msg},状态码为:${r.retcode.status}`)
      } else {
        message.error(`${r.retcode.msg},状态码为:${r.retcode.status}`)
      }
    })
  }
  // 选择商场触发
  selectShop(shopName,target) {
    // console.log(shopName,target);
    fetch(window.fandianUrl + '/rebate/selectAllRebateByMallName', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: `mallName=${shopName}`,
    }).then(r => r.json()).then(r => {
      console.log(r)
      if (r.retcode.status === 10000) {
        console.log(r.data)
        this.setState({

        })
      }
    })
  }
  // 打开编辑弹窗
  openEdit() {
    console.log('edit')
  }
  // 打开新增弹窗
  openCreate() {
    console.log('create')
  }
  render() {
    const columns=[
      {title: '商场', dataIndex: '商场', key: '商场'},
      {title: '品牌', dataIndex: '品牌', key: '品牌'},
      {title: '商品码', dataIndex: '商品码', key: '商品码'},
      {title: '最近更新时间', dataIndex: '最近更新时间', key: '最近更新时间'},
      {title: '返点率', dataIndex: '返点率', key: '返点率'},
      {title: '操作', dataIndex: '操作',
        key: '操作',
        render: (text, record) => (
          <div><Button type="primary"
                       style={{'margin':0}}
                       onClick={this.openEdit.bind(this)}
          >编辑</Button></div>
        ),
      }
    ];
    const {shopList, } = this.state;
    return (
      <div className="setRebate">
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  onChange={this.selectShop.bind(this)}
          >
            {shopList}
          </Select>
        </div>
        <div className="btnLine">
          <Button type="primary"
                  onClick={this.openCreate.bind(this)}
          >新增品牌</Button>
        </div>
        <Table className="tableList"
               dataSource={tableDataList}
               columns={columns}
               pagination={false}
               bordered
               rowKey={(record, index) => `id_${index}`}
        />
      </div>
    )
  }
}

export default setRebate;