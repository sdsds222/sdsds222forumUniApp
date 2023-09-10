"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_host = require("../../utils/host.js");
const _sfc_main = {
  data() {
    return {
      title: "Hello",
      navIndex: 0,
      navArr: [],
      newsArr: [],
      currentPage: 1,
      nowId: 1,
      loading: 0
      //0默认 1加载中 2没有更多了
    };
  },
  onLoad() {
    this.getNavData();
    this.getNewsData();
  },
  onShow() {
    if (common_vendor.index.getStorageSync("jwt-token") == "") {
      common_vendor.index.setNavigationBarTitle({
        title: "首页(未登录)"
      });
    } else {
      common_vendor.index.setNavigationBarTitle({
        title: "首页"
      });
    }
  },
  onReachBottom() {
    console.log("到底部了");
    this.loading = 1;
    this.currentPage++;
    this.getNewsData();
  },
  onPullDownRefresh() {
    let that = this;
    common_vendor.index.startPullDownRefresh({
      //开启下拉刷新
      success() {
        setTimeout(function() {
          common_vendor.index.stopPullDownRefresh();
          that.currentPage = 1;
          that.newsArr = [];
          that.getNavData();
          that.getNewsData();
        }, 500);
      }
    });
  },
  methods: {
    //点击导航切换
    clickNav(index, id) {
      this.newsArr = [];
      let that = this;
      setTimeout(function() {
        that.navIndex = index;
        that.currentPage = 1;
        that.nowId = id;
        that.loading = 0;
        that.getNewsData();
      }, 50);
    },
    //跳转到详情页事件
    goDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?cid=${item.classid}&id=${item.id}`,
        animationType: "pop-in"
      });
    },
    //获取导航列表数据
    getNavData() {
      common_vendor.index.request({
        url: utils_host.host + "/uniapp/navlist",
        success: (res) => {
          this.navArr = res.data.data;
        }
      });
    },
    //获取新闻列表数据
    getNewsData() {
      common_vendor.index.request({
        url: utils_host.host + "/uniapp/newslist",
        data: {
          num: 8,
          cid: this.nowId,
          page: this.currentPage
        },
        success: (res) => {
          if (res.data.data.length == 0 || this.currentPage == 1) {
            this.loading = 2;
          }
          this.newsArr = [...this.newsArr, ...res.data.data];
        }
      });
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
    a: common_vendor.f($data.navArr, (item, index, i0) => {
      return {
        a: common_vendor.t(item.classname),
        b: common_vendor.n(index == $data.navIndex ? "active" : ""),
        c: item.id,
        d: common_vendor.o(($event) => $options.clickNav(index, item.id), item.id)
      };
    }),
    b: common_vendor.f($data.newsArr, (item, k0, i0) => {
      return {
        a: common_vendor.o(($event) => $options.goDetail(item), item.id),
        b: "1cf27b2a-0-" + i0,
        c: common_vendor.p({
          item
        }),
        d: item.id
      };
    }),
    c: $data.newsArr.length == 0
  }, $data.newsArr.length == 0 ? {} : {}, {
    d: $data.loading == 1
  }, $data.loading == 1 ? {} : {}, {
    e: $data.loading == 2
  }, $data.loading == 2 ? {} : {}, {
    f: $data.newsArr.length
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/13633/Documents/HBuilderProjects/testUniApp/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
