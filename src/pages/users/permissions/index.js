import React from 'react';
import { Button, Table, message, Pagination, Modal, Input, Form, Select, } from 'antd';
import { observer } from 'mobx-react/index';
import './index.less';

@observer @Form.create()
class permissions extends React.Component {
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
      pageSizeOptions: [`50`,`100`,`200`,`300`],
      // 显示弹窗
      showDetails: false,
      detailState: 'detail',
      // 当前账户信息
      currentInfo: {},
      parentIdObject: {},
    };
  }

  componentDidMount() {
    this.getPermissionList();
  }

  // 权限列表
  getPermissionList() {
    const { pageNum, pageSize, parentIdObject, } = this.state;
    this.setState({tableIsLoading: true});
    let dataObj = {pageNum:pageNum,pageSize:pageSize};
    this.ajax.post('/permission/getPermissionList', dataObj).then(r => {
      if (r.data.status === 10000) {
        parentIdObject['0'] = '根目录';
        for (let Obj of r.data.data) parentIdObject[`${Obj.menuId}`] = Obj.name;
        this.setState({
          tableDataList: r.data.data,
          pageTotal: r.data.data.total
        });
      }
      r.showError(message);
      this.setState({tableIsLoading: false});
    }).catch(r => {
      console.error(r);
      this.setState({tableIsLoading: false});
      this.ajax.isReturnLogin(r,this);
    })
  }

  // 换页刷新
  changePage(pageNum, pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },()=>{
      this.getPermissionList();
    })
  }

  render() {
    const { tableDataList, tableIsLoading, pageTotal, pageSize, pageNum, pageSizeOptions, detailState, showDetails, currentInfo, parentIdObject, } = this.state;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
    // menuId: 1
    // name: "用户管理"
    // order: 1
    // parentId: 0
    // requiredPermission: 2
    // type: 1
    const columns = [
      {title: '权限id', dataIndex: 'menuId', key: 'menuId', width: 80},
      {title: '权限名称', dataIndex: 'name', key: 'name', width: 140},
      {title: '权限类型', dataIndex: 'type', key: 'type', width: 140,
        render: text => <div>{text === 1 ? '菜单权限' : '功能权限'}</div>
      },
      {title: '是否必须', dataIndex: 'requiredPermission', key: 'requiredPermission', width: 140,
        render: (text, record) => {
          let main = '否';
          if (record.type === 1) {
            main = '菜单无此项数据';
          } else {
            if (text === 1) main = '是';
          }
          return <div style={record.type === 1 ? {color: '#ddd'} : null}>{main}</div>;
        }
      },
      {title: '父级权限', dataIndex: 'parentIdText', key: 'parentIdText', width: 120,
        render: (text, record) => <div>{parentIdObject[`${record.parentId}`]}</div>
      },
      {title: '父级权限id', dataIndex: 'parentId', key: 'parentId', width: 80},
      {title: '操作', dataIndex: '操作', key: '操作', width: 250, fixed: 'right',
        render: (text, record) =>
          <div>
            <Button type="primary"
                    disabled={true}
                    // onClick={this.showDetails.bind(this,'detail',record)}
            >查看</Button>
            <Button type="primary"
                    disabled={true}
                    style={{marginLeft: 10}}
                    // onClick={this.showDetails.bind(this,'edit',record)}
            >修改</Button>
            <Button type="danger"
                    disabled={true}
                    style={{marginLeft: 10}}
                    // onClick={this.deleteUser.bind(this,record.userId)}
            >删除</Button>
          </div>
      },
    ];
    return (
      <div className="permissions">
        <div className="title">权限管理</div>
        <div className="btnLine">
          <Button type="primary"
                  // onClick={this.showDetails.bind(this,'add')}
          >新增权限</Button>
        </div>
        <Modal className="details"
               wrapClassName="accountsDetailsModal"
               title={detailState === 'edit' ? '修改账户' : (detailState === 'add' ? '新增账户' : '账户详情')}
               visible={showDetails}
               bodyStyle={{padding: 18,maxHeight: '600px',overflow: 'auto'}}
               width={500}
               onCancel={() => this.setState({showDetails: false})}
               // onOk={this.submitForm.bind(this)}
               okText={detailState === 'edit' ? '修改' : (detailState === 'add' ? '新增' : '')}
               footer={detailState === 'detail' ? null : undefined}
               forceRender={true}
        >
          {/* 用户名称/邮箱/电话/公司/角色 */}
          <Form className=""
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
          >
            <FormItem label="账户名称" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('userName', {
                  rules: [{required: true, message: '请输入账户名称!'}],
                })( <Input placeholder="请输入账户名称" /> )
                : <div>{currentInfo.userName}</div>
              }
            </FormItem>
            <FormItem label="角色名称" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('roleId', {
                  rules: [{required: true, message: '请选择角色!'}]
                })( <Select placeholder="请选择角色" ><Option key="test">test</Option></Select> )
                : <div>{currentInfo.roleName}</div>
              }
            </FormItem>
            <FormItem label="密码" colon style={detailState === 'detail' ? {display: 'none'} : {}}>
              {getFieldDecorator('password', {
                rules: [{required: (detailState === 'add'), message: '请输入密码!'}]
              })( <Input placeholder={`${detailState === 'add' ? '请输入密码' : '如需修改, 请输入新密码'}`} /> )}
            </FormItem>
            <FormItem label="邮箱" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('email')( <Input placeholder="请输入邮箱" /> )
                : <div>{currentInfo.email}</div>
              }
            </FormItem>
            <FormItem label="电话" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('userPhone')( <Input placeholder="请输入电话" /> )
                : <div>{currentInfo.userPhone}</div>
              }
            </FormItem>
            <FormItem label="公司" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('company')( <Input placeholder="请输入公司名称" /> )
                : <div>{currentInfo.company}</div>
              }
            </FormItem>
          </Form>
        </Modal>

        <div className="TableMain">
          {/*表单主体*/}
          <Table className="tableList"
                 id="tableList"
                 dataSource={tableDataList}
                 columns={columns}
                 pagination={false}
                 loading={tableIsLoading}
                 bordered
                 scroll={{ y: 500, x: 950 }}
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

export default permissions;