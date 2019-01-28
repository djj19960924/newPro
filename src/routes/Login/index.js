import React from 'react';
import md5 from '@js/md5';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index'
import { Form, Icon, Input, Button, Checkbox, message, } from 'antd';
import './index.less';

const FormItem = Form.Item;

@inject('appStore') @observer @Form.create()
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // window.Login = this;
    // 可以将该组件挂载至window下, 则全局都可获取到当前组件
    // 某些失去当前对象的情况下, 可以使用该方法
    // window.Login = this;
  };
  // 提交表单
  handleSubmit = (e) => {
    // 当运行当前事件时, 去除其他相关操作绑定s
    e.preventDefault();
    // 这里进行表单验证
    this.props.form.validateFields((err, values) => {
      // 这里使用getFieldsValue()获取form表单内所有数据
      // 或者使用getFieldValue('参数值')
      // console.log(
      //   this.props.form.getFieldsValue()
      // );
      if (!err) {
        // 密码需要传输md5加密后的数据
        console.log(md5(this.props.form.getFieldValue('password')));
        // this.addCookie();
        // 判断是否需要前端方法保存当前登录账号, 如需要, 则将账号信息保存进cookie
        if (this.props.form.getFieldValue('remember')) {
          // 设置默认账号名保存7天
          window.setCookie('saveUserName',this.props.form.getFieldValue('userName'), 3600 * 24 * 7)
        } else {
          window.delCookie('saveUserName')
        }
        // 这里直接将form表单提交, 正式环境请将所需字段单独提取后再传输
        // let DataList = this.props.form.getFieldsValue();
        let DataList = 'account=' + this.props.form.getFieldValue('userName')
          + '&password=' + this.props.form.getFieldValue('password');
        // 暂时收起md5加密功能, 待后台完全发布
        // DataList.password = md5(this.props.form.getFieldValue('password'));
        fetch(
          'http://api.maishoumiji.com/loginVerify',
          {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: DataList,
            // 默认为omit,忽略的意思，也就是不带cookie; 还有两个参数:
            // same-origin，意思就是同源请求带cookie；
            // include,表示无论跨域还是同源请求都会带cookie
            // credentials: 'include',
          }).then(r => r.json()).then(r => {
            // console.log(r)
            if (r.success === true) {
              message.success(r.message);
              // 这里需要将收到的数据, 主要是session字段等保存至cookie, 用于验证是否可以进入根目录
              this.addCookie();
              // 登陆以后进入的页面
              // this.props.history.push('/');
              this.props.history.push('/logistics-manage/appointment-info');
            } else {
              message.error(r.message);
            }
          }).catch(r => {
            // console.log('error')
            // 接口调取失败时提示
            message.error('请求失败!');
          })
      }
    });
  };
  addCookie() {
    // 这里模拟登陆成功, 将身份信息注册至cookie中, 时限30分钟
    window.setCookie('isLogin','true',1800);
    // console.log('isLogin: ' + window.getCookie('isLogin'));
  };
  render() {
    // 将表单数据保存至this.props.form, 由form组件托管当前数据
    const { getFieldDecorator } = this.props.form;
    return(
      <div name="Login" className="Login" style={{textAlign:'center'}}>
        {/*表单容器*/}
        <div className="loginContainer">
          <Form onSubmit={this.handleSubmit.bind(this)} className="loginForm">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
                initialValue: window.getCookie('saveUserName') ? window.getCookie('saveUserName') : '',
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
              )}
            </FormItem>
            <FormItem>
              {/*设置是否记住该账号*/}
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox className="remember">保存当前用户名</Checkbox>
              )}
              <Link className="loginFormForgot"
                    to="/forgotpassword"
              >忘记密码？请点击</Link>
              <Button type="primary" htmlType="submit" className="loginFormButton" style={{width: '100%', marginTop: '10px'}}>
                登录
              </Button>
              {/*后台管理系统暂不支持开放注册*/}
              {/*Or <a href="">register now!</a>*/}
            </FormItem>
          </Form>
          <p className="info">欢迎登陆后台管理系统</p>
        </div>
      </div>
    )
  }
}

// 这里注入表单验证, 如无需表单验证或自定义验证内容和时机还有规则, 则不需要添加Form.create(), 具体详见antd文档
// Login = Form.create()(Login);

export default Login;