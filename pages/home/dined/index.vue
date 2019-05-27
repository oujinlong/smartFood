<template>
  <view class="container">
    
     <view class="uni-flex uni-row bg_white">
       <view class='flag'> </view>
       <label class="title">Self-taking</label>
     </view>
     
     <view class="uni-flex uni-row bg_white" style="margin-top: 40upx;">
       <view class="title">
         Self-taking time
       </view>
       
       <view>
         <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
            <view class="uni-input">{{date}}</view>
         </picker>
       </view>
     </view>
     
  </view>
</template>

<script>
  require('../../../tools/DateTool.js')
  export default {
    computed: {
      startDate() {
        let date = new Date()
        
        return this.getDate('start');
      },
      endDate() {
          return this.getDate('end');
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  
  .bg_white {
    background-color: #ffffff
  }
  
  .flag {
    background-color: $theme-color;
    width: 10upx;
    height: 60upx;
    margin: 10upx 10upx 10upx 24upx;
  }
  
  .title {
    height: 60upx;
    line-height: 60upx;
    margin: 10upx 10upx 10upx 24upx;
    font-weight: 800;
    font-size: 34upx
  }
</style>
