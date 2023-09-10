<template>
	<view class="publish-content">
		<view class="container">
			<p>标题：</p>
			<!-- 标题输入框 -->
			<input v-model="title" type="text" placeholder="请输入标题" />
			<p>封面图床外链url：</p>
			<view class="url-editor-view">
				<editor class="url-editor" @input="updateUrl" type="text" placeholder="请输入封面图片的链接url" />
			</view>
			<p>要发布到的分区板块：</p>
			<!-- 板块选择框 -->
			<picker @change="handlePickerChange" mode="selector" :range="classOptions">
				<view class="picker">
					{{ classOptions[classId] }}
				</view>
			</picker>
			<p>富文本内容：</p>
			<view class="editor">
				<!-- 富文本编辑器 -->
				<editor class='content-editor' @input="updateContent" :show-img-size="true" :content="content"
					:placeholder="'在此区域输入文本内容\n'+information" />
			</view>
			<!-- 发布按钮 -->
		</view>
		<p style="margin:30rpx">{{information}}</p>
		<button @tap="publish" class="publish-button">发布</button>
	</view>
</template>

<script>
	import {
		parseJwt
	} from '../../utils/jwt.js'
	import {host} from '../../utils/host.js'
	export default {
		data() {
			return {
				title: '',
				classId: 0,
				classOptions: [], // 用于下拉选择的板块列表
				content: '', // 富文本编辑器内容
				picurl: '',
				navArr: [],
				author: '',
				jwtToken: '',
				information: '使用<img src="图片链接">文本添加图片，\n使用<br/>文本换行,\n使用<center>居中内容<center/>方式来居中'
			};
		},
		onShow() {

			this.navArr = [];
			this.classOptions = [];

			this.jwtToken = uni.getStorageSync("jwt-token");
			if (this.jwtToken != '') {
				this.author = parseJwt(this.jwtToken).username;
			} else {
				uni.showToast({
					title: '用户未登录',
					icon: 'loading', // 图标类型，可以是'success'、'loading'等
					duration: 1000, // 持续时间（以毫秒为单位）
				});
				uni.switchTab({
					url: '/pages/login/login'
				})
			}

			uni.request({
				url: host + "/uniapp/navlist",
				success: res => {
					this.navArr = res.data.data;
					for (let i = 0; i < this.navArr.length; i++) {
						this.classOptions.push(this.navArr[i].classname);
					}
				}
			})
		},
		methods: {
			publish() {
				if (this.title == '' || this.content == '' || this.author == '') {
					uni.showModal({
						title: '发布失败',
						content: '标题、用户名、富文本内容为空，无法发送。',
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
					url: host + '/uniapp/publish', // 请求的URL
					method: 'POST', // 请求方法
					header: {
						token: this.jwtToken
					},
					data: {
						title: this.title,
						cid: this.classId + 1,
						content: this.content,
						picurl: this.picurl == '' ? 'error' : this.picurl,
						author: this.author
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

			},
			handlePickerChange(event) {
				// 手动更新classId
				this.classId = event.detail.value;
			},
			updateContent(event) {
				// 当编辑器内容发生变化时，更新 content 变量
				this.content = event.detail.text;
			},
			insertImage() {
				this.editorContext.insertImage({
					src: this.imageUrl,
					width: '100%', // 设置图片宽度，可以根据需要调整
				});
			},
			updateUrl(event) {
				this.picurl = event.detail.text;
				this.picurl = this.picurl.replace(/(\r\n|\r|\n)/g, "");;
			}

		},
	};
</script>

<style>
	.publish-content {
		display: flex;
		/* 使用 Flex 布局 */
		flex-direction: column;
	}

	.container {
		padding: 20px;
		flex: 1;
	}

	input {
		margin-bottom: 20px;
		height: 100rpx;
		border: 1px solid gray;
	}

	picker {
		margin-bottom: 20px;
		height: 50rpx;
		border: 1px solid gray;
	}

	.picker {
		text-align: center;
	}

	.url-editor {
		border: 1px solid gray;
	}

	.content-editor {
		min-height: 200rpx;
	}

	.editor {
		border: 1px solid gray;
	}


	/* 添加按钮的样式 */
	.publish-button {
		width: 80%;
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
</style>