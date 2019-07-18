<template>
  <view>
    <view class="recharge-main">
      <view class="recharge-title">{{i18n.more.myScore}}</view>
      <view class="uni-flex uni-row" style="margin-top: 40upx">
        <image src="../../../static/img/scores.png" class="recharge-icon"></image>
        <view class="recharge-value">{{score}}</view>
      </view>
    </view>
    <scroll-view scroll-y @scrolltolower="loadMore()" class="score-content" v-if="scoreList.length > 0">
      <view v-for="(scoreItem,scoreIndex) in scoreList" :key="rechargeIndex" class="recharge-item uni-flex uni-row" style="justify-content: space-between;">
        <view>
          <view class="recharge-name">{{scoreItem.note}}</view>
          <view class="recharge-time">{{scoreItem.ceratedTime}}</view>
        </view>
        <view style="display: flex; justify-content: center;align-items: center;">
          <view :class="[scoreItem.type == 1 ? 'green-icon' : 'red-icon']">
            <span v-if="scoreItem.type === 1" class="green-icon">+</span>
            <span v-else  class="red-icon">-</span>
            {{scoreItem.score}}
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="no_data_container uni-flex uni-column score-content" style="background-color: white" v-else>
      <image src="../../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
      <view style="justify-content:center;font-size: 40upx;margin-top: 20upx ">{{ i18n.Nodata }}</view>
    </view>
  </view>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: '',
    onLoad(e) {
      this.score = e.score || 0;
    },
    data () {
      return {
        score: 0,
        curpage: 1,
        pageSize: 15,
        scoreList: [],
        totalPage: 0
      }
    },
    props: {},
    methods: {
      jfmx() {
        this.scoreList = []
        let param = {
          curpage: this.curpage,
          pageSize: this.pageSize,
          userId: this.userInfo.userId
        }
        this.$request
          .get('/entry/wxapp/jfmx', {
            data: param
          })
          .then(res => {
            this.scoreList = res.page.list;
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
          .get('/entry/wxapp/jfmx', {
            data: param
          })
          .then(res => {
            this.scoreList = [...this.scoreList, ...res.page.list];
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
      uni.setNavigationBarTitle({
        title: this.i18n.more.ScoreDetails
      })
      this.jfmx()
    },
    computed: {
      ...mapGetters({
        systemInfo: 'systemInfo',
        userInfo: 'userInfo'
      }),
      i18n() {
        return this.$t('index');
      }    },
    components: {}
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
  .score-content {
    height: calc(100vh - 240upx);
  }
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
