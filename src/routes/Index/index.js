import React from 'react';
import {Layout} from 'antd';
import SiderNav from '@components/SiderNav/';
import HeaderBar from '@components/HeaderBar/';
import GetAppStore from '@components/GetAppStore/';
import ContentMain from "@components/ContentMain/";

import './index.less';

const {Sider, Header, Content, Footer} = Layout;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      allowSideList: [],
      roleId: null,
    };
  }
  setInfo(list,roleId) {
    this.setState({
      allowSideList: list,
      roleId: roleId
    })
  }
  render(){
    const { allowSideList, roleId } = this.state;
    return(
      <div name="Index" id='indexPage'>
        <Layout>
          <Sider style={{position: 'fixed', left: 0, top: 64, bottom: 0}}
            // 是否可收起
            collapsible
            // 当前是否为收起状态
            collapsed={this.state.collapsed}
            // 默认转换收缩按钮
            trigger={null}
            // 定义侧边栏宽度
            width={200}
          >
            <SiderNav />
          </Sider>
          <Layout>
            <Header style={{position: 'fixed', left: 0, right: 0, height: 64, }} >
              <HeaderBar />
            </Header>
            <Content style={{position: 'fixed', left: 200, top: 64, bottom: 0, right: 0, width:'calc(100% - 200px)'}} >
              <GetAppStore setInfo={this.setInfo.bind(this)} />
              <ContentMain allowSideList={allowSideList} roleId={roleId}/>
            </Content>
            {/*预留页脚*/}
            <Footer />
          </Layout>
        </Layout>
      </div>
    )
  }
};

export default Index;