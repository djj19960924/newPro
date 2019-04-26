import React from 'react';
import {Layout} from 'antd';
import SiderNav from '../../components/SiderNav';
import ContentMain from '../../components/ContentMain';
import HeaderBar from '../../components/HeaderBar';

import './index.less';

const {Sider, Header, Content, Footer} = Layout;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }
  // toggle = () => {
  //   // console.log(this)  状态提升后，到底是谁调用的它
  //   this.setState({
  //     collapsed: !this.state.collapsed
  //   })
  // }
  render(){
    return(
      <div name="Index" id='indexPage'>
        <Layout>
          <Sider // 是否可收起
            collapsible
            // 当前是否为收起状态
            collapsed={this.state.collapsed}
            // 默认转换收缩按钮
            trigger={null}
            // 定义侧边栏宽度
            width={200}
            style={{position: 'fixed', left: 0, top: 64, bottom: 0}}>
            <SiderNav />
          </Sider>
          <Layout>
            <Header style={{position: 'fixed', left: 0, right: 0, height: 64, }}
            >
              <HeaderBar />
            </Header>
            <Content style={{position: 'fixed', left: 200, top: 64, bottom: 0, right: 0, width:'calc(100% - 200px)'}}>
              <ContentMain />
            </Content>
            <Footer></Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
};

export default Index;