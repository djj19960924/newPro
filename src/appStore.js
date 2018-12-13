import {observable} from 'mobx'

class AppStore {
  // 利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  @observable isLogin = (window.getCookie('isLogin') === 'true');
  // 模拟用户数据库
  @observable users = [];
  @observable loginUser = {};  //当前登录用户信息

  // @action toggleLogin(flag,info={}) {
  //   this.loginUser = info  //设置登录用户信息
  //   if (flag) {
  //     authenticateSuccess(info.username)
  //     this.isLogin = true
  //   } else {
  //     logout()
  //     this.isLogin = false
  //   }
  //
  // }
  // @action initUsers() {
  //   const localUsers = localStorage['users']?JSON.parse(localStorage['users']):[]
  //   this.users = [{username: 'admin', password: 'admin'},...localUsers]
  // }
}

export default new AppStore()