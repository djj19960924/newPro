import React from 'react'
import { Route, Redirect, } from 'react-router-dom'

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    // 这里通过读取缓存来判断, 是否显示剩余组件, 这里应当插入读取cookie判断权限操作
    // 如果cookie中没有登录信息, 如session等, 则不显示组件, 强制返回登录页面
    // !!false // 如果未登录, 这里如果为false强制进入登录(!null返回为true,!!null则返回为false,!!用于强制返回布尔值)
    (window.getCookie('isLogin') === 'true')
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        // state: {from: props.location}
      }}/>
  )}/>
)

export default PrivateRoute