//
// ┏━━━━━━━━━━ 方法信息 ━━━━━━━━━━┓
// ┃由于权限接口所需 这里必须使用原生ajax方法        ┃
// ┃出于使用需求 这里将改造原生ajax方法             ┃
// ┃以下代码将被注入至 React.Component.prototype   ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
//
class Ajax {
  name = 'Ajax';
  version = 'V0.1 - test';
  info = '这是基于原生ajax功能所扩展的ajax工具, 可以更加快捷方便的调用ajax, 并且可以根据环境灵活改变内部配置.';
  headers = {};
  // origin = window.fandianUrl;
  // origin = '//192.168.31.60:8088';
  origin = '//47.98.221.129:8088/quanhai';

  post(path,data,headers) {
    let request = new XMLHttpRequest();
    // 开启 request 对象, 指定 post 方法, 输入 url
    request.open('POST', `${this.origin}${path}`, true);
    // 默认允许跨域传递 cookie, 以便进行权限验证
    request.withCredentials = true;
    // 默认处理返回数据格式为 json 格式
    request.responseType = 'json';
    // 设置头
    if (!headers) headers = this.headers;
    for (let n in headers) request.setRequestHeader(n,headers[n],);
    // 强制设置 Content-Type, 无视 headers 内部
    request.setRequestHeader('Content-Type','application/json');
    return new Promise((resolve, reject) => {
      // 当接口调取状态变更时触发
      request.onreadystatechange = () => {
        // 处理返回状态, 以便使用 then 和 catch 方法
        // readyState 为 4 时, 为接口调取行为结束
        if(request.readyState === 4){
          // status 为 200 时, 判断为正常接通接口
          if(request.status === 200){
            // 进入 then 方法, 并将 resolve 发送至 then
            resolve(new resolveResponse(request.response));
          } else {
            // 进入 catch 方法, 并将 reject 发送至 catch
            reject(request);
            // 默认进行报错提示
            console.error('接口调取失败');
            console.error(request);
          }
        }
      };
      request.onerror = () => {
        console.log(request)
      };
      // 开始发送请求
      request.send(JSON.stringify(data));
    })
  }

  get(path,string,headers) {
    let request = new XMLHttpRequest();
    // 开启 request 对象, 指定 get 方法, 输入 url
    request.open('GET', `${this.origin}${path}?${string}`, true);
    // 默认允许跨域传递 cookie, 以便进行权限验证
    request.withCredentials = true;
    // 默认处理返回数据格式为 json 格式
    request.responseType = 'json';
    // 设置头
    if (!headers) headers = this.headers;
    for (let n in headers) request.setRequestHeader(n,headers[n],);
    return new Promise((resolve, reject) => {
      // 当接口调取状态变更时触发
      request.onreadystatechange = () => {
        // 处理返回状态, 以便使用 then 和 catch 方法
        // readyState 为 4 时, 为接口调取行为结束
        if(request.readyState === 4){
          // status 为 200 时, 判断为正常接通接口
          if(request.status === 200){
            // 进入 then 方法, 并将 resolve 发送至 then
            resolve(new resolveResponse(request.response));
          } else {
            // 进入 catch 方法, 并将 reject 发送至 catch
            reject(request);
            // 默认进行报错提示
            console.error('接口调取失败');
            console.error(request);
          }
        }
      };
      // 开始发送请求
      request.send();
    })
  }
}

// 处理 resolve 事件
class resolveResponse {
  constructor(r) {
    this.data = r;
  }
  data = {};
  // 处理错误
  showError(message) {
    if (!message) {
      console.error('请将antd的message植入该方法');
      return false;
    }
    if (!this.data.msg && !this.data.data) {
      // 后端未处理报错, 返回为后端错误
      message.error('服务器接口处理错误, 请联系管理员')
    } else {
      // 后端成功处理该接口
      if (this.data.status === 10000) {
        // 如成功, 则默认静默不做处理
      } else if (this.data.status > 10000) {
        // 后端约定: 大于 10000 做报错处理
        message.error(`${this.data.msg}, 状态码:${this.data.status}`)
      } else if (this.data.status < 10000) {
        // 后端约定: 小于 10000 做警告处理
        message.warn(`${this.data.msg}, 状态码:${this.data.status}`)
      }
    }
  }
}

export default Ajax;
