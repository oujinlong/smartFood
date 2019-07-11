<template>
	<view class="lang_container">
			<uni-list class="list" style="margin-bottom: 60upx;display: flex;">
       
          <uni-list-item @click="changeLang('cn')" style = "color: lightGray" v-bind:class = "{'colorRed' : lang === 'cn'}" title="简体中文" show-arrow="false" >
          </uni-list-item>
          
           <uni-list-item @click="changeLang('en')" style = "color: lightGray" v-bind:class = "{'colorRed' : lang === 'en'}" title="English" show-arrow="false" >
          </uni-list-item>
			</uni-list>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniList, uniListItem } from '@dcloudio/uni-ui';
import CONFIG from '@/utils/config.js';
export default {
	computed: {
		...mapGetters({
      lang: 'lang'
    }),
    i18n () {  
     return this.$t('index')  
    }  
	},
	components: { uniList, uniListItem },
	data() {
		return {
		};
	},
	mounted() {
    const lang = this.lang
    if (lang !== 'cn' && lang !== 'en') {
      this.$store.commit('setLanguage', 'cn')
    }
    uni.setNavigationBarTitle({
      title: this.i18n.more.ChangeLanguage
    })
	},
	methods: {
    changeLang (lang) {
      this.$store.commit('setLanguage', lang)
      this.$i18n.locale = lang
      uni.showToast({
      	title: this.i18n.more_lang_change_finish,
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack({
        })
      },1000)
    }
	}
};
</script>

<style lang="scss">
.lang_container {
	width: 100vw;
	height: 100vh;
	background-color: #f4f4f4;
}

.colorRed {
  color: red !important;
}
</style>
