<template>
	<view class="search-main">
		<view class="search-container padding-xl">
			<view class="search-button uni-flex uni-row">
				<image src="../../static/img/searchIcon.png" class="search-icon"></image>
				<view class="search-text">Search</view>
			</view>
		</view>
		<!-- menu -->
		<view>
			<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" tab-class="text-center bg-white" select-class="text-blue" @change="tabChange">
			</wuc-tab>
			<view class="bg-white padding text-black" style="margin-top: 10upx;">
				<scroll-view class="list" scroll-y @scrolltolower="loadMore">
					<block v-for="(item ,index) in storeList" :key="index">
						<view class="uni-tab-bar-loading">
							<view class="uni-flex uni-row title_view">
								<view style="display: flex; justify-content: center;align-items: center;">
									<image :src="item.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
								</view>
								<view class="uni-flex uni-column" style="padding-left: 20upx;">
									<view class="title-name">{{item.name}}</view>
									<view class="uni-flex uni-row title-text" v-show="item.address !== ''">Address: {{item.address}}</view>
									<view class="uni-flex uni-row title-text" v-show="item.mdContent !== ''">Announcement: {{item.mdContent}}</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		uniList,
		uniListItem,
		uniLoadMore
	} from '@dcloudio/uni-ui'
	import {
		WucTab
	} from "@/components/wuc-tab/wuc-tab.vue";
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: '',
		data() {
			return {
				tabList: [{
						name: "Distance",
					},
					{
						name: "	Recommend"
					},
					{
						name: "	Sales"
					},
					{
						name: "	Score"
					}
				],
				TabCur: 0,
				storeList: []
			}
		},
		props: {},
		methods: {
			loadMore(e) {
				console.log(e)
			},
			queryStoreList() {
				const param = {
					pageNo: 1,
					pageSize: 10,
					searchText: ''
				}
				this.$request
					.get("/entry/wxapp/storeList", {
						data: param
					})
					.then(res => {
						this.storeList = res.page.list
						console.log(res.page.list);
					})
					.catch(error => {
						console.error('error:', error);
					});
			},
			tabChange() {},
      autoLogin () {
        uni.login({
        	success: (res) => {
        		console.log('login res: ', res)
        	}
        })
      }
		},
		mounted() {
      this.autoLogin()
			this.queryStoreList()
		},
		computed: {
			...mapGetters({})
		},
		components: {
			WucTab,
			uniList,
			uniListItem,
			uniLoadMore
		}
	}
</script>

<style lang="scss">
	.search-main {
		.search-container {
			background-color: $app-theme-color;

			.search-button {
				background-color: #ffffff;
				padding: 20upx;
				height: 40upx;
				border-radius: 40upx;

				.search-icon {
					height: 40upx;
					width: 40upx;
					margin-right: 10upx;
				}

				.search-text {
					flex: 1;
					line-height: 40upx;
					color: #80838F;
				}
			}
		}

		.title-name {
			font-size: 30upx;
			height: 30upx;
			text-align: left;
			padding-bottom: 20upx;
		}

		.title-text {
			font-size: 25upx;
			color: #80838F;
		}

		.title-content {
			font-size: 28upx;
			color: #80838F;
		}
	}
</style>
