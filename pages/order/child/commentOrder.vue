<template>
	<view class="comment-main">
		<view class="comment-star uni-flex uni-row">
			<!-- <view class="text">横向布局-自动宽度</view> -->
			<view class="text" style="margin-right: 20upx;">Score</view>
			<uni-rate :value="starValue" :margin="5" @change="onChange"></uni-rate>
			<view class="start-value">{{starValue}} start(s)</view>
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
			starValue: 0
		};
	},
	props: {},
	methods: {
		onChange(e) {
			this.starValue = e.value
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
			color:#999999;
		}
	}
}
</style>
