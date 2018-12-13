import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';

class ForgotPassWord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="ForgotPassWord">
        <p>忘记密码, 请联系管理员</p>
        <p>电话: 13* **** ****</p>
        <p>邮箱: *****@*****.com</p>
        <Link className="backLogin"
              to="/login"
        >返回登录</Link>
      </div>
    )
  }

}

export default ForgotPassWord;