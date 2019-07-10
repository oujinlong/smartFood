<template>
  <view class="login_container">
    <text class="title" style="margin-top: 20px;">
      Pavilion KL
    </text>
    
    <image src="/static/logo.png" class="logo" style="margin-top: 40upx;"/>
    
    <view class="login_btn" style="margin-top: 80upx;" @click="loginClickHandle">
      Login
    </view>
  </view>
</template>

<script>
	export default {
    mounted() {
    },
    methods: {
      loginClickHandle() {
        uni.login({
          provider: 'weixin',
          success: function (loginRes) {
            console.log(loginRes.authResult);
            // 获取用户信息
            uni.getUserInfo({
              provider: 'weixin',
              success: function (infoRes) {
                console.log(infoRes.userInfo);
              }
            });
          }
        });
      }
    }
	}
</script>

<style lang="scss">
  .login_container {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1 100%;
    justify-content: center;
    height: 100%
  }
  .logo {
    width: 180upx;
    height: 180upx;
  }
  .login_btn {
    width: calc(100% - 80upx);
    height: 100upx;
    text-align: center;
    line-height: 100upx;
    border-radius: 50upx;
    background-color: $app-theme-color;
    color: white;
    font-size: 45upx;
    font-weight: 600;
  }
  .title {
    font-size: 50upx;
    font-weight: 400;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: $app-theme-color;
    text-align: center;
  }
</style>
