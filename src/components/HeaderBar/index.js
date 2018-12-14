import React from 'react';

class HeaderBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(
      <div name="HeaderBar">
        <div className="logo">BuyersHouse后台管理系统</div>
      </div>
    )}
}

export default HeaderBar;