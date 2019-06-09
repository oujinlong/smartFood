<template>
	<view class="about-us-main">
		<view class="about-us-content">
			<view class="about-us-title">
				<view class="hx"></view>
				<view class="hxwz">About Us</view>
				<view class="hx"></view>
			</view>
			<view style="font-size:26upx;color:#666;"><rich-text :nodes="storeInfo.details"></rich-text></view>
		</view>

		<view class="about-us-content" v-if="storeInfo.storeVideo">
			<view class="about-us-title">
				<view class="hx"></view>
				<view class="hxwz">商家视频</view>
				<view class="hx"></view>
			</view>
			<view><video :src="storeInfo.storeVideo"></video></view>
			<video :src="src"></video>
		</view>

		<view class="about-us-content">
			<view class="about-us-title">
				<view class="hx"></view>
				<view class="hxwz">Environment</view>
				<view class="hx"></view>
			</view>
			<view class="xztpul">
				<view class="scimg-box" v-for="(environmentItem, index) in environmentList" :key="index"><image class="scimg" :src="environmentItem"></image></view>
			</view>
		</view>

		<view class="about-us-content">
			<view class="about-us-title">
				<view class="hx"></view>
				<view class="hxwz">Awards</view>
				<view class="hx"></view>
			</view>
			<view class="xztpul">
				<view class="scimg-box" v-for="(awardsItem, index) in awardsList" :key="index"><image class="scimg" :src="awardsItem"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: '',
	onLoad(e) {
		this.storeId = e.storeId || '';
	},
	data() {
		return {
			storeId: '',
			storeInfo: {},
			environmentList: [],
			awardsList: [],
			src:
				'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4'
		};
	},
	props: {},
	methods: {
		queryStoreInfo() {
			this.environmentList = [];
			this.awardsList = [];
			const param = {
				userId: 40,
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/store', {
					data: param
				})
				.then(res => {
					this.storeInfo = res.store;
					let environment = res.store.environment.split(',');
					let awards = res.store.yyzz.split(',');
					if (environment && environment.length > 0) {
						environment.forEach(environmentItem => {
							if (environmentItem !== '') {
								this.environmentList.push(environmentItem);
							}
						});
					}
					if (awards && awards.length > 0) {
						awards.forEach(awardsItem => {
							if (awardsItem !== '') {
								this.awardsList.push(awardsItem);
							}
						});
					}
				})
				.catch(error => {
					console.error('error:', error);
				});
		}
	},
	mounted() {
		this.queryStoreInfo();
	},
	computed: {
		...mapGetters({})
	},
	components: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
.about-us-main {
	.about-us-content {
		background-color: white;
		padding: 20upx;
		margin-bottom: 20upx;
		text-align: center;

		&:last-child {
			margin-bottom: 20upx;
		}
		.about-us-title {
			color: #333;
			width: 100%;
			height: auto;
			padding: 5px 15px;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			.hx {
				height: 1px;
				background: #d5d5d5;
				width: 120rpx;
			}
			.hxwz {
				margin: 0 15rpx;
				font-size: 30rpx;
			}
		}
		.xztpul {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
		}
		.scimg-box {
			width: 33.3%;
			margin: 10upx 0upx;
			padding: 0 10upx;
			box-sizing: border-box;
		}
		.scimg {
			width: 220upx;
			height: 220upx;
			margin: 0 auto;
			border-radius: 6upx;
		}
	}
}
</style>
