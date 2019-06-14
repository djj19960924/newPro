import React from "react";
import {Radio, Table, Pagination, Button, Input, message, Modal, Icon} from 'antd';
import "./index.less";

class SKTListToBeEntered extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 分页状态
      pageNum: 1,
      pageSize: 100,
      pageTotal: 0,
      // 每页显示数据条数选择框
      pageSizeOptions: [`50`, `100`, `200`, `300`],
      // 表单加载中显示
      tableIsLoading: false,
    };
  }
  // 更改当前页或每页显示条数
  changePage(pageNum, pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize
    }, () => {
      //
    });
  }

  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => null
  }
  render() {
    const columns = [
      {}
    ];
    const {dataList, pageNum, pageSize, pageTotal, pageSizeOptions, tableIsLoading} = this.state;
    return (
      <div className="SKTListToBeEntered">
        <div className="tableMain">
          {/*表单主体*/}
          <Table className="tableList"
                 ref={'commoditiesTable'}
                 dataSource={dataList}
                 columns={columns}
                 pagination={false}
                 bordered
                 scroll={{y: 500, x: 1300}}
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
                      onChange={this.changePage.bind(this)}
                      showSizeChanger
                      pageSizeOptions={pageSizeOptions}
                      onShowSizeChange={this.changePage.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default SKTListToBeEntered;