<template>
  <view>
    <view class="recharge-main">
      <view class="recharge-title">{{i18n.recharge.MyBalance}}</view>
      <view class="uni-flex uni-row" style="margin-top: 40upx">
        <image src="../../../static/img/wallet.png" class="recharge-icon"></image>
        <view class="recharge-value">{{CURRENCY_SYMBOL}} {{walletValue}}</view>
      </view>
    </view>
    <uni-list class="list" style="margin-bottom: 20upx;display: flex;">
      <uni-list-item :title="i18n.recharge.RechargeDetail" thumb="/static/img/order.png" @click="goRechargeHis"></uni-list-item>
    </uni-list>
    <uni-list class="list" style="margin-bottom: 20upx;display: flex;">
      <uni-list-item :title="i18n.recharge.Recharge" thumb="/static/img/recharge.png" @click="goRecharge"></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CONFIG from '@/utils/config.js';
  import { uniList, uniListItem } from '@dcloudio/uni-ui';

  export default {
    name: '',
    data () {
      return {
        CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
        walletValue: ''
      }
    },
    props: {},
    methods: {
      queryWallet() {
        this.$request
          .get('/entry/wxapp/userInfo?id=' + this.userInfo.userId)
          .then(res => {
            this.walletValue = res.user.wallet;
          })
          .catch(error => {
            console.error(error);
          });
      },
      goRechargeHis() {
        uni.navigateTo({
          url: '/pages/more/recharge/rechargeHis'
        });
      },
      goRecharge() {
        uni.navigateTo({
          url: '/pages/more/recharge/index'
        });
      }
    },
    mounted () {
      this.queryWallet()
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: this.systemInfo.color
      });
      uni.setNavigationBarTitle({
        title: this.i18n.recharge.myWallet
      })
    },
    computed: {
      ...mapGetters({
        systemInfo: 'systemInfo',
        userInfo: 'userInfo'
      }),
      i18n() {
        return this.$t('index');
      }
    },
    components: { uniList, uniListItem }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .recharge-main {
    background-color: white;
    padding: 30upx;
    margin: 20upx 0;
    .recharge-title {
      font-size: 30upx;
      line-height: 30upx;
    }
    .recharge-icon {
      height: 70upx;
      width: 70upx;
      margin-right: 20upx
    }
    .recharge-value{
      line-height: 70upx;
      font-size: 70upx;
      flex: 1;
    }
  }


</style>
