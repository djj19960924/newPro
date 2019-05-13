import React from 'react';
import { Button, Table, message, Pagination, Modal, } from 'antd';
import moment from 'moment';
import './index.less';

class roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 表单数据
      tableDataList: [],
      // 表单加载状态
      tableIsLoading: false,
      // 分页相关
      pageTotal: 0,
      pageNum: 1,
      pageSize: 100,
      pageSizeOptions: [`50`,`100`,`200`,`300`]
    };
  }

  componentWillMount() {
    // 模拟登陆
    let data = {userName: 'vogue1314', password: '123456'};
    this.ajax.post('/login/auth', data).then(r => {
      r.showError(message);
      if (r.data.status === 10000) message.success(r.data.msg)
    });
  }

  componentDidMount() {
    this.getRoleList();
  }

  // 获取角色列表
  getRoleList() {
    const { pageNum, pageSize, } = this.state;
    this.setState({tableIsLoading: true});
    let dataObj = {pageNum:pageNum,pageSize:pageSize};
    this.ajax.post('/role/getRoleList', dataObj).then(r => {
      const { data } = r;
      if (data.status === 10000) {
        this.setState({
          tableDataList: data.data.list,
          pageTotal: data.data.total
        })
      }
      r.showError(message);
      this.setState({tableIsLoading: false});
    }).catch(r => {
      r.showError(message);
      this.setState({tableIsLoading: false});
    })
  }

  // 获取角色列表
  changePage(pageNum, pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },()=>{

    })
  }

  renderPermissions(text, record) {
    const dataList = [];
    for (let n of record.permissions)
      if (!dataList.includes(n.menuName)) dataList.push(n.menuName);
    return (
      <div className="tabsList">
        {dataList.map((item,index) =>
        <div className="tabs" key={index}>{item}</div>)}
      </div>
    )
  }

  render() {
    const { tableDataList, tableIsLoading, pageTotal, pageSize, pageNum, pageSizeOptions, } = this.state;
    const columns = [
      {title: 'ID', dataIndex: 'roleId', key: 'roleId', width: 80},
      {title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 140},
      {title: '权限', dataIndex: 'permissions', key: 'permissions',
        render: (text, record) => this.renderPermissions(text, record)
      },
      {title: '操作', dataIndex: '操作', key: '操作', width: 270, fixed: 'right',
        render: (text, record) => (
          <div>
            <Button type="primary"
            >查看详情</Button>
            <Button type="primary"
                    style={{marginLeft: 10}}
            >修改</Button>
            <Button type="danger"
                    style={{marginLeft: 10}}
            >删除</Button>
          </div>
        )
      },
    ];
    return (
      <div className="roles">
        <div className="title">角色管理</div>
        <div className="btnLine">
          <Button type="primary"
          >新增角色</Button>
        </div>
        <div className="TableMain">
          {/*表单主体*/}
          <Table className="tableList"
                 id="tableList"
                 dataSource={tableDataList}
                 columns={columns}
                 pagination={false}
                 loading={tableIsLoading}
                 bordered
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

export default roles;