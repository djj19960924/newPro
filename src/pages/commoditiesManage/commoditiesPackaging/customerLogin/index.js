import React from 'react';

import './index.less';
class customerLogin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
    window.onkeydown = (e) => {
      // console.log(e)
      console.log(new Date().getTime())
    };
    window.onkeyup = (e) => {
      // console.log(e)
    };
  }

  componentDidMount() {
    window.onblur = () => {
      console.log(`失去焦点!`)
    };
    window.onfocus = () => {
      console.log(`获得焦点!`)
    }
  }

  render() {
    return (
      <div className="customerLogin ">
        客户登陆
      </div>
    )
  }
}

export default customerLogin;