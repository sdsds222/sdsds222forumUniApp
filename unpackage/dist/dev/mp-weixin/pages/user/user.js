"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      listArr: []
    };
  },
  onShow() {
    this.getDate();
    common_vendor.index.pageScrollTo({
      scrollTop: 0,
      //滚动到页面的目标位置
      duration: 300
    });
  },
  methods: {
    goDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?cid=${item.classid}&id=${item.id}`
      });
    },
    getDate() {
      let historyArr = common_vendor.index.getStorageSync("historyArr") || [];
      this.listArr = historyArr;
    }
  }
};
if (!Array) {
  const _easycom_newsbox2 = common_vendor.resolveComponent("newsbox");
  _easycom_newsbox2();
}
const _easycom_newsbox = () => "../../components/newsbox/newsbox.js";
if (!Math) {
  _easycom_newsbox();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.listArr, (item, k0, i0) => {
      return {
        a: common_vendor.o(($event) => $options.goDetail(item), item),
        b: "64e82b52-0-" + i0,
        c: common_vendor.p({
          item
        }),
        d: item
      };
    }),
    b: !$data.listArr.length
  }, !$data.listArr.length ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/13633/Documents/HBuilderProjects/testUniApp/pages/user/user.vue"]]);
wx.createPage(MiniProgramPage);
