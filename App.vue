<script>
	export default {
		onLaunch: function () {
      console.log('App Launch')
			wx.getUserInfo({
				success: (res) => {
          let userInfo = JSON.parse(res.rawData)
				},
        fail: (err) => {
        	console.log(err)
        }
			}) 
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import './common/uni.css';
	@import "~@/styles/main.scss";
	@import "~@/styles/base.scss";
	@import "~@/styles/icon.scss";
	@import "~@/styles/animation.scss";
	/*每个页面公共css */
</style>
