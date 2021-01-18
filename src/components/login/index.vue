<template>
  <div class="container">
    <div class="top-banner">
      <img
        src="//s1.hdslb.com/bfs/static/passport/static/img/rl_top.35edfde.png"
      />
    </div>
    <div class="title-line">
      <span class="tit" style="font-size: 38px">登录</span>
    </div>
    <div class="login-box">
      <div class="login-left">
        <div class="qrcode-login">
          <div class="qrcode-con">
            <i class="tv-icon"></i>
            <div class="qrcode-box">
              <!-- moussenter -->
              <div
                class="qrcode-tips"
                :class="mouse"
                @mouseenter="
                  () => {
                    mouse = 'moussenter';
                  }
                "
                @mouseleave="
                  () => {
                    mouse = '';
                  }
                "
              ></div>
              <div class="qrcode-img">
                <img
                  :src="`data:image/png;base64,${qr.QR}`"
                  style="display: block"
                />
              </div>
            </div>
          </div>
          <div class="qrcode-footer">
            <p class="status-txt">扫描二维码登录</p>
            <p class="app-link">
              请使用
              <a href="//app.bilibili.com/" target="_blank">哔哩哔哩客户端</a
              ><br />扫码登录<br />或扫码下载APP
            </p>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="login-right">
        <div class="form-login">
          <div class="input-box">
            <div class="type-tab">
              <span :class="{ active: tabStatus == 1 }" @click="setStatus(1)"
                >密码登录</span
              >
              <span :class="{ active: tabStatus == 2 }" @click="setStatus(2)"
                >短信登录</span
              >
            </div>
            <!-- 账号密码登录 -->
            <div v-if="tabStatus == 1">
              <div class="item username status-box">
                <input type="text" class="" placeholder="你的手机号/邮箱" />
                <span class="status"></span>
                <div class="text">
                  <span class="tips"></span>
                  <!-- 请输入注册时用的邮箱或者手机号呀 -->
                </div>
              </div>
              <div class="item password status-box">
                <input type="text" class="" placeholder="密码" />
                <span class="status"></span>
                <div class="text">
                  <span class="tips"></span>
                </div>
                <!-- 账号或密码错误 -->
                <!-- 喵，你没输入密码么？ -->
              </div>
            </div>
            <!-- 短信登录 -->
            <div v-if="tabStatus == 2">
              <div class="item status-box">
                <input
                  type="text"
                  class=""
                  placeholder="请输入你的手机号"
                  v-model="codePhoneNum"
                  :class="smsPhoneError"
                  @input="inputSmsPhone"
                />
                <span class="status" :class="smsPhoneError"></span>
                <div class="text">
                  <span class="tips" :class="smsPhoneError">{{
                    smsPhoneDesc
                  }}</span>
                  <!-- p标签填错误信息 -->
                </div>
              </div>
              <div class="item status-box">
                <input
                  type="text"
                  class=""
                  placeholder="请输入短信验证码"
                  v-model="smsCode"
                  :class="smsStatus"
                  @input="smsinput"
                />
                <div class="button" @click="sendCode">
                  {{ codelock ? codetimes : "发送验证码" }}
                </div>
                <span class="status" :class="smsStatus"></span>
                <div class="text">
                  <span class="tips" :class="smsStatus">{{ smsDesc }}</span>
                  <!-- p标签填错误信息 -->
                </div>
              </div>
            </div>
            <div class="item gc">
              <a class="forget-password">忘记密码？</a>
            </div>
            <div class="btn-box">
              <div href="" class="btn login" @click="msmCodeLogin(tabStatus)">
                登录
              </div>
              <a
                href="https://passport.bilibili.com/register/phone.html#/phone"
                class="btn reg"
                >注册</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="xieyi">
      登录即代表你同意<a
        target="_blank"
        href="https://www.bilibili.com/protocal/licence.html"
        >用户协议</a
      >和<a
        target="_blank"
        href="https://www.bilibili.com/blackboard/privacy-pc.html"
        >隐私政策</a
      >
    </p>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import {
  getcaptcha,
  getack,
  login,
  yiyun,
  sms,
  smslogin,
  getUserNav,
  QR,
  getInfo,
} from "../../api/login";
import router from "../../router";
import JsEncrypt from "jsencrypt";
interface data {
  tabStatus: number;
  capCode: {
    key: string;
    challenge: string;
    gt: string;
  };
  validate: string;
  smsCode: string;
  codetimes: number;
  codelock: boolean;
  codePhoneNum: string;
  username: string;
  password: string;
  qr: {
    QR: string;
    oauthKey: string;
    url: string;
  };
  mouse: string;
}
export default defineComponent({
  setup() {
    const state: data = reactive({
      tabStatus: 1,
      capCode: {
        key: "",
        challenge: "",
        gt: "",
      },
      validate: "",
      smsCode: "",
      codetimes: 60,
      codelock: false,
      codePhoneNum: "",
      username: "",
      password: "",
      qr: {
        QR: "",
        oauthKey: "",
        url: "",
      },
      mouse: "",
    });
    const messageState = reactive({
      smsDesc: "",
      smsStatus: "success",
      smsPhoneError: "",
      smsPhoneDesc: "",

      usernameStatus: "",
      usernameDesc: "",
      passwrodStatus: "",
      passwordDesc: "",
    });

    const setStatus = (id: number) => {
      state.tabStatus = <number>id;
    };
    const isPhone = (phone) => {
      return /^1[3-9]\d{9}$/.test(phone);
    };
    // 扫码登录 60s 1s倒计时一次轮训是否扫码

    //data:image/png;base64,base64码

    const inputSmsPhone = () => {
      messageState.smsPhoneError = "";
      messageState.smsPhoneDesc = "";
    };
    const smsinput = () => {
      messageState.smsDesc = "";
      messageState.smsStatus = "";
    };

    onMounted(async () => {
      // let data = await getcaptcha();
      // let { code } = data.data;
      // if (code === 0) {
      //   state.capCode.key = data.data.data.result.key;
      //   state.capCode.gt = data.data.data.result.gt;
      //   state.capCode.challenge = data.data.data.result.challenge;
      // }
      let qrres = await QR();
      console.log(qrres.data);
      state.qr = qrres.data.data;
      let timeFlag: number = 0;
      let times = setInterval(async () => {
        let qres = await getInfo({ key: state.qr.oauthKey });
        let { code } = qres.data;
        if (code === 0) {
          clearInterval(times);
          document.cookie = qres.data.data.url.split("?")[1].slice(72, 115);
          router.replace('/')
        } else if (qres.data.data == "-4") {
          console.log("未扫码");
        } else if (qres.data.data == "-5") {
          console.log("扫码了");
        }
        timeFlag++;
        if (timeFlag >= 30) {
          clearInterval(times);
        }
      }, 2000);
    });
    const phoneLogin = async () => {};
    // 发送验证码
    const sendCode = async () => {
      if (state.codelock) return;
      state.codelock = true;
      let times = setInterval(() => {
        state.codetimes--;
        if (state.codetimes == 0) {
          state.codetimes = 60;
          state.codelock = false;
          clearInterval(times);
        }
      }, 1000);
      if (isPhone(state.codePhoneNum)) {
        let yiyunres = await yiyun({
          challenge: state.capCode.challenge,
          gt: state.capCode.gt,
        });
        // console.log(yiyunres.data.data);
        state.validate = yiyunres.data.data.validate;
        let { key, challenge } = state.capCode;
        let coderes = await sms({
          tel: state.codePhoneNum,
          key,
          challenge,
          validate: state.validate,
          seccode: state.validate + "|jordan",
        });
        console.log(coderes);
        let { code, message } = coderes.data;
        messageState.smsDesc = message;
        if (code !== 0) {
          messageState.smsStatus = "error";
        }
      } else {
        messageState.smsPhoneError = "error";
        messageState.smsPhoneDesc = "手机号格式错误";
      }
    };
    // 登录 1手机号登录 2验证码登录
    const msmCodeLogin = async (status: number) => {
      if (status == 1) {
        alert("暂时没做用户名登录");
      } else {
        if (!isPhone(state.codePhoneNum)) {
          messageState.smsPhoneDesc = "喵,这是你的手机号吗？";
          messageState.smsPhoneError = "error";
        } else if (state.smsCode === "") {
          messageState.smsDesc = "请输入验证码";
          messageState.smsStatus = "error";
        } else {
          let smsloginRes = await smslogin({
            tel: state.codePhoneNum,
            smsCode: state.smsCode,
          });
          console.log(smsloginRes);
          let { code, message } = JSON.parse(smsloginRes.data.body);

          if (code == 0) {
            document.cookie = smsloginRes.data.edata[2].split(";")[0];
          } else {
            messageState.smsDesc = message;
            messageState.smsStatus = "error";
          }
        }
      }
    };

    return {
      setStatus,
      phoneLogin,
      ...toRefs(state),
      sendCode,
      msmCodeLogin,
      ...toRefs(messageState),
      inputSmsPhone,
      smsinput,
    };
  },
});
</script>

<style lang="scss" scoped>
.top-banner {
  background: #00a0d8;
  height: 86px;
  text-align: center;
  margin-bottom: 20px;
}
.title-line {
  width: 980px;
  height: 28px;
  margin: 0 auto;
  border-bottom: 1px solid #ddd;
  margin-bottom: 28px;
  text-align: center;
  .tit {
    height: 56px;
    line-height: 56px;
    margin: 0 auto;
    padding: 0 20px;
    font-size: 40px;
    background: #fff;
    text-align: center;
    color: black;
  }
}
.login-box {
  position: relative;
  width: 980px;
  margin: 0 auto;
  display: flex;
  .login-left,
  .login-right {
    width: 490px;
  }
  .line {
    border-right: 1px solid #ddd;
    height: 300px;
    margin-top: 28px;
  }
  .login-left {
    .qrcode-login {
      position: relative;
      width: 100%;
      .qrcode-con {
        padding-top: 72px;
        .tv-icon {
          position: absolute;
          width: 70px;
          height: 70px;
          left: 160px;
          top: 10px;
          background: url("//i0.hdslb.com/bfs/static/e6f2388d454c82004905753802e9cfe709d80d08.png")
            no-repeat;
        }
        .qrcode-box {
          width: 140px;
          height: 140px;
          margin: 0 auto;
          background: #ddd;
          position: relative;
          .qrcode-tips {
            z-index: 10;
            position: absolute;
            width: 480px;
            height: 192px;
            top: -50px;
            left: 50%;
            margin-left: -240px;
            background: url("//s1.hdslb.com/bfs/static/passport/static/img/qr-tip.3a21a48.png")
              no-repeat;
            background-size: cover;
            background-color: #fff;
            opacity: 0;
            -webkit-transition: opacity 0.5s;
            -o-transition: opacity 0.5s;
            -moz-transition: opacity 0.5s;
            transition: opacity 0.5s;
          }
          .moussenter.qrcode-tips {
            opacity: 1;
          }
          .qrcode-img {
            img {
              width: 140px;
            }
          }
        }
      }
      .qrcode-footer {
        width: 480px;
        height: 155px;
        background: url("//s1.hdslb.com/bfs/static/passport/static/img/2233login.af9c53d.png")
          0 -7px no-repeat;
        .status-txt {
          padding-top: 20px;
          text-align: center;
          color: #222;
          font-size: 18px;
          letter-spacing: 3px;
          margin-bottom: 5px;
        }
        .app-link {
          text-align: center;
          color: #717171;
          font-size: 14px;
        }
      }
    }
  }
  .login-right {
    padding-left: 45px;
    .form-login {
      position: relative;
      .input-box {
        margin-top: 50px;
        width: 414px;
        .type-tab {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 12px;
          span {
            font-size: 14px;
            letter-spacing: 0;
            margin-right: 20px;
            color: #555;
          }
          span.active {
            color: #02a7de;
          }
        }
        .status-box {
          position: relative;
          .text {
            margin: 6px 0;
            font-size: 12px;
            min-height: 20px;
            line-height: 20px;
            .tips {
              color: #f66495;
              float: left;
            }
          }
          .status {
            display: none;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAABgCAYAAABLwH3pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjQwNEFEMDQ2MDY1MTFFNzgwMUFCNTY2RDg4RTI2MzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjQwNEFEMDM2MDY1MTFFNzgwMUFCNTY2RDg4RTI2MzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZBN0NFOTkzQThEMTFFNTgxMjFCNUQ2NUNCMTI0N0QiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjZBN0NFOUEzQThEMTFFNTgxMjFCNUQ2NUNCMTI0N0QiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4mPh/xAAAMb0lEQVR42uxda2wc1RmdmX3v2vErdkJi5+UkJIGEIFS1og+soja0RSVVSyV+BCKhgqhSyYjyo0BVKioqqopWolIfUiUIUkEFqaXi0SJKQ6EpLQ1xRAl5Y5I4OCQNefi9uzM93+6dzfV41jveF8E5R7qanZ3Z+43tc+53vjt31qbjOAZBXKyw+CsgKACCoAAIggIgCAqAICgAgqAACIICIAgKgCAoAIKgAAhi9iAc9MTfPP5UDzZ/Q9uF1nP7zd887R779dbfP4rNLWg/vG3TjffX6FonxUc7rR0rxEe7n39WopYZ4Aq0bSB9s4f8hoeUtUIuPlqzh/z1ik/MIphBV4Oapuklu4zEu9FuUvuPIStsrvHq0mnjo23mn5SomQB8RnxDJ7+8qMPyat/4JD9RFwEoERzAplvtnpLXbk1Qp+cLpsSn/amABNrfdrbDy88Z1wAqA3Rrb7XqNUEd4BtfqwmIKqFv33ETLVTnmOF6xguXQf5bNNthqH23MO6p8Ug8bXxj6uwQUR4Jl2JzG9omtA1ob9c4nojsyyqmpKPrLzgBKHLf4vX8eF8nYa9Ru2nIHg/5dc9fj/gXA/GXY/NIyLK+GI9HrHg0apw5N3yuxjFvx+beaCTclYhH5a3nLtQMICPrK3LNIH+v+6YIASKQY+vR+mt4rYX4iuguNqtjtY4/q32x1AGhkBVvSMavAxkLx2ynbGKLve5CW4CWXr9y3n/8zovHop9IJaJdlpV34xPpTCViasBmCdpctN2I+UHVBHDbphv71CiM11N+K731GKDc+D7oJY2rUAwbxjsg/yheJqrQ3Qpkkj2WZRpgyzHsL/Q7KRIO9bnkVzhTQTH/k5Bl3mGiv2w2ezfe+mlVawBi1meB7NETo7uRDK6qtD9kkwOtTQ05Mdm201rsvEw2+xZkoF9H2ZxMJWNvJWI5G2UMj4y1BfkM1wIRk5DNEbJyrO1uz0JTu9XIHIc9SfoKIDMlXqrsa8/Yhb5My6QAiJkjk7WrR8hsdk9eADkR+GaBy5bNlfs4A5qNqeDas3sLxC4SjxaIKEWi3bolAR8jAQtQGXE/KXUz2ldQgH4na9v7wkbIJfZcnCO1wCVo40b+/s0hnJeBRfovagW3RojPoOi9Ui7ZyM8CvgoxPTNwclQmRJoRr0WdI/WMXJv8HGLJBpkBiGlGbfvA5MI4T6SSVsI0r0QB/Rza1Q3J+BYQrxnZZL9nRG4D0Y/i9bdQI8ho/SkluoNaV01BrzUcCj0QDln3IN71sWh4o6oh9ukZAAK+F0X28yjIH0bsF2mBiOkFYNvvqVHVzQDBrEQ4tKupMSmzOmGZz8cIvABielfz5K0g5YdtzY1GPB5NoUCWc92YBzWhBBaAFL3JRGwlRNcfjUQ6lYDf1WuAZDz2Ia7LTCXjI02NqSEKgChVvKaxOVIgiBUsA6xZ2nZC2Yu0+twC27b79QywbkWHCOscXP5QsawD4QRe0iIzSBjZF0JA/RJPE7DEk3sBhu04H2IzB7kBLx2TAiCCZIH9GiFbg34OXv632PwdbQuIeQiefFD5felnnrIo2x3HkBH/DUMJQc8AMnKrm2ilBZCx34C9eRZCewzxfpTvy+nPx7MSMvOEeLBcxj+c/H2k91gEE0HqgIMhdXPKmoEAxsYnHkhnspcPjYwdRR85KwPi9WPYvRQjdG5E7mxPXqdOf6ognKx9KH+q8N+0VNF6olS81Uta9x8cOPv9sfH02ol0Nit3gtFXvzbzNH/V4lbx/QXv710NSgEQhk4OmYbEiHxIywAdQT8/Mjr+7VA49LBp2/K5Z/DWRiEkCt5LLZUBQNK/YvNZRfgN61fO23Z5d/vowMlRmQrtVKLrCCIAwfDo2Osohhepa+3BtR/WbJfMPElff1bF9WsqNgVATGNlNE8Oi3FJ0M+huN3ZkMzPYo5PZNa4nhwCMNwM0NyYzEYi4dzU6ulzIy3n7ZN9CLE6Vf0gMQOtQG2Zk9qJz+UEcPrs8Br0s1WzUx0RK3QQRXCTCBvZ6RJaICJIDXBUK4KXYxT9upF/3uIsmhzbi5H71NSi1O5zrUw4ZC0RLw9CHtMziaPNw8ObJ87HhFe3CqK7Dp+VojarYkpNckDuGXhjpjN2Xyxq3ZAjcyjUfenilmFkEyl8WyST4Gf5l3tzDT9LhAIgAgjAKcwCoRZYGYtGnhYOiX0GoYXoYmXkLu9LaE9L4QtyOpctbTsN8sk05DKM+kK2+ejrmCJ1hyqUNWtjagW0DWHkp0WjkfBduUV0Tt6WgcRSlwwj5us4/Czak4g3mK9XsjtdGiNml7Jyx+VGGPpoz2Sck0Z+Wjds+vCdAiB8ZnNsWUY8IVwU+zKnIeFXKK+aSGdWjU+kt8BavA1y3g1SvgCy9kE0y9SI2wXCD2p+XB7BPa5106jNIBWWQ6jnArz1SQpxrkXMaxHzIfT1ON6+L5MTQCFbLVJ9HQuFzFWWaXWsW9HhQJQigvkQ3JRlHZwGJaZg3fIOsTFHPG+LKO5C2y58FGEIUZvnpIyWpobLMGo/D1LemcmcJySE0Jkf2XPklOF9LvZPaAW2pdmuYz6XIg8+/QptUGyMPKcgNUZbc2O0MZW4FX3+GxZIll78T2WZrvPZxCjUHa4I/ZYZUQBEsTpgYHJWcFqHRsYeWTg38WnsrkL7ecFGQAxyFxiCuAn2aIdWQHfZjvO+NivTpu+bk/sf9F7D2Hj6DOLdgWMysn8DrSCueCwiBbAQ/nPoc4cS3Dx5vBL7ivDm/Fzfjv1BMcdDARCGNiLrhJz0NBVG0/Do2MQSeX3qzNAgXi+eMgsUjbyIDPCm9pkF6Oe4KoxlVma+2p9quxznmI/tyVmpro5k+uzQ6CnYnUWTr8kai4RDr7ox5Rqx6XDtlKWWQ9h2oe9U4BrAuyy14Q9bnKGv/aLoWlW/45V+Rcq5m3825XfiGThKHm/ceieZXV4d8L5blBYsTcjqxgjbAkI9YSmfr2Eb/PmDa5a2jcBzy0xRJ85ZuG55exr7Yns6sA8L5OwpEm/A+56KJxz9AQTyPXxevyB53uDW1Utaj+w/evpN9zFOkL4z61ogde/BFbPfUuvAGUDILSQPSv5aDVLuaBKE/EQlAnCm3IiCxbg3HA691tKUWhaLFsZOKZZ/nE5nNqzoah5RZFaWJL8+B33JSs0vgZA7YEekX9vb99ru9mEZ8zzx5OtvXkklYvc1NybRXeHPKyLq6WxP/E52MplJtmsh4r2Al1+AGG5X2WWw2M85o1kgVwQ62etIfq8ITJK/hgLwsSTJROwz7gpO4KQqUqUumLTGBoXpd2NR6x4Q9oiyMP/UjyMjPGjk1+fv9DiG9zFKN2oZIIoi+2oVU/7G0s8vs1n7yUXzUoV7AsgCh9Cn1CaHoZLj2JcFeS9p2UUK94d8yVTMprjpotioX0ooVbZATplCoQUqw//nhtj3Tn21MZWQ5QzuyCzLI/aq0Xc7BPJ6V3syU81rOHx8+GWQvsfIf8uHZIr9qonHfxlCG6g0xozWApU7ulc5K5Q7ujMrVEAM4E+lfn81+BrMz9c5XvEaoBIST1cv1JHEZpmZg7iIELgIFkJPVwRXifClxGCUKIINkp6ougDcbOA3sk93rA7F70yOE0R5AtCtkNcWTXesBhkgyDQoMwBRfQt0IUxUeLYzPU4QH2sBEMRHLwC/GuAjvH7aHaIizPh5AG+xW+e7wMU8P20PUR8BfMSk95LfoAiImligSqY1q3gnuNisjlli36AoiIozQLkiqHKGKHdqk+QnKrdALpmL+f461QOmT9FrFimGSXwiOLHq9H99CeLjVQMQBAVAEBQAQVAABEEBEAQFQBAUAEFQAARBARAEBUAQFABBUAAEQQEQBAVAEBQAQVAABEEBEAQFQBAUAEFcOAj0vUB/eWWH/EvM9Wi9G665qq/Euc3YPIrWj3N7q3GR5tZ3CvGdm1f3lTi3EB/n9vJPTFQjAyxBuwZtGwi+vgT5t6HdoAhbLRTig+DrS5C/FvGJi1wAm9F2oTUVE4FG/ivQzshoXcXrnBTfTwQa+WsRn7iYBQArI/+0rKeYCHzI31PKKs0EsDJT4usi8CF/TymrRBA57szke4H8iC5eu5bkLzHK+8Yn+YmaCKCICPrrQf5pRNBP8hN1E4CPCIx6kb+ICAySn6irADQR/NHIz9BsrBf5PSIoxCf5iboKgCBmA3gnmKAACIICIAgKgCAoAIKgAAiCAiAICoAgKACCoAAIggIgiFmE/wswAJ4FV7zvyrR7AAAAAElFTkSuQmCC");
            position: absolute;
            top: 8px;
            right: -25px;
            width: 20px;
            height: 20px;
          }
          .error {
            display: block;
            background-position: -37px -38px;
          }
          .button {
            height: 36px;
            width: 130px;
            background-color: #00a1d6;
            border-color: #00a1d6;
            position: absolute;
            right: 2px;
            top: 2px;
            padding: 0 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        }
        .item input.error {
          border-color: #f66495;
        }
        .item input {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 2px;
          color: #aaa;
          font-size: 14px;
          padding: 10px;
          height: 40px;
          vertical-align: middle;
          border-radius: 4px;
        }
        .gc {
          display: flex;
          margin: 10px 0;
          justify-content: flex-end;
          font-size: 12px;
        }
        .btn-box {
          display: flex;
          justify-content: space-between;
          .btn {
            color: #555;
            display: inline-block;
            height: 36px;
            border: 1px solid #ccc;
            border-radius: 2px;
            width: 184px;
            line-height: 38px;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            -webkit-transition: all 0.3s;
            -o-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
          }
          .btn.login {
            border: 1px solid #0381aa;
            color: #fff;
            background-color: #00a7de;
          }
          .btn.login:hover {
            background: #00bee7;
          }
          .btn.reg:hover {
            background: #f7f7f7;
          }
        }
      }
    }
  }
}
.xieyi {
  margin: 24px auto 0;
  width: 980px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #99a2aa;
  text-align: center;
  line-height: 16px;
}
.container {
  padding-bottom: 40px;
}
</style>