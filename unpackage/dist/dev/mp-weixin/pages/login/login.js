"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jwt = require("../../utils/jwt.js");
const utils_host = require("../../utils/host.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      loginState: false
    };
  },
  onShow() {
    this.username = "";
    this.password = "";
    let jwtToken = common_vendor.index.getStorageSync("jwt-token");
    common_vendor.index.request(
      {
        url: utils_host.host + "/uniapp/test",
        // 请求的URL
        method: "POST",
        // 请求方法
        header: {
          token: jwtToken
        },
        success: (res) => {
          if (res.data.data == "LOGIN") {
            console.log("登录成功");
            this.loginState = true;
            this.username = utils_jwt.parseJwt(jwtToken).username;
          } else {
            console.log("登录失败");
            this.loginState = false;
          }
        }
      }
    );
  },
  methods: {
    login() {
      if (this.username == "" || this.password == "") {
        common_vendor.index.showModal({
          title: "登录错误",
          content: "账号和密码不能为空",
          success: (res) => {
            if (res.confirm) {
              return;
            } else if (res.cancel) {
              return;
            }
          }
        });
        return;
      }
      common_vendor.index.request({
        url: utils_host.host + "/login",
        // 请求的URL
        method: "POST",
        // 请求方法
        data: {
          username: this.username,
          password: this.password
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.data == "NOT_LOGIN" || res.data.data == void 0) {
            common_vendor.index.showToast({
              title: "登陆失败，密码错误",
              icon: "loading",
              // 图标类型，可以是'success'、'loading'等
              duration: 1e3
              // 持续时间（以毫秒为单位）
            });
            this.loginState = false;
          } else {
            common_vendor.index.showToast({
              title: "登陆成功",
              icon: "success",
              // 图标类型，可以是'success'、'loading'等
              duration: 1e3
              // 持续时间（以毫秒为单位）
            });
            this.loginState = true;
            console.log(res.data.data);
            common_vendor.index.setStorageSync("jwt-token", res.data.data);
          }
        },
        fail: (err) => {
          console.error("请求失败", err);
          common_vendor.index.showToast({
            title: "操作失败",
            icon: "loading",
            // 图标类型，可以是'success'、'loading'等
            duration: 1e3
            // 持续时间（以毫秒为单位）
          });
          this.loginState = false;
        }
      });
    },
    unlogin() {
      common_vendor.index.setStorageSync("jwt-token", "");
      this.loginState = false;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loginState == false
  }, $data.loginState == false ? {
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: $data.password,
    e: common_vendor.o(($event) => $data.password = $event.detail.value),
    f: common_vendor.o((...args) => $options.login && $options.login(...args))
  } : {}, {
    g: $data.loginState == true
  }, $data.loginState == true ? {
    h: common_vendor.t($data.username),
    i: common_vendor.o((...args) => $options.unlogin && $options.unlogin(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/13633/Documents/HBuilderProjects/testUniApp/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
