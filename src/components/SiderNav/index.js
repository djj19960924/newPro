import React from 'react';
import CustomMenu from "../CustomMenu/index";
import menus from './menus';

class SiderNav extends React.Component {
  render() {
    return (
      <div style={{height: '100vh',overflowY:'auto',overflowX:'hidden',}}>
        <CustomMenu menus={menus}/>
      </div>
    )
  }
}

export default SiderNav