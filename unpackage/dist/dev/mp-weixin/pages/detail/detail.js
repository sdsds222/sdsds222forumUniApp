"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_tool = require("../../utils/tool.js");
const utils_host = require("../../utils/host.js");
const _sfc_main = {
  data() {
    return {
      options: null,
      detail: {}
    };
  },
  onLoad(e) {
    this.options = e;
    this.getDetail();
  },
  methods: {
    getDetail() {
      common_vendor.index.request({
        url: utils_host.host + "/uniapp/detail",
        data: this.options,
        success: (res) => {
          if (res.data.code == 0) {
            common_vendor.index.showToast({
              title: "操作失败",
              icon: "loading",
              // 图标类型，可以是'success'、'loading'等
              duration: 1e3
              // 持续时间（以毫秒为单位）
            });
            return;
          } else {
            res.data.data.posttime = utils_tool.parseTime(res.data.data.posttime);
            res.data.data.content = res.data.data.content.replace(
              /<img/gi,
              '<img style="max-width:100%;height:auto;display:block"'
            );
            this.detail = res.data.data;
            common_vendor.index.setNavigationBarTitle({
              title: this.detail.title
            });
            this.saveHistory();
          }
        }
      });
    },
    saveHistory() {
      let historyArr = common_vendor.index.getStorageSync("historyArr") || [];
      let item = {
        id: this.detail.id,
        classid: this.detail.classid,
        picurl: this.detail.picurl,
        title: this.detail.title,
        looktime: utils_tool.parseTime(Date.now())
      };
      let index = historyArr.findIndex((i) => {
        return i.id == this.detail.id;
      });
      if (index >= 0) {
        historyArr.splice(index, 1);
      }
      historyArr.unshift(item);
      common_vendor.index.setStorageSync("historyArr", historyArr);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.detail.title),
    b: common_vendor.t($data.detail.author),
    c: common_vendor.t($data.detail.posttime),
    d: $data.detail.content
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/13633/Documents/HBuilderProjects/testUniApp/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
