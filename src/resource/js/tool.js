// 这里的工具方法挂在在顶层对象window中

// 获取search参数方法
window.getQueryString = function (name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  if (!(window.location.search.split('?')[1])) return null;
  let r = window.location.search.split('?')[1].match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

// 获取全部search参数
window.getAllQueryString = () => {
  if (!(window.location.search.split('?')[1])) return {};
  let dataObj = {};
  let searchList = window.location.search.split('?')[1].split('&');
  for (let i = 0; i < searchList.length; i++) {
    dataObj[searchList[i].split('=')[0]] = decodeURIComponent(searchList[i].split('=')[1])
  }
  return dataObj;
};

// 设置一个cookie
// 参数依次为参数名,参数值,参数有效时间(单位:秒/不需填写单位/建议填写Number类型)
window.setCookie = function(name,value,time) {
  if (!name) return console.error('请输入正确参数名');
  if (!value) return console.error('请输入正确参数值');
  if (!time) return console.error('请输入正确参数有效时间');
  let exp = new Date();
  exp.setTime(exp.getTime() + time*1000);
  // 这里强制定义path属性, 因为cookie有path属性, 当处于不同path时无法操作, 所以定义所有cookie的path为根目录
  document.cookie = name + "="+ value + ";expires=" + exp.toGMTString() + ";path=/";
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
window.getAllCookie = () => {
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
  if(cval!=null) document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString() + ";path=/";
  return `删除 ${name} 成功`
};

//删除所有cookie
window.delAllCookie = () => {
  let strCookie = document.cookie;
  let arr = strCookie.split('; ');
  for (let i of arr) {
    window.delCookie(i.split('=')[0])
  }
  return `删除所有 cookie 成功`
};

// 获取数据方法类型
window.getDataType = (data) => {
  return Object.prototype.toString.call(data)
};