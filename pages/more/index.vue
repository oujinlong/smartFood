<template>
  <view class="more_container">
    <!-- 未登录状态 强制登录 -->
    <view class="invite_login" v-if="hasLogin === false">
      <view style="margin-top: 40upx;">
        Hello, tourists
      </view>
      <view style="margin-top: 40upx;">
        In order to give you a better shopping experience, we invite you to log in before making a purchase.
      </view>
      
      <button open-type="getUserInfo" @getuserinfo="getUserInfoHandle" class="login_btn" style="margin-top: 100upx;">
        Login
      </button>
    </view>
    
    <!-- 已登陆 -->
    <view v-else>
      
      <!-- 红色 title view -->
      <view class="title_view">
        <image v-bind:src="userInfo.avatarUrl" class="avatar" style="margin-left: 40upx;"></image>
        <text class="nickName" style="margin-left: 30upx;">
          {{userInfo.nickName}}
        </text>
      </view>
      
      <!-- 钱包 -->
      <view class="wallet" style="margin-bottom: 40upx;">
        <view>
          <text style="font-size: 24upx;">
            $
          </text>
          <text style="font-size: 46upx; color: #f8ce5f;">
            708
          </text>
        </view>
        
        <view>
          <text style="font-size: 26upx;">
            Wallet
          </text>
        </view>
      </view>
      
      <uni-list class="list">
          <uni-list-item title="Online Service" thumb="/static/img/online_service.png" @click="serviceHandle"></uni-list-item>
          <uni-list-item title="Help Center" thumb="/static/img/help_center.png" @click="helpHandle"></uni-list-item>
      </uni-list>
      
    </view>
  </view>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {uniList, uniListItem} from '@dcloudio/uni-ui'
  export default {
  computed: {
    ...mapGetters([
      'userInfo',
      'hasLogin'
    ])
  },
  components: {uniList,uniListItem},
  data () {
    return ({
    })
  },
  mounted () {
    console.log('more user info')
    console.log(this.userInfo)
  },
  methods: {
    getUserInfoHandle(e) {
      console.log(e)
      let userInfo = e.mp.detail.rawData
      if (userInfo){
        //用户按了允许授权按钮
        userInfo = JSON.parse(userInfo)
        this.$store.commit('setUserInfo', userInfo)
      } else {
        //用户按了拒绝按钮
        console.log('用户按了拒绝按钮')
      }
    },
    // 点击 online service
    serviceHandle () {
      uni.showToast({
      	duration:1000,
        title: 'Online Service',
        icon: 'none'
      })
    },
    // 点击 Help Center
    helpHandle () {
      uni.showToast({
      	duration:1000,
        title: 'Help Center',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
  .more_container {
    width: 100vw;
    height: 100vh;
    background-color: #F4F4F4;
  },
  .invite_login {
    display: flex;
    flex-direction: column;
    padding: 40upx;
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
  .title_view {
    background-color: $app-theme-color;
    width: 100vw;
    height: 160upx;
    display: flex;
    flex-direction: row;
    align-items: center;
    .avatar {
      width: 120upx;
      height: 120upx;
      border-radius: 60upx;
    }
    
    .nickName {
      color: white;
      font-size: 40upx;
    }
  }
  
  .wallet {
    width: 100vw;
    height: 130upx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
