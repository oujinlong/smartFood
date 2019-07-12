<template>
        <map scale="16" style="width: 100%; height: 100vh;" :latitude="latitude" :longitude="longitude" :markers="covers">
                </map>
</template>

<script>
  import {mapGetters} from 'vuex'
  
  export default {
    data () {
      return ({
        latitude: 39.909,
        longitude: 116.39742,
        covers: []
      })
    },
    computed: {
      ...mapGetters({
        storeColor: 'storeColor'
      }),
      i18n() {
      	return this.$t('index');
      }
    },
    methods: {
      
    },
    onLoad(e) {
      uni.setNavigationBarTitle({
      	title: this.i18n.map
      })
      if (this.storeColor) {
       wx.setNavigationBarColor({
       	frontColor: '#ffffff',
         backgroundColor: this.storeColor
        })
      }
      const {lat, lon, name, address} = e
      console.log(e)
      this.latitude = parseFloat(lat)
      this.longitude = parseFloat(lon)
      this.covers = [{
            latitude: this.latitude,
            longitude: this.longitude,
            iconPath: '/static/location.png',
            title: 'Plazza',
            callout: {
              content: name + '\n' + address,
              padding: 10,
              display: 'ALWAYS',
              borderRadius: 8
            }
        }]
    }
  }
</script>

<style>
</style>
