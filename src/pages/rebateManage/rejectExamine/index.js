import React from 'react';
import {Select,Table,message,Pagination,Button,Icon} from 'antd';
import countryList from '@js/country';
import './index.less';

const Option = Select.Option;

class rejectExamine extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      //选择的国家
      country:'',
      //国家列表
      countries: [],
      //选择的商场
      shop:undefined,
      // 商场列表
      shopList: [],
      pageNum: 1,
      pageSize: 10,
      //总条数
      pageTotal: null,
      //table数据
      dataSource:[],
      //商品名
      mallName:'',
      //遮罩层
      mask:'unShow',
      //小票图片
      pictureUrl:'',
      ticketUrl:'unShow'
    };
  }
  componentDidMount() {
    let countries = [];
    for (let i of countryList) {
      countries.push(<Option key={i.id} value={i.nationName}>{i.nationName}</Option>)
    }
    this.setState({
      countries: countries
    })

  }
  // 监听选择国家事件
  selectCountry(val, option) {
    this.setState({country:val})
    this.setState({country:val,dataSource: [],  pageTotal: null,mallName:'',shop:undefined});
    fetch(window.fandianUrl + '/mall/getMallList', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:'nationName='+val
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        // message.success(r.retcode.msg)
        let dataList = [];
        for (let i of r.data) {
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
    });
  }
  // 监听选择商店事件
  selectShop(val, option) {
    this.setState({shop:val})
    // val即商场名, option.key即商场ID
    // console.log(val, option.key)
    this.rejectByMall(val);
  }
  //根据商场获取驳回小票
  rejectByMall(val,pageNum=this.state.pageNum,pageSize=this.state.pageSize) {
    fetch(window.fandianUrl + '/recipt/getReciptOfRejected', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: 'mallName=' + val+'&pageNum='+pageNum+'&pageSize='+pageSize,
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        this.setState({dataSource: r.data.list,  pageTotal: r.data.total,mallName:val});
      }
    })
  }
  // 改变每页尺寸
  changePageSize(pageNum,pageSize) {
    this.rejectByMall(this.state.mallName,pageNum,pageSize)
  }
  // 翻页事件
  changePage(pageNum,pageSize) {
    this.rejectByMall(this.state.mallName,pageNum,pageSize);
  }
  //查看小票
  checkTicket(pictureUrl) {
    this.setState({pictureUrl:pictureUrl,mask:'mask',ticketUrl:'ticketUrl'})
  }
  //取消小票图片 遮罩层
  removeMask() {
    this.setState({mask: 'unShow',pictureUrl:'',ticketUrl:'unShow'})
  }
  //时间转化
  formatDate(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
  render() {
    const columns=[
      {
        title: '商场名称',
        dataIndex: 'mallName',
        key: 'mallName',
      }, {
        title: '提交时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record) => (  //塞入内容
          <div className="ellipsis">{this.formatDate(record.createTime)}</div>
        ),
      },
      , {
        title: '处理时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text, record) => (  //塞入内容
          <div className="ellipsis">{this.formatDate(record.updateTime)}</div>
        ),
      }, {
        title: '备注',
        dataIndex: 'note',
        key: 'note',
        render: (text, record) => (  //塞入内容
          <div className="ellipsis">{record.note==0 ? '小票不清晰':(record.note==1 ? '团号不正确': (record.note==2 ? '小票重复':'其他'))}</div>
        ),
      },{
        title: '查看',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
        render: (text, record) => (  //塞入内容
          <div className="ellipsis"><Button type="primary" onClick={this.checkTicket.bind(this,record.pictureUrl)} style={{'margin':0}}>查看</Button></div>
        ),
      }
    ];
    return (
      <div className="rejectExamine">
        <div className="shopSelect">
          <span>所属国家: </span>
          <Select className="selectShops"
                  placeholder="请选择国家"
                  onChange={this.selectCountry.bind(this)}
          >
            {this.state.countries}
          </Select>
        </div>
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  value={this.state.shop}
                  onChange={this.selectShop.bind(this)}
          >
            {this.state.shopList}
          </Select>
        </div>
        <Table  id="table"
                className="tableList"
                columns={columns}
                dataSource={this.state.dataSource}
                bordered
                rowKey={(record, index) => `id:${record.boxCode}${index}`}
                pagination={false}
                locale={{
                  emptyText: <div className="noShop">
                    {!this.state.country && <div className="noShopDiv"><Icon type="shop" className="iconShop"/><span>请选择国家</span></div>}
                    {this.state.country && !this.state.shop && <div className="noShopDiv"><Icon type="shop" className="iconShop"/><span>请选择商场</span></div>}
                  </div>,
                }}
        />
        <Pagination className="tablePagination"
                    total={this.state.pageTotal}
          // total={50}
                    pageSize={this.state.pageSize}
                    current={this.state.pageNum}
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
                    style={{float:'right',marginRight:'20px'}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    onShowSizeChange={this.changePageSize.bind(this)}
        />
        <div className={this.state.mask} onClick={this.removeMask.bind(this)} />
        <div className={this.state.ticketUrl}>
          <img src={this.state.pictureUrl} alt=""/>
        </div>
      </div>
    )
  }
}

export default rejectExamine;