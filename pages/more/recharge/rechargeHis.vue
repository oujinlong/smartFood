<template>
  <view>
    <scroll-view scroll-y @scrolltolower="loadMore()" style="height: 100vh;">
      <view v-for="(rechargeItem,rechargeIndex) in rechargeList" :key="rechargeIndex" class="recharge-item uni-flex uni-row" style="justify-content: space-between;">
        <view>
          <view class="recharge-name">{{rechargeItem.note}}</view>
          <view class="recharge-time">{{rechargeItem.time}}</view>
        </view>
        <view style="display: flex; justify-content: center;align-items: center;">
          <view :class="[rechargeItem.type == 1 ? 'green-icon' : 'red-icon']">
            <span v-if="rechargeItem.type === 1" class="green-icon">+</span>
            <span v-else  class="red-icon">-</span>
            {{rechargeItem.money}} {{CURRENCY_SYMBOL}}
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="no_data_container uni-flex uni-column" style="height: 100vh;" v-if="rechargeList.length == 0">
      <image src="../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
      <view style="justify-content:center;font-size: 40upx;margin-top: 20upx ">{{ i18n.Nodata }}</view>
    </view>
  </view>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CONFIG from '@/utils/config.js';

  export default {
    name: '',
    data () {
      return {
        CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
        curpage: 1,
        pageSize: 15,
        rechargeList: [],
        totalPage: 0
      }
    },
    props: {},
    methods: {
      qbmx() {
        let param = {
          curpage: this.curpage,
          pageSize: this.pageSize,
          userId: this.userInfo.userId
        }
        this.$request
          .get('/entry/wxapp/qbmx', {
            data: param
          })
          .then(res => {
            this.rechargeList = res.page.list;
            this.totalPage = res.page.totalPage
            this.curpage = res.page.currPage
          })
          .catch(error => {
            console.error(error);
          });
      },
      loadMore() {
        if (this.curpage < this.totalPage) {
          this.curpage++;
          this.pageChange(this.curpage);
        }
      },
      pageChange(page) {
        let param = {
          curpage: page,
          pageSize: this.pageSize,
          userId: this.userInfo.userId
        }
        this.$request
          .get('/entry/wxapp/qbmx', {
            data: param
          })
          .then(res => {
            this.rechargeList = [...this.rechargeList, ...res.page.list];
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    mounted () {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: this.systemInfo.color
      });
      this.qbmx()
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
    components: {}
  }
</script>

<style lang="scss" type="text/scss" scoped>
.recharge-item {
  background-color: white;
  padding: 20upx;
  margin-bottom: 5upx;
  .recharge-name {
    font-weight: bold;
    font-size: 32upx;
  }
  .recharge-time {
    font-size: 24upx;
  }
  .green-icon {
    color: green;
    font-size:36upx;
  }
  .red-icon {
    color: red;
    font-size:36upx;
  }
}

</style>
