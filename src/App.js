import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './routes/Login/index';
import ForgotPassWord from './routes/ForgotPasswd/index';
import Index from './routes/Index/index';
import Ajax from '@components/getApi/ajax/';
import './App.less';

// import { observer, inject, } from 'mobx-react';
// @inject('appStore') @observer
class App extends Component {
  constructor(props) {
    super(props);
    // 这里注入原生 ajax 方法至 React.Component
    Component.prototype.ajax = new Ajax();
    window.app = this;
  }
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/forgot-password" component={ForgotPassWord} />
        {/*<PrivateRoute path="/" component={Index}/>*/}
        <Route path="/" render={(props) => (
          window.getCookie('isLogin') === 'true'
            // this.props.appStore.isLogin
            ? <Index/>
            : <Redirect to={{
              pathname: `/login`,
              search: `?historyPath=${props.location.pathname}${encodeURIComponent(props.location.search)}`,
              state: {from: props.location}
            }}/>
        )}/>
      </Switch>
    )
  }
}

export default App;