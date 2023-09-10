"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jwt = require("../../utils/jwt.js");
const utils_host = require("../../utils/host.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      classId: 0,
      classOptions: [],
      // 用于下拉选择的板块列表
      content: "",
      // 富文本编辑器内容
      picurl: "",
      navArr: [],
      author: "",
      jwtToken: "",
      information: '使用<img src="图片链接">文本添加图片，\n使用<br/>文本换行,\n使用<center>居中内容<center/>方式来居中'
    };
  },
  onShow() {
    this.navArr = [];
    this.classOptions = [];
    this.jwtToken = common_vendor.index.getStorageSync("jwt-token");
    if (this.jwtToken != "") {
      this.author = utils_jwt.parseJwt(this.jwtToken).username;
    } else {
      common_vendor.index.showToast({
        title: "用户未登录",
        icon: "loading",
        // 图标类型，可以是'success'、'loading'等
        duration: 1e3
        // 持续时间（以毫秒为单位）
      });
      common_vendor.index.switchTab({
        url: "/pages/login/login"
      });
    }
    common_vendor.index.request({
      url: utils_host.host + "/uniapp/navlist",
      success: (res) => {
        this.navArr = res.data.data;
        for (let i = 0; i < this.navArr.length; i++) {
          this.classOptions.push(this.navArr[i].classname);
        }
      }
    });
  },
  methods: {
    publish() {
      if (this.title == "" || this.content == "" || this.author == "") {
        common_vendor.index.showModal({
          title: "发布失败",
          content: "标题、用户名、富文本内容为空，无法发送。",
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
        url: utils_host.host + "/uniapp/publish",
        // 请求的URL
        method: "POST",
        // 请求方法
        header: {
          token: this.jwtToken
        },
        data: {
          title: this.title,
          cid: this.classId + 1,
          content: this.content,
          picurl: this.picurl == "" ? "error" : this.picurl,
          author: this.author
        },
        success: (res) => {
          console.log("请求成功", res.data);
          if (res.data.msg == "NOT_LOGIN") {
            common_vendor.index.showToast({
              title: "用户未登录,发布失败",
              icon: "loading",
              // 图标类型，可以是'success'、'loading'等
              duration: 1e3
              // 持续时间（以毫秒为单位）
            });
            common_vendor.index.switchTab({
              url: "/pages/login/login"
            });
          } else {
            common_vendor.index.showToast({
              title: "操作成功",
              icon: "success",
              // 图标类型，可以是'success'、'loading'等
              duration: 1e3
              // 持续时间（以毫秒为单位）
            });
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
        }
      });
    },
    handlePickerChange(event) {
      this.classId = event.detail.value;
    },
    updateContent(event) {
      this.content = event.detail.text;
    },
    insertImage() {
      this.editorContext.insertImage({
        src: this.imageUrl,
        width: "100%"
        // 设置图片宽度，可以根据需要调整
      });
    },
    updateUrl(event) {
      this.picurl = event.detail.text;
      this.picurl = this.picurl.replace(/(\r\n|\r|\n)/g, "");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.title,
    b: common_vendor.o(($event) => $data.title = $event.detail.value),
    c: common_vendor.o((...args) => $options.updateUrl && $options.updateUrl(...args)),
    d: common_vendor.t($data.classOptions[$data.classId]),
    e: common_vendor.o((...args) => $options.handlePickerChange && $options.handlePickerChange(...args)),
    f: $data.classOptions,
    g: common_vendor.o((...args) => $options.updateContent && $options.updateContent(...args)),
    h: $data.content,
    i: "在此区域输入文本内容\n" + $data.information,
    j: common_vendor.t($data.information),
    k: common_vendor.o((...args) => $options.publish && $options.publish(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/13633/Documents/HBuilderProjects/testUniApp/pages/publish/publish.vue"]]);
wx.createPage(MiniProgramPage);
