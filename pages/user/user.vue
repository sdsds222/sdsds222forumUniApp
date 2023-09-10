<template>
	<view class="user">
		<div class="top">
			<image src="../../static/images/history.png" mode=""></image>
			<div class="text">浏览历史</div>
		</div>
		<div class="content">
			<div class="row" v-for="item in listArr" :key="item">
				<newsbox :item="item" @tap="goDetail(item)">
					这是一条新闻。
				</newsbox>
			</div>
		</div>
		<div class="nohistory" v-if="!listArr.length">
			<image src="../../static/images/nohis.png" mode="widthFix"></image>
			<view class="text">暂无浏览记录</view>
		</div>
	</view>
</template>

<script>
	
	import {host} from '../../utils/host.js'
	
	
	export default {
		data() {
			return {
				listArr: []
			};
		},
		onShow() {
			this.getDate();
			uni.pageScrollTo({
				scrollTop: 0, //滚动到页面的目标位置
				duration: 300
			});

		},
		methods: {
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/detail/detail?cid=${item.classid}&id=${item.id}`
				})
			},

			getDate() {
				let historyArr = uni.getStorageSync("historyArr") || [];
				this.listArr = historyArr;
			}
		}
	}
</script>

<style lang="scss">
	.user {
		.top {
			padding: 50rpx 0;
			background-color: #F8F8F8;
			color: #555;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 150rpx;
				height: 150rpx;
			}

			.text {
				font-size: 38rpx;
				padding-top: 20rpx;
			}
		}


		.content {
			padding: 30rpx;

			.row {
				border-bottom: 1rpx dashed #000000;
				padding: 20rpx 0;
			}
		}

		.nohistory {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 400rpx;
			}

			.text {
				font-size: 26rpx;
			}
		}
	}
</style>