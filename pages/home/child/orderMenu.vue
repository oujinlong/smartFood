<template>
	<view>aaa</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'

	export default {
		name: '',
		data() {
			return {
				dishesList: [{
						'image': '',
						'name': '蟹肉沙拉',
						'price': '26.00',
						'discountPrice': '20.00',
						'diccount': '8',
						'actuallySaled': '1'
					},
					{
						'image': '',
						'name': '土豆沙拉',
						'price': '26.00',
						'discountPrice': '20.00',
						'diccount': '8',
						'actuallySaled': '4'
					},
					{
						'image': '',
						'name': '炸猪排',
						'price': '26.00',
						'discountPrice': '20.00',
						'diccount': '8',
						'actuallySaled': '5'
					}
				]
			}
		},
		props: {},
		methods: {},
		mounted() {},
		computed: {
			...mapGetters({})
		},
		components: {}
	}
</script>

<style lang="scss">


</style>
