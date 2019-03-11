// 这里的工具方法挂在在顶层对象window中

// 获取hash内部参数方法
window.getQueryString = function (name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  // 这里修正了地址, 从hash中截取参数, 因为该react项目中使用HashRouter进行路由导航, 参数会拼接在hash中
  if (!(window.location.search.split('?')[1])) return null;
  let r = window.location.search.split('?')[1].match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

// 设置一个cookie
// 参数依次为参数名,参数值,参数有效时间(单位:秒/不需填写单位/建议填写Number类型)
window.setCookie = function(name,value,time) {
  if (!name) return console.error('请输入正确参数名');
  if (!value) return console.error('请输入正确参数值');
  if (!time) return console.error('请输入正确参数有效时间');
  let exp = new Date();
  exp.setTime(exp.getTime() + time*1000);
  document.cookie = name + "="+ value + ";expires=" + exp.toGMTString();
  return `赋值成功 - ${name}:${value}`
};

//获取一个cookie
window.getCookie = function(name) {
  if (!name) return console.error('请输入正确参数名');
  let strCookie = document.cookie;
  let arr = strCookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    let t = arr[i].split("=");
    if(t[0] === name) {
      return t[1];
    }
  }
  return null;
};

// 获取所有cookie
window.getCookies = () => {
  let strCookie = document.cookie;
  let arr = strCookie.split('; ');
  let obj = {};
  for (let i of arr) {
    obj[i.split('=')[0]]=i.split('=')[1]
  }
  return obj;
};

//删除一个cookie
window.delCookie = function(name) {
  if (!name) return console.error('请输入正确参数名');
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval=window.getCookie(name);
  if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toUTCString();
};

//删除所有cookie
window.delCookies = () => {
  let strCookie = document.cookie;
  let arr = strCookie.split('; ');
  for (let i of arr) {
    window.delCookie(i.split('=')[0])
  }
};