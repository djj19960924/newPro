import React from 'react';
import {Radio, Table, Pagination, Button, } from 'antd';

import './index.less';

class dataBase extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const columns = [], RadioButton = Radio.Button, RadioGroup = Radio.Group;
    return (
      <div className="dataBase">
        <div className="btnLine">
          <Button type="primary">新增商品</Button>
          <Button type="primary">excel导入</Button>
          <Button type="primary">excel导出</Button>
        </div>
        <RadioGroup defaultValue={0}
                    buttonStyle="solid"
                    className="radioBtn"
                    // onChange={this.changePaidMode.bind(this)}
        >
          <RadioButton value={0}>全部</RadioButton>
          <RadioButton value={1}>已备案</RadioButton>
          <RadioButton value={2}>未备案</RadioButton>
        </RadioGroup>
        <Table className="tableList"
               // dataSource={dataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 600 }}
               rowKey={(record, index) => `id_${index}`}
        />
        <Pagination className="tablePagination"
                    // total={this.state.pageTotal}
                    // pageSize={this.state.pageSize}
                    // current={this.state.pageNum}
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
                    style={{float:'right',marginRight:'20px',marginTop:'10px'}}
                    // onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    // onShowSizeChange={this.changePageSize.bind(this)}
        />
      </div>
    )
  }
}

export default dataBase;