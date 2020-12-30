let defaultData = {
  event:"connection", // connection or msg or server
  type:"", // self or others or server
  from: "",
  userName: "", // 发送者昵称
  sendWho: "", // all or uID
  msg: "",
  time:""
}

class WSocket {
  wss;
  port = 18089;

  constructor() {
    if (!"WebSocket" in window) {
      alert("浏览器版本过低，不持支WebSocket！")
    }
  }

  // 连接服务
  openWS(openInfo) {
    try {
      this.wss = new WebSocket("ws://175.24.0.132:18089")
      console.log("连接服务器成功！");
    } catch (error) {
      /* eslint-disable */
      console.log(error);
      alert("连接服务器失败！")
    }
    this.wss.onopen = () =>{
      console.log("onopen");
      openInfo = Object.assign(defaultData,openInfo)
      this.sendMsg(openInfo)
    }

  }

  // 接收到信息
  onMessage(cb){
    this.wss.onmessage = data => {
      cb(data)
    }
  }

  // 发送信息
  sendMsg(sendData) {
    sendData = Object.assign(defaultData,sendData) // 合并默认的data和需要发送的data
    this.wss.send(JSON.stringify(sendData))
  }
}

export default new WSocket()