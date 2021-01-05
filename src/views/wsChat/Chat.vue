<template>
  <div class="chat">
    <head-bar title="聊天室"></head-bar>
    <div class="chat-head">
      <!-- <span>{{whoChat}}</span> -->
      <span>芒果皮儿聊天室</span>
      <span style="margin-left:36px;">在线人数({{liveNumber}})</span>
    </div>
    <div class="chat-list">
      <el-scrollbar style="height:100%;width:100%;">
        <template v-for="(item,idx) in chatInfo">
          <div :key="idx" v-if="item.type==='others'">
            <div class="chat-date">{{item.time}}</div>
            <div class="chat-item">
              <el-avatar class="avatar">
                <span class="avatar-text">{{item.lastName}}</span>
              </el-avatar>
              <div class="chat-info">
                <div class="el-popover el-popper popper-chat" x-placement="right-start">
                  {{item.msg}}
                  <div x-arrow class="popper__arrow" style="top: 12.5px;"></div>
                </div>
              </div>
            </div>
          </div>
          <div :key="idx" v-else>
            <div class="chat-date">{{item.time}}</div>
            <div class="chat-item chat-item-right">
              <el-avatar class="avatar">
                <span class="avatar-text">{{item.lastName}}</span>
              </el-avatar>
              <div class="chat-info">
                <div
                  class="el-popover el-popper popper-chat popper-chat-right"
                  x-placement="left-start"
                >
                  {{item.msg}}
                  <div x-arrow class="popper__arrow" style="top: 12.5px;"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-scrollbar>
    </div>
    <div class="send-info">
       <el-input
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 4, maxRows: 40}"
          class="textarea-input"
          placeholder="请输入内容"
          v-model="sendInfo"
        ></el-input>
        <el-button
          size="mini"
          type="primary"
          class="send-btn"
          style="float:right;margin-right:20px;margin-top:6px;"
          @click="sendInfoBtn"
        >发送(S)</el-button>
    </div>
  </div>
</template>

<script>
import WS from "./index";
import { formatData } from "@/utils/common";
import headBar from "@/components/headBar.vue";
export default {
  name: "Chat",
  components: {
    headBar
  },
  data() {
    return {
      socket: null,
      username: "",
      msg: "",
      messageList: [],
      uid: "",
      img: null,
      // NEW----------//
      liveNumber: 0,
      avatarURL:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      searchVla: "",
      isShow: false,
      sendInfo: "",
      userName: "",
      defaultName: "张三",
      whoChat: "",
      chatInfo: [],
      sendWho: "all",
      concatList: [
        {
          userName: "群聊",
          lastName: "群",
          uId: "server",
          active: false
        },
      ]
    };
  },
  async created() {
    await this.init();
    await this.defaultActive();
  },
  mounted() {
  },
  methods: {
    //NEW---------------//
    getID(length = 0) {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36);
    },
    defaultActive(id = "server") {
      if (id === "server") {
        this.whoChat = "群聊";
        this.sendWho = "server";
      }
      this.concatList.forEach(item => {
        if (id === item.uId) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    },
    init() {
      if (sessionStorage.userName) {
        this.userName = sessionStorage.userName;
        this.initWebSocket();
      } else {
        this.$prompt("请输入您的昵称", "", {
          confirmButtonText: "确定",
          showCancelButton: false,
          inputPlaceholder: "如：张三",
          inputPattern: /\S/,
          inputErrorMessage: "昵称不能为空",
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false
        })
          .then(({ value }) => {
            sessionStorage.userName = value;
            this.userName = value;
            let uId = this.getID();
            sessionStorage.uId = uId;
            this.$message({
              type: "success",
              message: "你的昵称是: " + value
            });
            this.initWebSocket();
          })
          .catch(() => {
            sessionStorage.userName = this.defaultName;
            this.userName = this.defaultName;
            let uId = this.getID();
            sessionStorage.uId = uId;
            this.$message({
              type: "info",
              message: "未输入昵称，默认叫 " + this.defaultName
            });
            this.initWebSocket();
          });
      }
    },
    initWebSocket() {
      let Data = {
        event: "connection",
        from: sessionStorage.uId,
        userName: this.userName,
        sendWho: "all",
        msg: this.userName + "上线啦",
        time: new Date()
      };
      WS.openWS(Data);
      WS.onMessage(data => {
        console.log(data);
        let Data = JSON.parse(data.data);
        console.log(Data);
        this.liveNumber = Data.data && Data.data.length ? Data.data.length : this.liveNumber
        if (Data.event === "connection") {
          this.$notify({
            message: Data.userName + "上线啦",
            type: "warning"
          });
        }
        if (Data.event === "msg") {
          let time = formatData(Data.time);
          let type = "";
          if (Data.userName === sessionStorage.userName) {
            type = "self";
          } else {
            type = "others";
            console.log("others");
          }

          console.log(this.chatInfo);
          if( Data.sendWho === this.sendWho){
            this.chatInfo.push({
              type,
              msg: Data.msg,
              time,
              lastName: Data.userName.substring(0, 1)
            });
              sessionStorage[this.sendWho] = JSON.stringify(this.chatInfo);
          }else{
            let oldInfo = ""
            // sessionStorage[this.sendWho]&&(oldInfo=sessionStorage[this.sendWho])
            oldInfo.concat([{
              type,
              msg: Data.msg,
              time,
              lastName: Data.userName.substring(0, 1)
            }])
            console.log(oldInfo);
            // sessionStorage[this.sendWho] = JSON.stringify(oldInfo)
          }


        }
        if (Data.event === "server") {
          this.concatList = [
            {
              userName: "群聊",
              lastName: "群",
              uId: "server",
              active: true
            }
          ];
          Data.data.forEach(item => {
            this.concatList.push({
              userName: item.userName,
              lastName: item.userName.substring(0, 1),
              uId: item.uId
            });
          });
        }
      });
    },
    sendInfoBtn() {
      if (this.sendInfo !== "") {
        let time = new Date().getTime();
        let Data = {
          event: "msg",
          from: sessionStorage.uId,
          userName: this.userName,
          sendWho: this.sendWho,
          msg: this.sendInfo,
          time
        };
        console.log(Data);
        if(Data.sendWho!=="server" && Data.sendWho !== Data.from){
          this.chatInfo.push({
            type: "self",
            msg: this.sendInfo,
            time,
            lastName: this.userName.substring(0, 1)
          });
        }
        WS.sendMsg(Data);
        this.sendInfo = "";
      } else {
        this.$message({
          message: "消息不能为空",
          type: "warning"
        });
      }
    },
    contact(info) {
      console.log(info);

      // if (sessionStorage[info.uId]) {
        this.chatInfo = JSON.parse(sessionStorage[info.uId]);
      // } else {
      //   this.chatInfo = [];
      // }
      this.defaultActive(info.uId);
      // this.whoChat = info.userName;
      // this.sendWho = info.uId;
    }
  },
  filters: {
    name(username) {
      return username.substring(0, 1);
    }
  },
  computed: {
    users() {
      let length = this.messageList.length;
      if (this.messageList[length - 1]) return this.messageList[length - 1].len;
      return 0;
    }
  }
};
</script>

<style lang="less" scoped>
.chat {
  width: 100%;
  background: #f5f5f5;
  .chat-head {
    height: 62px;
    padding-left: 20px;
    line-height: 62px;
    font-size: 20px;
    border-bottom: 1px solid #e7e7e7;
    background-color: #ffda19;
    span {
      color: #f9f9f9;
      font-size: 16px;
    }
  }
  .chat-list {
    height: calc(750px - 62px - 150px - 46px);
    .chat-item {
      display: flex;
      padding: 0 15px;
      .avatar {
        width: 38px;
        height: 38px;
        .avatar-text {
          font-size: 22px;
          font-weight: bold;
        }
      }
      .chat-info {
        flex: 1;
        position: relative;
        .popper-chat {
          min-width: 20px;
          max-width: 500px;
          padding: 8px 15px;
        }
      }
    }
    .chat-item-right {
      flex-direction: row-reverse;
    }
    .popper-chat-right {
      right: 0px;
    }
    .chat-date {
      font-size: 12px;
      padding-top: 15px;
      padding-bottom: 10px;
      text-align: center;
      color: #ccc;
    }
  }
  .send-info {
    overflow-x: hidden !important;
    height: 100px;
    background: #fff;
    border-top: 1px solid #e7e7e7;
    position: relative;
    .textarea-input {
      width: 530px;
      /deep/ .el-textarea__inner {
        border: none;
      }
    }
    .send-btn {
      position: absolute;
      right: 0px;
      bottom: 10px;
    }
  }
}
</style>
