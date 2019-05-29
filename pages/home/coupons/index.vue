<template>
  <view class="container">
    <view class="coupon_item_no uni-flex uni-row justify-between" @click="disableCouponsHandle">
      <label style="font-size: 36upx;font-weight: 800;">No coupons</label>
      <uni-icon size="20" :type='selectType' color="#68c834" ></uni-icon>
    </view>
    
    <view class="coupon_item_no uni-flex uni-row justify-between"  v-for="(item, index) in coupons" :key='index' @click='itemClickHandle(item)'>
       <view class="uni-flex uni-column justify-center align-center price" style="height: 100%;width: 140upx;">
        <view class="price">
            ${{item.preferential}} 
        </view>
        
        <view style="font-size: 26upx; color: lightGray;">
          {{checkAvisible(item) ? 'available': 'unavailable'}}
        </view>
      </view>
      
      <view>
        <view class="store_name">
          {{item.storeName}}
        </view>
        
        <view class="condition uni-flex uni-row justify-between">
          <view v-if="item.conditions">
             up to ${{item.conditions}} is available
          </view>
          <view v-else>
            No threshold
          </view>
          
          <view style="color: #de6849;" @click.stop="showDetail(item)">
            Detail
          </view>
        </view>
        
        <view class="condition uni-flex uni-row justify-between">
          {{item.startTime}}-{{item.endTime}}
        </view>
        
        <view class="cover_view"  v-if='!checkAvisible(item)'/>
        
      </view>
    </view>
    
    <popup-layer ref="popupRef" :direction="'top'" v-model="showModal">
      <view style="padding: 40upx;">
         <view class="modal_title uni-flex uni-row justify-between">
          <view>
            {{detailCoupon.storeName}}
          </view>
          
          <view style="color: #de6849;">
            -${{detailCoupon.preferential}}
          </view>
        </view>
        
        <view v-if="detailCoupon.conditions">
           <view>up to ${{detailCoupon.conditions}} is available</view>
        </view>
        <view v-else>
          No threshold
        </view>
        <view>{{detailCoupon.startTime}}-{{detailCoupon.endTime}} </view>
        
        <view>
          Instructions: {{detailCoupon.instruction}}
        </view>
      </view>
     
    </popup-layer>

  </view>
</template>

<script>
  import { uniIcon } from '@dcloudio/uni-ui';
  import popupLayer from '../../../components/popup-layer/popup-layer.vue';
  import { mapGetters } from 'vuex'
  export default {
    components: {
      uniIcon,
      popupLayer
    },
    computed: {
      selectType () {
        return this.selfTakingInfo.coupon ? 'circle' : 'checkbox-filled'
      },
      ...mapGetters({
        selfTakingInfo: 'selfTakingInfo'
      }),
      storeInfo () {
        return this.selfTakingInfo.storeInfo
      },
      goodsInfo () {
        return this.selfTakingInfo.goodsInfo
      },
      totalPrice () {
        let price = 0
        this.goodsInfo.forEach((item) => {
          price += item.money * item.count
        })
        return price
      }
    },
    data () {
      return ({
        coupons: [],
        selectCoupon: undefined,
        detailCoupon: undefined,
        showModal: false
      })
    },
    onLoad() {
    	this.getCoupons()
    },
    methods: {
      getCoupons () {
        const userId = 40
        this.coupons = []
        this.$request.get('/entry/wxapp/coupons?userId=' + userId).then(res => {
          if (res.code === 0) {
            this.coupons = [...this.coupons, ...res.myCoupons]
             this.$request.get('/entry/wxapp/voucher?userId=' + userId).then(res => {
              if (res.code === 0) {
                this.coupons = [...this.coupons, ...res.myVoucher]
              }
            }).catch(error => {
              console.log(error)
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      disableCouponsHandle () {
        let info = {...this.selfTakingInfo}
        info.coupon = null
        this.$store.commit('setSelfTakingInfo', info)
        uni.navigateBack({     	
        })
      },
      showDetail (item) {
        this.detailCoupon = item
        this.$refs.popupRef.show()
      },
      checkAvisible (item) {
        return item.preferential <= this.totalPrice && item.storeId.toString() === this.storeInfo.id.toString()
      },
      itemClickHandle (item) {
        const avisible = this.checkAvisible(item)
        if (!avisible) {
          uni.showToast({
          	title: 'Not available',
            icon: 'none',
            duration: 1500
          })
          return
        }
        // 选择优惠券
        let info = {...this.selfTakingInfo}
        info.coupon = item
        this.$store.commit('setSelfTakingInfo', info)
        uni.navigateBack({     	
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  page {
    width: 100vw;
    height: 100vh;
    background-color: #e5e5e5
  }
  
  .coupon_item_no {
    padding: 20upx;
    background-color: #ffffff;
    margin: 25upx;
    position: relative;
  }
  
  .price {
    font-size: 50upx;
    color: #de6849;
  }
  
  .store_name {
    font-size: 32upx;
    font-weight: 800;
    text-align: center;
  }
  
  .condition {
    color: lightgrey;
    font-size: 28upx;
  }
  .modal_title {
    text-align: left;
    font-size: 32upx;
    color: #000000;
    font-weight: 800;
  }
  
  .disable {
    background-color: red;
  }
  .cover_view {
    background-color: rgba(211,211,211,0.5);
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    position: absolute;
    left: 0;
    top: 0;
  }
  .active {
    border: #de6849 1.6upx solid;
  }
</style>
