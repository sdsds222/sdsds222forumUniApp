<template>
	<view class="newsbox"><!--@click="click"用于微信小程序-->
		<view class="pic">
			<image :src="item.picurl" @error="handleImageError"></image>
		</view>
		<view class="text">
			<view class="title">{{item.title}}</view>
			<view class="info" v-if="!item.looktime">
				<text>{{item.author}}</text>
				<text>{{item.hits}}浏览量</text>
			</view>
			<div class="info" v-else>
				<text>{{item.looktime}}</text>
			</div>
		</view>
	</view>
</template>

<script>
	
	import {host} from '../../utils/host.js'
	
	export default {
		name: "newsbox",
		props: {
			item: {
				type: Object,
				default () {
					return {
						title: "组件内默认标题",
						author: "张三",
						hits: 1,
						picurl: "../../static/images/0.jpg",
						looktime: "2023-09-07 15:47:03"
					}
				}
			}
		},
		data() {
			return {};
		},
		methods: {
			click() {
				this.$emit('click');
			},
			handleImageError(event) {
				this.item.picurl = "../../static/images/nopic.jpg";
			}
		}
	}
</script>

<style lang="scss">
	.newsbox {
		display: flex;

		.pic {
			width: 230rpx;
			height: 160rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.text {
			//border: 1px solid red;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 20rpx;
			width: 100px;

			.title {
				font-size: 38rpx;
				color: #333;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.info {
				font-size: 26rpx;
				color: #999;

				text {

					padding-right: 30rpx;
				}
			}
		}
	}
</style>