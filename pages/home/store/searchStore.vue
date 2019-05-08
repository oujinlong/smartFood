<template>
	<view class="search-container padding-xl">
		<input class="search-input" confirm-type="search" focus placeholder="Key Search" placeholder-class="search-placeholder-class"
		 @confirm="searchStoreClick" />
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: '',
		data() {
			return {}
		},
		props: {},
		methods: {
			searchStoreClick: function(event) {
				console.log(event.target.value)
			}
		},
		mounted() {},
		computed: {
			...mapGetters({})
		},
		components: {}
	}
</script>

<style lang="scss">
	.search-container {
		background-color: $app-theme-color;
		text-align: center;
		.search-input {
			background-color: #ffffff;
			padding: 20upx;
			height: 80upx;
			line-height: 80upx;
			border-radius: 40upx;
		}

		.search-placeholder-class {
			line-height: 80upx;
		}
	}
</style>
