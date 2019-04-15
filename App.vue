<script>
	export default {
		onLaunch: function () {
      console.log('App Launch')
			wx.getUserInfo({
				success: (res) => {
          let userInfo = JSON.parse(res.rawData)
          this.$store.commit('setUserInfo', userInfo)
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

<style>
	/*每个页面公共css */
</style>
