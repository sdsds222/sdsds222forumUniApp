<template>
	<view class="home">
		<scroll-view scroll-x="true" class="navscroll">
			<view class="item" :class="index==navIndex?'active':''" v-for="(item,index) in navArr" :key="item.id"
				@tap="clickNav(index,item.id)">{{item.classname}}
			</view>
		</scroll-view>
		<view class="content">
			<div class="row" v-for="item in newsArr" :key="item.id">
				<newsbox :item="item" @tap="goDetail(item)">
					这是一条新闻。
				</newsbox>
			</div>
		</view>
		<view class="nodata" v-if="newsArr.length == 0">
			<image src="../../static/images/nodata.png" mode="widthFix"></image>
		</view>
		<view class="loading" v-show="newsArr.length">
			<view></view>
			<view v-if="loading == 1">数据加载中......</view>
			<view v-if="loading == 2">没有更多数据了</view>
		</view>
	</view>
</template>

<script>
	import {
		host
	} from '../../utils/host.js'
	export default {
		data() {
			return {
				title: 'Hello',
				navIndex: 0,
				navArr: [],
				newsArr: [],
				currentPage: 0,
				nowId: 1,
				loading: 0 //0默认 1加载中 2没有更多了
			}
		},
		onLoad() {
			this.getNavData();

			this.getNewsLast();


		},
		onShow() {
			if (uni.getStorageSync("jwt-token") == '') {
				uni.setNavigationBarTitle({
					title: "首页(未登录)"
				});
			} else {

				uni.setNavigationBarTitle({
					title: "首页"
				});
			}
		},
		onReachBottom() {
			console.log("到底部了");

			if (this.currentPage > 1 && this.loading == 0) {
				this.currentPage--;
				this.loading = 1;
				this.getNewsData();
			}


		},
		onPullDownRefresh() {
			let that = this;
			uni.startPullDownRefresh({ //开启下拉刷新
				success() {
					//成功回调
					setTimeout(function() {
						that.getNewsLast();
						uni.stopPullDownRefresh(); //停止下拉刷新
					}, 500);
				},
			});
		},
		methods: {
			getNewsLast() {
				this.newsArr = [];

				this.currentPage = 0;
				this.loading = 0;
				uni.request({

					url: host + "/uniapp/newslistlast",
					data: {
						num: 8,
						cid: this.nowId,
					},
					success: res => {
						if (res.data.code != 0) {
							this.newsArr = res.data.data.newsList.reverse();
							this.currentPage = res.data.data.page;
							if (this.currentPage == 1) {
								this.loading = 2;
							}
						}
					}

				})
			},
			//点击导航切换
			clickNav(index, id) {
				let that = this;
				setTimeout(function() {
					that.navIndex = index;

					this.loading = 0;

					that.nowId = id;
					that.getNewsLast();
				}, 50);

			},

			//跳转到详情页事件

			goDetail(item) {
				uni.navigateTo({
					url: `/pages/detail/detail?cid=${item.classid}&id=${item.id}`,
					animationType: 'pop-in'
				})
			},

			//获取导航列表数据
			getNavData() {
				uni.request({
					url: host + "/uniapp/navlist",
					success: res => {
						if (res.data.code != 0) {
							this.navArr = res.data.data;
						}
					}
				})
			},


			//获取新闻列表数据

			getNewsData() {
				uni.request({

					url: host + "/uniapp/newslist",
					data: {
						num: 8,
						cid: this.nowId,
						page: this.currentPage
					},
					success: res => {
						if (res.data.code != 0) {
							if (this.currentPage == 1) {
								this.loading = 2;
							} else {
								this.loading = 0;
							}
							res.data.data.reverse();
							this.newsArr = [...this.newsArr, ...res.data.data];

						}
					}


				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navscroll {
		height: 100rpx;
		background-color: #F7F8FA;
		white-space: nowrap;
		position: fixed;
		top: var(--window-top);
		left: 0;
		z-index: 10;

		:deep(::-webkit-scrollbar) {
			width: 4px !important;
			height: 1px !important;
			overflow: auto !important;
			background: transparent !important;
			-webkit-appearance: auto !important;
			display: block;
		}

		.item {
			font-size: 40rpx;
			display: inline-block;
			line-height: 100rpx;
			padding: 0 30rpx;
			color: #333;

			&.active {
				color: #31C27C
			}
		}
	}

	.content {
		padding: 30rpx;
		padding-top: 130rpx;

		.row {
			//border-bottom: 1rpx dashed #000000;
			padding: 20rpx 0;
		}
	}

	.nodata {
		height: 60vh;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.loading {
		display: flex;
		justify-content: center;
		text-align: center;
		font-size: 26rpx;
		color: #888;
		line-height: 2em;
	}
</style>