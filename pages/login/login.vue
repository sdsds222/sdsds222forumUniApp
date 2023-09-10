<template>
	<view class="container">
		<view v-if="loginState == false">
			<p>用户名：</p>
			<input v-model="username" type="text" placeholder="请输入用户名" />
			<p>密码：</p>
			<input v-model="password" type="text" placeholder="请输入密码" />
			<p>如果用户名不存在则自动注册账号</p>
			<button @tap="login">登录或注册</button>
		</view>
		<view v-if="loginState == true">
			<p class="text">用户：{{username}}<br />您已成功登录</p>
			<button @tap="unlogin">退出登录</button>
		</view>
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
				username: '',
				password: '',
				loginState: false
			};
		},
		onShow() {
			this.username = '';
			this.password = '';
			let jwtToken = uni.getStorageSync("jwt-token");
			uni.request({
					url: host + '/uniapp/test', // 请求的URL
					method: 'POST', // 请求方法
					header: {
						token: jwtToken
					},
					success: res => {
						if (res.data.data == "LOGIN") {
							console.log("登录成功");
							this.loginState = true;
							this.username = parseJwt(jwtToken).username;
						} else {
							console.log("登录失败");
							this.loginState = false;
						}
					}
				}

			);
		},
		methods: {
			login() {
				if (this.username == '' || this.password == '') {
					uni.showModal({
						title: '登录错误',
						content: '账号和密码不能为空',
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
					url: host + '/login', // 请求的URL
					method: 'POST', // 请求方法
					data: {
						username: this.username,
						password: this.password
					},
					success: res => {
						console.log(res.data);
						if (res.data.data == "NOT_LOGIN" || res.data.data == undefined) {
							uni.showToast({
								title: '登陆失败，密码错误',
								icon: 'loading', // 图标类型，可以是'success'、'loading'等
								duration: 1000, // 持续时间（以毫秒为单位）
							});
							this.loginState = false;
						} else {
							uni.showToast({
								title: '登陆成功',
								icon: 'success', // 图标类型，可以是'success'、'loading'等
								duration: 1000, // 持续时间（以毫秒为单位）
							});
							this.loginState = true;
							console.log(res.data.data);
							uni.setStorageSync("jwt-token", res.data.data);
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
						this.loginState = false;

					}
				});
			},
			unlogin() {
				uni.setStorageSync("jwt-token", '');
				this.loginState = false;
			}

		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		flex: 1;

		view {
			input {
				margin-bottom: 20px;
				height: 100rpx;
				border: 1px solid gray;
			}

			button {
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
			.text{
				font-size: 50rpx;
			}
		}

	}
</style>