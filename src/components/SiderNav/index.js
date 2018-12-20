import React from 'react';
import CustomMenu from "../CustomMenu/index";
import menus from './menus';

import './index.less';

class SiderNav extends React.Component {
  render() {
    return (
      <div id="SiderNav">
        <CustomMenu menus={menus}/>
      </div>
    )
  }
}

export default SiderNav