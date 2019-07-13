<template>
	<view class="comment-main">
		<view class="comment-star uni-flex uni-row">
			<image :src="storeInfo.logo" style="width: 100upx;height: 100upx;"></image>
			<view style="line-height: 100upx;margin-left: 20upx;font-size: 30upx;">{{ storeInfo.name }}</view>
		</view>
		<view class="comment-star uni-flex uni-row">
			<view class="text" style="margin: 0upx 20upx;line-height: 100upx;">{{ i18n.comment.Score }}</view>
			<uni-rate :value="starValue" margin="5" @change="onChange" class="comment-rate"></uni-rate>
			<view class="start-value">{{ starValue }} {{ i18n.comment.start }}</view>
		</view>
		<view class="comment-text"><textarea class="text-area" name="textArea" v-model="commentText" :placeholder="i18n.comment.Giveusyouradvice" /></view>
		<view class="comment-button uni-flex uni-row">
			<view class="store-name">
        {{ i18n.comment.Commentget }}
				<span v-bind:style="{ color: storeColor }" style="font-size: 40upx;padding: 0 10upx;">{{ point }}</span>
        {{ i18n.comment.point }}
			</view>
			<view class="comment-button-text" @click="submitComment" v-bind:style="{ backgroundColor: storeColor }">{{ i18n.comment.Submit }}</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniRate } from '@dcloudio/uni-ui';
export default {
	name: '',
	onLoad(e) {
		this.storeId = e.storeId || '';
		this.orderId = e.orderId || '';
	},
	data() {
		return {
			storeId: '',
			orderId: '',
			orderNum: '',
			starValue: 0,
			commentText: '',
			warn: '',
			point: '',
			storeInfo: {},
			storeColor: '',
			orderInfo: {}
		};
	},
	props: {},
	methods: {
		onChange(e) {
			this.starValue = e.value;
		},
		submitComment() {
			var flag = true;
			if (this.starValue === 0) {
				this.warn = 'Please select a rating!';
			} else {
				flag = false;
			}
			if (flag == true) {
				uni.showToast({ title: this.warn, icon: 'none' });
			} else {
				const param = {
					score: this.starValue,
					userId: this.orderInfo.userId,
					storeId: this.storeId,
					orderId: this.orderId,
					orderNum: this.orderInfo.orderNum,
					point: this.point,
					content: this.commentText
				};
				this.$request
					.get('/entry/wxapp/pl', {
						data: param
					})
					.then(res => {
						wx.showToast({
							title: 'Comment Succeed',
							icon: 'success',
							duration: 1000
						});
						setTimeout(function() {
							uni.reLaunch({
								url: '/pages/order/index?tabIndex=' + 1
							});
						}, 1000);
					})
					.catch(error => {
						console.error('error:', error);
					});
			}
		},
		queryPoint() {
			this.$request
				.get('/entry/wxapp/system')
				.then(res => {
					this.point = res.system.integral;
					console.log(this.point);
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryStoreInfo() {
			const param = {
				userId: this.orderInfo.userId,
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/store', {
					data: param
				})
				.then(res => {
					this.storeInfo = res.store;
					this.storeColor = res.store.color;
					wx.setNavigationBarColor({
						frontColor: '#ffffff',
						backgroundColor: res.store.color
					});
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryOrderInfo() {
			const param = {
				orderId: this.orderId
			};
			this.$request
				.get('/entry/wxapp/myorderInfo', {
					data: param
				})
				.then(res => {
					this.orderInfo = res.orderInfo;
					this.queryStoreInfo();
				})
				.catch(error => {
					console.error('error:', error);
				});
		}
	},
	mounted() {
		this.queryPoint();
		this.queryOrderInfo();
	},
	computed: {
		...mapGetters({}),
    i18n() {
      return this.$t('index');
    }
	},
	components: {
		uniRate
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.comment-main {
	.comment-star {
		margin: 20upx 0upx;
		padding: 30upx;
		background-color: white;
		.start-value {
			margin-left: 15upx;
			color: #999999;
			line-height: 100upx;
		}
		.comment-rate {
			/deep/ .uni-icon {
				line-height: 100upx;
			}
		}
	}
	.comment-text {
		padding: 20upx;
		background-color: white;
		.text-area {
			padding: 20upx;
			width: 100%;
			background-color: #f8f8f8;
		}
	}
	.comment-button {
		height: 90upx;
		width: 100%;
		display: flex;
		position: fixed;
		bottom: 0upx;
		text-align: center;
		.store-name {
			flex: 1;
			line-height: 90upx;
			background-color: #434343;
			color: white;
		}
		.comment-button-text {
			width: 200upx;
			line-height: 90upx;
			color: white;
			background-color: #ce2029;
		}
	}
}
</style>
