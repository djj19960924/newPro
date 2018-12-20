import React from 'react';
import {Table , Button} from 'antd';
import columns from './columns';
import './index.less';

class orderMatched extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[]
    };
  }
  componentWillMount() {
    fetch("http://api.maishoumiji.com/box/getUploadBoxOrder",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.boxOrderList})
      // console.log(res.boxOrderList);
    })
  }

  render() {
    return (
      <div className="orderMatched">
        <Table className="tableList"
               dataSource={this.state.dataSource}
               columns={columns}
               bordered
               rowKey={(record, index) => `id:${record.boxCode}${index}`}
               scroll={{
                 x: 1800,
                 y: 600
               }}
        />
      </div>
    )
  }
}

export default orderMatched;