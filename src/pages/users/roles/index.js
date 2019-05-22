import React from 'react';
import { Button, Table, message, Pagination, Modal, Input, } from 'antd';
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
      pageSizeOptions: [`50`,`100`,`200`,`300`],
      // 详情弹框
      showDetails: false,
      detailsList: [],
      // 所有权限列表
      allPermissionsList: [],
      // 权限列表(源)
      menuIdListOrigin: [],
      // 权限列表(新)
      newMenuIdList: [],
      // 弹框是否可编辑
      detailState: 'detail',
      // 当前行
      currentRecord: {},
      // 新增角色名称
      newRoleName: ''
    };
  }

  componentDidMount() {
    // 权限列表获取接口内部, 异步嵌套获取权限列表接口
    this.getPermissionList();
  }

  // 获取所有权限列表
  getPermissionList() {
    this.setState({tableIsLoading: true});
    this.ajax.post('/permission/getPermissionList').then(r => {
      if (r.data.status === 10000) {
        this.setState({allPermissionsList: r.data.data});
        this.getRoleList();
      }
      r.showError();
    }).catch(r => {
      console.error(r);
      this.ajax.isReturnLogin(r,this);
    })
  }

  // 获取角色列表
  getRoleList() {
    const { pageNum, pageSize, } = this.state;
    this.setState({tableIsLoading: true});
    let dataObj = {pageNum:pageNum,pageSize:pageSize};
    this.ajax.post('/role/getRoleList', dataObj).then(r => {
      if (r.data.status === 10000) {
        this.setState({
          tableDataList: r.data.data.list,
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
      this.getRoleList();
    })
  }

  // 改造数据源方法
  rebuildData(permissions, permissionsRecord) {
    if (!permissionsRecord) permissionsRecord = permissions;
    // 改造数据源
    let permissionsList = [];
    let menuIdListOrigin = [];
    for (let obj of permissions) {
      let menuNameList = obj.menuName.split(':');
      let dataObj = { perms: obj.perms, menuId: obj.menuId, menuNameList: menuNameList };
      for (let num in menuNameList) dataObj[`m${num}`] = menuNameList[num];
      permissionsList.push(dataObj);
    }
    for (let obj of permissionsRecord) menuIdListOrigin.push(obj.menuId);
    // console.log(permissionsList);
    let List = [];
    // 自循环方法, 替代原本固定3级循环
    for (let pLObj of permissionsList) {
      let parent = List;
      for (let i = 0; i < pLObj.menuNameList.length; i++) {
        let thisNum = null;
        for (let pLNum in parent) {
          if (parent[pLNum].name === pLObj[`m${i}`]) thisNum = pLNum;
        }
        if (thisNum === null) {
          parent.push({name: pLObj[`m${i}`]});
          thisNum = parent.length - 1;
        }
        if (i === (pLObj.menuNameList.length - 1)) {
          if (!parent[thisNum].permsList) parent[thisNum].permsList = [];
          parent[thisNum].permsList.push({perms: pLObj.perms, menuId: pLObj.menuId})
        } else {
          if (!parent[thisNum].list) parent[thisNum].list = [];
          parent = parent[thisNum].list;
        }
      }
    }
    // console.log(List);
    this.setState({
      showDetails: true,
      detailsList: List,
      menuIdListOrigin: menuIdListOrigin,
      newMenuIdList: [...menuIdListOrigin]
    })
  }

  // 展示详情
  showDetailsModal(record) {
    // 创建测试数据
    // record.permissions = [
    //   {menuName: '菜单测试1', perms: '操作测试1', menuId: 1},
    //   {menuName: '菜单测试1', perms: '操作测试2', menuId: 2},
    //   {menuName: '菜单测试2:菜单测试201', perms: '操作测试1', menuId: 3},
    //   {menuName: '菜单测试2:菜单测试201', perms: '操作测试2', menuId: 4},
    //   {menuName: '菜单测试2:菜单测试202:菜单测试20201', perms: '操作测试1', menuId: 5},
    //   {menuName: '菜单测试2:菜单测试202:菜单测试20201', perms: '操作测试2', menuId: 6},
    //   {menuName: '菜单测试2:菜单测试202:菜单测试20202', perms: '操作测试1', menuId: 7},
    //   {menuName: '菜单测试2:菜单测试202:菜单测试20202', perms: '操作测试2', menuId: 8},
    //   {menuName: '菜单测试2:菜单测试202:菜单测试20202', perms: '操作测试3', menuId: 9},
    //   {menuName: '菜单测试2:菜单测试202:菜单测试20202', perms: '操作测试4', menuId: 45},
    //   {menuName: '菜单测试3:菜单测试201', perms: '操作测试1', menuId: 453},
    //   {menuName: '菜单测试3:菜单测试201', perms: '操作测试2', menuId: 23},
    //   {menuName: '菜单测试3:菜单测试202:菜单测试20201', perms: '操作测试1', menuId: 15},
    //   {menuName: '菜单测试3:菜单测试202:菜单测试20201', perms: '操作测试2', menuId: 346},
    //   {menuName: '菜单测试3:菜单测试202:菜单测试20202', perms: '操作测试1', menuId: 76},
    //   {menuName: '菜单测试4:菜单测试202:菜单测试20202', perms: '操作测试2', menuId: 96},
    //   {menuName: '菜单测试4:菜单测试201', perms: '操作测试1', menuId: 36},
    //   {menuName: '菜单测试4:菜单测试201', perms: '操作测试2', menuId: 90},
    //   {menuName: '菜单测试4:菜单测试202:菜单测试20201', perms: '操作测试1', menuId: 86},
    //   {menuName: '菜单测试4:菜单测试202:菜单测试20201', perms: '操作测试2', menuId: 58},
    //   {menuName: '菜单测试4:菜单测试202:菜单测试20202', perms: '操作测试1', menuId: 59},
    //   {menuName: '菜单测试4:菜单测试202:菜单测试20202', perms: '操作测试2', menuId: 79},
    //   {menuName: '菜单测试5:菜单测试202:菜单测试20202', perms: '操作测试2', menuId: 69},
    //   {menuName: '菜单测试5:菜单测试201', perms: '操作测试1', menuId: 99},
    //   {menuName: '菜单测试5:菜单测试201', perms: '操作测试2', menuId: 49},
    //   {menuName: '菜单测试5:菜单测试202:菜单测试20201', perms: '操作测试1', menuId: 39},
    //   {menuName: '菜单测试5:菜单测试202:菜单测试20201', perms: '操作测试2', menuId: 29},
    //   {menuName: '菜单测试5:菜单测试202:菜单测试20202', perms: '操作测试1', menuId: 19},
    //   {menuName: '菜单测试5:菜单测试202:菜单测试20202', perms: '操作测试2', menuId: 60},
    // ];
    this.rebuildData(record.permissions);
    this.setState({detailState: 'detail', currentRecord: record});
  }

  // 展示详情-修改
  showDetailsModalForEdit(record) {
    const { allPermissionsList } = this.state;
    this.rebuildData(allPermissionsList, record.permissions);
    this.setState({detailState: 'edit', currentRecord: record});
  }

  // 展示详情-新增
  showDetailsModalForAdd() {
    const { allPermissionsList } = this.state;
    this.rebuildData(allPermissionsList, []);
    this.setState({detailState: 'add'});
  }

  // 渲染 table 内部权限标签
  renderPermissions(text, record) {
    if (record.roleId === 1) {
      // 超级管理员显示全部
      return (
        <div className="tabsList">
          <span className="tabs allPer">全部</span>
        </div>
      )
    } else {
      // 其他角色显示相关菜单
      const dataList = [];
      // 循环处理, 菜单内部只显示最上级菜单页面
      for (let v of record.permissions)
        if (!dataList.includes(v.menuName.split(':')[0])) dataList.push(v.menuName.split(':')[0]);
      return (
        <div className="tabsList">
          {dataList.map((item,index) =>
            <div className="tabs" key={index}>{item}</div>)}
        </div>
      )
    }
  }

  // 点击选择/取消选择某一权限
  changeOwn(menuId) {
    const { newMenuIdList } = this.state;
    let i = newMenuIdList.indexOf(menuId);
    if (i === -1) {
      newMenuIdList.push(menuId)
    } else {
      newMenuIdList.splice(i,1)
    }
    // 渲染
    this.setState({});
  }

  // 修改角色
  updateRole() {
    const { newMenuIdList, menuIdListOrigin, currentRecord } = this.state;
    let addList = [], delList = [];
    for (let v1 of newMenuIdList) if (!menuIdListOrigin.includes(v1)) addList.push(v1);
    for (let v2 of menuIdListOrigin) if (!newMenuIdList.includes(v2)) delList.push(v2);
    if (addList.length === 0 && delList.length === 0) {
      message.warn('权限未改变')
    } else {
      let dataObj = {
        roleId: currentRecord.roleId,
        roleName: currentRecord.roleName,
        newMenuIdList: addList,
        oldMenuIdList: delList
      };
      this.ajax.post('/role/updateRole', dataObj).then(r => {
        // console.log(r);
        if (r.data.status === 10000) {
          message.success(`${r.data.msg}`);
          this.setState({showDetails: false});
          this.getRoleList();
        }
        r.showError(message);
      }).catch(r => {
        console.error(r);
        this.ajax.isReturnLogin(r,this);
      })
    }
  }

  // 新增角色
  addRole() {
    const { newMenuIdList, newRoleName } = this.state;
    let dataObj = {
      roleName: newRoleName,
      newMenuIdList: newMenuIdList
    };
    this.ajax.post('/role/addRole',dataObj).then(r => {
      // console.log(r);
      if (r.data.status === 10000) {
        message.success(`${r.data.msg}`);
        this.setState({showDetails: false, newRoleName: ''});
        this.getRoleList();
      }
      r.showError(message);
    }).catch(r => {
      console.error(r);
      this.ajax.isReturnLogin(r,this);
    })
  }

  // 删除角色
  deleteRole(roleId) {
    Modal.confirm({
      title: '删除角色',
      content: '确认删除该角色',
      okText: '删除',
      okType: 'danger',
      maskClosable: true,
      onOk: () => {
        this.ajax.post('/role/deleteRole', {roleId: roleId}).then(r => {
          if (r.data.status === 10000) {
            message.success(`${r.data.msg}`);
            this.getRoleList();
          }
          r.showError(message);
        }).catch(r => {
          console.error(r);
          this.ajax.isReturnLogin(r, this);
        })
      }
    })
  }

  render() {
    const { tableDataList, tableIsLoading, pageTotal, pageSize, pageNum, pageSizeOptions, showDetails, detailsList, detailState, newMenuIdList, newRoleName, } = this.state;
    const columns = [
      {title: 'ID', dataIndex: 'roleId', key: 'roleId', width: 80},
      {title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 140},
      {title: '权限', dataIndex: 'permissions', key: 'permissions',
        render: (text, record) => this.renderPermissions(text, record)
      },
      {title: '操作', dataIndex: '操作', key: '操作', width: 250, fixed: 'right',
        render: (text, record) => {
          if (record.roleId === 1) {
            return <div style={{color:'rgba(255,0,0,.6)'}}>超级管理员不可进行操作</div>
          } else {
            return <div>
              <Button type="primary"
                      onClick={this.showDetailsModal.bind(this, record)}
              >查看</Button>
              <Button type="primary"
                      style={{marginLeft: 10}}
                      onClick={this.showDetailsModalForEdit.bind(this, record)}
              >修改</Button>
              <Button type="danger"
                      style={{marginLeft: 10}}
                      onClick={this.deleteRole.bind(this, record.roleId)}
              >删除</Button>
            </div>
          }
        }
      },
    ];
    return (
      <div className="roles">
        <div className="title">角色管理</div>
        <div className="btnLine">
          <Button type="primary"
                  onClick={this.showDetailsModalForAdd.bind(this)}
          >新增角色</Button>
        </div>
        <Modal className="details"
               wrapClassName="rolesDetailsModal"
               title={detailState === 'edit' ? '修改角色' : (detailState === 'add' ? '新增角色' : '角色详情')}
               visible={showDetails}
               bodyStyle={{padding: 18,maxHeight: '600px',overflow: 'auto'}}
               width={680}
               onCancel={() => this.setState({showDetails: false})}
               onOk={() => {
                 if (detailState === 'edit') this.updateRole();
                 if (detailState === 'add') this.addRole();
               }}
               okText={detailState === 'edit' ? '修改' : (detailState === 'add' ? '新增' : '')}
               footer={detailState === 'detail' ? null : undefined}
        >
          {detailState === 'add' &&
            <div className="addRole">
              <div className="addRoleTitle">新增角色名:</div>
              <Input className="addRoleInput"
                     value={newRoleName}
                     onChange={e => {this.setState({newRoleName: e.target.value})}}
              />
            </div>
          }
          <div className="detailsMain">
            {/*渲染三级菜单*/}
            {detailsList.map((item,index) => (
              <div key={index}
                   className="menu_1"
                   style={index === detailsList.length - 1 ? {} : {borderBottom:'1px #ddd solid'}}
              >
                <div className="menu_name">{item.name}</div>
                <div className="menu_body">
                  {item.permsList
                    // 渲染权限列表
                    ? item.permsList.map((item,index) => (
                      <div className={`menu_perms ${newMenuIdList.includes(item.menuId) ? 'own_perms' : 'not_own'} ${detailState !== 'detail' ? 'can_edit' : ''}`}
                           key={item.menuId}
                           onClick={detailState !== 'detail' ?
                             this.changeOwn.bind(this,item.menuId) : null}
                      >{item.perms}</div>
                    ))
                    // 渲染菜单列表
                    : item.list.map((item1,index) => (
                      <div className="menu_2"
                           key={index}
                           style={index === item.list.length - 1 ? {} : {borderBottom:'1px #ddd solid'}}
                      >
                        <div className="menu_name">{item1.name}</div>
                        <div className="menu_body">
                          {item1.permsList
                            // 渲染权限列表
                            ? item1.permsList.map((item2,index) => (
                              <div className={`menu_perms ${newMenuIdList.includes(item2.menuId) ? 'own_perms' : 'not_own'} ${detailState !== 'detail' ? 'can_edit' : ''}`}
                                   key={item2.menuId}
                                   onClick={detailState !== 'detail' ?
                                     this.changeOwn.bind(this,item2.menuId) : null}
                              >{item2.perms}</div>
                            ))
                            // 渲染菜单列表
                            : item1.list.map((item2,index) => (
                              <div className="menu_3"
                                   key={index}
                                   style={index === item1.list.length - 1 ? {} : {borderBottom:'1px #ddd solid'}}
                              >
                                <div className="menu_name">{item2.name}</div>
                                <div className="menu_body">
                                  {/* 渲染权限列表*/}
                                  {item2.permsList.map((item3,index) => (
                                    <div className={`menu_perms ${newMenuIdList.includes(item3.menuId) ? 'own_perms' : 'not_own'} ${detailState !== 'detail' ? 'can_edit' : ''}`}
                                         key={item3.menuId}
                                         onClick={detailState !== 'detail' ?
                                           this.changeOwn.bind(this,item3.menuId) : null}
                                    >{item3.perms}</div>
                                  ))}
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
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