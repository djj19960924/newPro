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
    // let dataObj = {pageNum:pageNum,pageSize:pageSize};
    this.ajax.post('/permission/getPermissionList').then(r => {
      if (r.data.status === 10000) {
        
        parentIdObject['0'] = '根目录';
        // console.log('11:',r.data.data)
        for (let Obj of r.data.data) parentIdObject[`${Obj.menuId}`] = Obj.name;
        this.setState({
          tableDataList: r.data.data,
          // pageTotal: r.data.data.total
          parentIdObject
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

  //展示详情
  showDetails(type, record) {
    const data = {
      detailState: type,
      currentInfo: record,
      showDetails: true,
    }
    if(type == "edit"){
      
    }
    this.setState(data);
    //this.props.history.push(`/users/permissions/permissionsEdit`)
    //修改权限
    // if(type == "edit"){
    //   let data = {
    //     menuId: record.menuId,
    //     name: record.name,
    //     url: record.url,
    //     requiredPermission:record.requiredPermission,
    //     paremtId:record.paremtId
    //   }
    //   this.ajax.post('/permission/updatePermission',data).then(r => {
    //     console.log('r:',r)
    //   })
    // }
    
  }
  handleOk(e){
    console.log(e);
    
    this.setState({
      showDetails: false,
    });
  }
  handleCancel(e){
    console.log(e);
    this.setState({
      showDetails: false,
    });
  }

  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => null
  }
  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
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
                    // disabled={true}
                    onClick={this.showDetails.bind(this,'detail',record)}
            >查看</Button>
            <Button type="primary"
                    // disabled={true}
                    style={{marginLeft: 10}}
                    onClick={this.showDetails.bind(this,'edit',record)}
            >修改</Button>
            <Button type="danger"
                    disabled={true}
                    style={{marginLeft: 10}}
                    // onClick={this.deleteUser.bind(this,record.userId)}
            >删除</Button>
          </div>
      },
    ];
    const { tableDataList, tableIsLoading, pageTotal, pageSize, pageNum, pageSizeOptions, detailState, showDetails, currentInfo, parentIdObject } = this.state;
    return (
      <div className="permissions">
        <div className="title">
          <div className="titleMain">权限管理</div>
          <div className="titleLine" />
        </div>
        <div className="btnLine">
          <Button type="primary"
                  // onClick={this.showDetails.bind(this,'add')}
          >新增权限</Button>
        </div>
        <Modal className="details"
               wrapClassName="accountsDetailsModal"
               title={detailState === 'detail' ? '查看权限' : '修改权限'}
               visible={showDetails}
               bodyStyle={{padding: 18,maxHeight: '600px',overflow: 'auto'}}
               width={500}
               onCancel={this.handleCancel.bind(this)}
               onOk={this.handleOk.bind(this)}
              //  okText={detailState === 'edit' ? '修改' : (detailState === 'add' ? '新增' : '')}
              //  footer={detailState === 'detail' ? null : undefined}
               forceRender={true}

        >
          {/* 用户名称/邮箱/电话/公司/角色 */}
          <Form className=""
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
          >
            <FormItem label="权限名称" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入账户名称!'}],
                })( <Input placeholder="请输入账户名称" /> )
                : <div>{currentInfo.name}</div>
              }
            </FormItem>
            <FormItem label="权限类型" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('type', {
                  rules: [{required: true, message: '请选择角色!'}]
                })( <Select placeholder="请选择角色" >
                      <Option key="1">菜单权限</Option>
                      <Option key="2">功能权限</Option>
                    </Select> 
                  ):<div>{currentInfo.roleName}</div>
              }
            </FormItem>
            {
              !currentInfo?'':(currentInfo.type==1?'':(
                <FormItem label="是否必须" colon style={detailState === 'detail' ? {display: 'none'} : {}}>
                  {getFieldDecorator('requiredPermission', {
                    rules: [{message: '是否必须'}]
                  })( <Select placeholder="是否必须">
                        <Option key="1">是</Option>
                        <Option key="2">否</Option>
                      </Select> )}
                </FormItem>
              ))
            }
            <FormItem label="父级权限" colon >
              {detailState !== 'detail' ?
                getFieldDecorator('parentId', {
                  rules: [{required: true, message: '请选择父级权限!'}]
                })( <Select>
                      {tableDataList.map((item)=><Option key={item.menuId}>{item.name}</Option>)}
                    </Select> ):<div>{parentIdObject[currentInfo.parentId]}</div>}
            </FormItem>
            {
              // <FormItem label="父级权限" colon style={detailState === 'detail' ? {display: 'none'} : {}}>
              //   {getFieldDecorator('password', {
              //     rules: [{required: (detailState === 'add'), message: '请输入密码!'}]
              //   })( <Input placeholder={`${detailState === 'add' ? '请输入密码' : '如需修改, 请输入新密码'}`} /> )}
              // </FormItem>
            }
            
          </Form>
        </Modal>

        <div className="tableMain">
          {/*表单主体*/}
          <Table className="tableList"
                 id="tableList"
                 dataSource={tableDataList}
                 columns={columns}
                 // pagination={false}
                 pagination={{
                   pageSize: pageSize,
                   showTotal: (total, range) =>
                     `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`,
                   showSizeChanger: true,
                   pageSizeOptions: pageSizeOptions,
                 }}
                 loading={tableIsLoading}
                 bordered
                 scroll={{ y: 500, x: 950 }}
                 rowKey={(record, index) => `id_${index}`}
          />
          {/*分页*/}
          {/*<Pagination className="tablePagination"*/}
                      {/*total={pageTotal}*/}
                      {/*pageSize={pageSize}*/}
                      {/*current={pageNum}*/}
                      {/*showTotal={(total, range) =>*/}
                        {/*`${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`*/}
                      {/*}*/}
                      {/*onChange={this.changePage.bind(this)}*/}
                      {/*showSizeChanger*/}
                      {/*pageSizeOptions={pageSizeOptions}*/}
                      {/*onShowSizeChange={this.changePage.bind(this)}*/}
          {/*/>*/}
        </div>
      </div>
    )
  }
}

export default permissions;