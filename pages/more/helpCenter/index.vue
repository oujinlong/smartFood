<template>
	<view>
		<uni-collapse>
			<uni-collapse-item :show-animation="true" v-for="(item, index) in helpList" :key="index" :title="item.question">
				<view style="padding: 30upx;">{{item.answer}}</view>
				</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui';

export default {
	name: '',
	data() {
		return {
			helpList: []
		};
	},
	props: {},
	methods: {
		getHelp() {
			this.$request
				.get('/entry/wxapp/getHelp')
				.then(res => {
					this.helpList = res.helpList;
				})
				.catch(error => {
					console.error(error);
				});
		}
	},
	mounted() {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
    uni.setNavigationBarTitle({
      title: this.i18n.more.HelpCenter
    })
		this.getHelp();
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo'
		}),
    i18n () {
      return this.$t('index')
    }
  },
	components: {
		uniCollapse,
		uniCollapseItem
	}
};
</script>

<style lang="scss" type="text/scss" scoped></style>
