import React, {Component} from 'react';
import PrivateRoute from './components/PrivateRoute';
import {Route,Switch} from 'react-router-dom';
import Login from './routes/Login/index';
import ForgotPassWord from './routes/ForgotPasswd/index';
// import Login from './routes/Login2/index';
import Index from './routes/Index/index';
import './App.less';


class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/forgotpassword" component={ForgotPassWord}></Route>
        <PrivateRoute path="/" component={Index}/>
      </Switch>
    )
  }
}

export default App;