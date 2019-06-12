<template>
	<view class="comment-main">
		<view class="comment-star uni-flex uni-row">
			<image src="http://lsl-1257417616.cos.ap-shanghai.myqcloud.com/201905281324451.png" style="width: 100upx;height: 100upx;"></image>
			<view class="text" style="margin: 0upx 20upx;line-height: 100upx;">Score</view>
			<uni-rate :value="starValue" margin="5" @change="onChange" class="comment-rate"></uni-rate>
			<view class="start-value">{{ starValue }} start(s)</view>
		</view>
		<view class="comment-text"><textarea class="text-area" name="textArea" v-model="commentText" placeholder="Give us your advice" /></view>
		<view class="comment-button uni-flex uni-row">
			<view class="store-name">Michelangelo's Restaurant & Bar</view>
			<view class="comment-button-text" @click="submitComment">Submit</view>
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
	},
	data() {
		return {
			storeId: '',
			starValue: 0,
			commentText: '',
			warn: ''
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
				wx.showModal({
					title: 'Waring',
					content: this.warn,
					cancelText: 'Cancel',
					confirmText: 'Yes'
				});
			}
		}
	},
	mounted() {},
	computed: {
		...mapGetters({})
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
