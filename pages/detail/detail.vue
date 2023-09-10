<template>
	<view class="detail">
		<view class="title">{{detail.title}}</view>
		<view class="info">
			<view class="author">编辑：{{detail.author}}</view>
			<view class="time">发布日期：{{detail.posttime}}</view>
		</view>
		<view class="content"><rich-text :nodes="detail.content"></rich-text></view>
		<view class="description">版权声明：本APP所有内容与APP作者无关</view>
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/utils/tool.js'
	
	import {host} from '../../utils/host.js'
	
	export default {
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
				uni.request({
					url: host + "/uniapp/detail",
					data: this.options,
					success: res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: '操作失败',
								icon: 'loading', // 图标类型，可以是'success'、'loading'等
								duration: 1000, // 持续时间（以毫秒为单位）
							});
							return;
						} else {
							res.data.data.posttime = parseTime(res.data.data.posttime);
							res.data.data.content = res.data.data.content.replace(/<img/gi,
								'<img style="max-width:100%;height:auto;display:block"');
							this.detail = res.data.data;
							uni.setNavigationBarTitle({
								title: this.detail.title
							})
							this.saveHistory();
						}

					}
				})
			},



			saveHistory() {

				let historyArr = uni.getStorageSync("historyArr") || [];

				let item = {
					id: this.detail.id,
					classid: this.detail.classid,
					picurl: this.detail.picurl,
					title: this.detail.title,
					looktime: parseTime(Date.now())
				}

				let index = historyArr.findIndex(i => {
					return i.id == this.detail.id;
				});

				if (index >= 0) {
					historyArr.splice(index, 1);
				}

				historyArr.unshift(item);

				uni.setStorageSync("historyArr", historyArr);
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 30rpx;

		.title {
			font-size: 46rpx;
			color: #333
		}

		.info {
			background-color: #f6f6f6;
			padding: 20rpx 10rpx;
			font-size: 22rpx;
			color: #666;
			display: flex;
			justify-content: space-between;
			margin: 30rpx 0;
		}

		.content {
			padding-bottom: 50rpx;

			:deep(img) {
				max-width: 100%;
			}
		}

		.description {
			background-color: #FEF0F0;
			font-size: 26rpx;
			padding: 20rpx;
			color: #F89898;
			line-height: 1.8em;
		}
	}
</style>