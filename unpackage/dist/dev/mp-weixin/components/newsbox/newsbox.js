"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "newsbox",
  props: {
    item: {
      type: Object,
      default() {
        return {
          title: "组件内默认标题",
          author: "张三",
          hits: 1,
          picurl: "../../static/images/0.jpg",
          looktime: "2023-09-07 15:47:03"
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    click() {
      this.$emit("click");
    },
    handleImageError(event) {
      this.item.picurl = "../../static/images/nopic.jpg";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.item.picurl,
    b: common_vendor.o((...args) => $options.handleImageError && $options.handleImageError(...args)),
    c: common_vendor.t($props.item.title),
    d: !$props.item.looktime
  }, !$props.item.looktime ? {
    e: common_vendor.t($props.item.author),
    f: common_vendor.t($props.item.hits)
  } : {
    g: common_vendor.t($props.item.looktime)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/13633/Documents/HBuilderProjects/testUniApp/components/newsbox/newsbox.vue"]]);
wx.createComponent(Component);
