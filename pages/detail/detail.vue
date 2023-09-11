<template>
	<view class="detail">
		<view class="title">{{detail.title}}</view>
		<view class="info">
			<view class="author">作者：{{detail.author}}</view>
			<view class="time">发布日期：{{detail.posttime}}</view>
		</view>
		<view class="content"><rich-text :nodes="detail.content"></rich-text></view>
		<view class="description">版权声明：本APP所有内容与APP作者无关</view>
		<view class="info">评论区</view>
		<p>请输入评论内容：</p>
		<view class="url-editor-view">
			<editor class="url-editor" @input="updateComment" type="text" :placeholder="information" />
		</view>
		<view class="buttons">
			<button @tap="publish" class="publish-button">发布</button>
			<button @tap="refresh" class="publish-button">刷新</button>
		</view>

		<view class="comment" v-for="comment in comments" :key="comment.id">
			<view class="user">
				<view>用户：{{comment.username}}</view>
				<view>{{comment.posttime}}</view>
			</view>
			<view class="text">
				<rich-text :nodes="comment.text"></rich-text>
			</view>
		</view>
		<view class="loading" v-show="comments.length">
			<view></view>
			<view v-if="loading == 1">数据加载中......</view>
			<view v-if="loading == 2">没有更多数据了</view>
		</view>

	</view>
</template>

<script>
	import {
		parseTime
	} from '@/utils/tool.js'

	import {
		host
	} from '../../utils/host.js'

	import {
		parseJwt
	} from '../../utils/jwt.js'

	export default {
		data() {
			return {
				options: null,
				detail: {},
				comments: [],
				currentPage: 1,
				loading: 0, //0默认 1加载中 2没有更多了，
				information: '使用<img src="图片链接">文本添加图片，\n使用<br/>文本换行,\n使用<center>居中内容<center/>方式来居中',
				commentText: ''

			};
		},
		onLoad(e) {
			this.options = e;
			this.getDetail();

			this.getCommentsLast();
		},
		onReachBottom() {
			console.log("到底部了");

			if (this.currentPage > 1 && this.loading == 0) {
				this.currentPage--;
				this.loading = 1;
				this.getComments();
			}

		},
		onPullDownRefresh() {
			let that = this;
			uni.startPullDownRefresh({ //开启下拉刷新
				success() {
					setTimeout(function() {
						that.getCommentsLast();
						uni.stopPullDownRefresh(); //停止下拉刷新
					}, 500);
				},
			});
		},
		methods: {

			getComments() {

				uni.request({
					url: host + "/uniapp/comments",
					data: {
						cid: this.options.cid,
						id: this.options.id,
						num: 8,
						page: this.currentPage
					},
					success: res => {

						if (this.currentPage == 1) {
							this.loading = 2;
						} else {
							this.loading = 0;
						}

						res.data.data.reverse();
						for (let i = 0; i < res.data.data.length; i++) {
							res.data.data[i].posttime = parseTime(res.data.data[i].posttime);
							res.data.data[i].text = res.data.data[i].text
								.replace(/<img/gi,
									'<img style="max-width:100%;height:auto;display:block"');
						}
						this.comments = [...this.comments, ...res.data.data];

					}
				})
			},
			getCommentsLast() {
				this.comments = [];

				this.currentPage = 0;
				this.loading = 0;

				uni.request({

					url: host + "/uniapp/commentslast",
					data: {
						num: 8,
						cid: this.options.cid,
						id: this.options.id,
					},
					success: res => {
						if (res.data.code != 0) {
							this.comments = res.data.data.commentsList.reverse();
							for (let i = 0; i < res.data.data.commentsList.length; i++) {
								res.data.data.commentsList[i].posttime = parseTime(res.data.data.commentsList[
									i].posttime);
								res.data.data.commentsList[i].text = res.data.data.commentsList[i].text
									.replace(/<img/gi,
										'<img style="max-width:100%;height:auto;display:block"');
							}
							this.currentPage = res.data.data.page;
							if (this.currentPage == 1) {
								this.loading = 2;
							}
						}

					}

				})
			},
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
					id: this.options.id,
					classid: this.options.cid,
					picurl: this.detail.picurl,
					title: this.detail.title,
					looktime: parseTime(Date.now())
				}

				let index = historyArr.findIndex(i => {
					return i.id == this.options.id;
				});

				if (index >= 0) {
					historyArr.splice(index, 1);
				}

				historyArr.unshift(item);

				uni.setStorageSync("historyArr", historyArr);
			},
			updateComment(event) {
				this.commentText = event.detail.text;
			},
			refresh() {
				this.getCommentsLast();
			},
			publish() {
				if (this.commentText == '') {
					uni.showModal({
						title: '发布失败',
						content: '评论富文本内容为空，无法发送。',
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

				uni.request({
					url: host + '/uniapp/test', // 请求的URL
					method: 'POST', // 请求方法
					header: {
						token: uni.getStorageSync("jwt-token")
					},
					success: res => {
						if (res.data.data == 'LOGIN') {
							console.log("登录成功");
							uni.request({
								url: host + '/uniapp/commentpublish', // 请求的URL
								method: 'POST', // 请求方法
								header: {
									token: uni.getStorageSync("jwt-token")
								},
								data: {
									cid: this.options.cid,
									id: this.options.id,
									text: this.commentText,
									username: parseJwt(uni.getStorageSync("jwt-token")).username
								},
								success: (res) => {
									// 请求成功时的回调函数
									console.log('请求成功', res.data);
									if (res.data.msg == "NOT_LOGIN") {
										uni.showToast({
											title: '用户未登录,发布失败',
											icon: 'loading', // 图标类型，可以是'success'、'loading'等
											duration: 1000, // 持续时间（以毫秒为单位）
										});
										uni.switchTab({
											url: '/pages/login/login'
										})

									} else {
										uni.showToast({
											title: '操作成功',
											icon: 'success', // 图标类型，可以是'success'、'loading'等
											duration: 1000, // 持续时间（以毫秒为单位）
										});

										this.refresh();


									}
								},
								fail: (err) => {
									// 请求失败时的回调函数
									console.error('请求失败', err);
									uni.showToast({
										title: '操作失败',
										icon: 'loading', // 图标类型，可以是'success'、'loading'等
										duration: 1000, // 持续时间（以毫秒为单位）
									});

								}
							});
						} else {
							console.log("登录失败");
							uni.showToast({
								title: '用户未登录',
								icon: 'loading', // 图标类型，可以是'success'、'loading'等
								duration: 1000, // 持续时间（以毫秒为单位）
							});
							uni.switchTab({
								url: '/pages/login/login'
							})
						}
					}
				})






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

		.comment {
			background-color: #f6f6f6;
			margin-bottom: 30rpx;

			.user {
				padding: 10rpx;
				background-color: #e3e3e3;
				display: flex;
				justify-content: space-between;
			}

			.text {
				padding: 30rpx;

			}
		}

		.loading {
			display: flex;
			justify-content: center;
			text-align: center;
			font-size: 26rpx;
			color: #888;
			line-height: 2em;
		}

		.url-editor-view {
			margin-bottom: 30rpx;
		}

		.url-editor {
			border: 1px solid gray;
		}

		.buttons {
			display: flex;
			justify-content: space-between;

			/* 添加按钮的样式 */
			.publish-button {
				width: 30%;
				margin-bottom: 30rpx;
				background-color: #007bff;
				/* 背景颜色 */
				color: #fff;
				/* 文字颜色 */
				padding: 10rpx 20rpx;
				/* 按钮内边距 */
				border: none;
				border-radius: 5rpx;
				cursor: pointer;
			}
		}

	}
</style>