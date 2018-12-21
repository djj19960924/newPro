import React from 'react';
import CustomMenu from "../CustomMenu/index";
import menus from './menus';
import menusTest from './menusTest'

import './index.less';

class SiderNav extends React.Component {
  render() {
    return (
      <div id="SiderNav">
        <CustomMenu menus={window.isTest ? menusTest : menus}/>
      </div>
    )
  }
}

export default SiderNav