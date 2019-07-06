<template>
	<view class="boxa">
		<view class="top_kbox">
			<view v-for="(item, i) in newlist" :key="i" @click="alertnum(i, item)">
				<view class="ibox" :class="[i === i1 ? 'actives' : '']">
					<text class="uni_14">{{ item.name }}</text>
					<image v-if="i != i1" class="ii" src="/static/choose-Cade/choose-Cadex.png" mode=""></image>
					<image v-else class="ii" src="/static/choose-Cade/choose-Cades.png" mode=""></image>
				</view>
			</view>
		</view>
		<view v-show="show" :class="[show ? 'list_boxs2' : 'list_boxs']">
			<view class="lione uni-flex uni-row">
				<view class="uni-flex uni-column all-value" :class="{ 'remark-value': directionList.length > 0 }">
					<view v-for="(item, i) in listchild" :key="i">
						<view class="mli" @tap="chooseOne(i)">
							<text :class="[i == i2 ? 'actives' : '']" class="uni_14">{{ item.remark }}</text>
							<image v-if="i == i2 && directionList.length == 0" class="ii" src="/static/choose-Cade/choose-Cadecc.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="remark-value uni-flex uni-column" v-if="directionList.length !== 0">
					<block v-for="(item, i) in directionList" :key="i">
						<view class="mli" @tap="chooseSecond(i)">
							<text :class="[i == i3 ? 'actives' : '']" class="uni_14">{{ item.remark }}</text>
							<image v-if="i == i3" class="ii" src="/static/choose-Cade/choose-Cadecc.png" mode=""></image>
						</view>
					</block>
				</view>
			</view>
			<view class="hideA" @tap="hide"></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			i1: null,
			i2: null,
			i3: null,
			show: false,
			listchild: [],
			newlist: this.list,
			directionList: [],
			tabValue: ''
		};
	},
	methods: {
		alertnum(i, item) {
			if (this.i1 != i) {
				this.listchild = [];
				this.i1 = i;
				if (item.value !== '') {
					this.show = true;
					this.i2 = null;
					this.tabValue = item.value;
					const param = {
						param: item.value
					};
					this.$request
						.get('/entry/wxapp/getParams', {
							data: param
						})
						.then(res => {
							this.listchild = res.params;
						})
						.catch(error => {
							console.error('error:', error);
						});
					if (this.tabValue === 'floorLevel') {
						this.$request
							.get('/entry/wxapp/getParams', {
								data: {
									param: 'direction'
								}
							})
							.then(res => {
								this.directionList = res.params;
							})
							.catch(error => {
								console.error('error:', error);
							});
					} else {
						this.directionList = [];
					}
				} else {
					this.hide();
				}
			}
		},
		chooseOne(i) {
			this.i2 = i;
			if (this.tabValue === 'categories') {
				this.$emit('chooseLike', this.tabValue, this.listchild[this.i2].paramValue);
				setTimeout(() => {
					this.hide();
				}, 500);
			} else if (this.i3 !== null) {
				this.$emit('chooseLike', this.tabValue, this.listchild[this.i2].paramValue, this.directionList[this.i3].paramValue);
				setTimeout(() => {
					this.hide();
				}, 500);
			}
		},
		chooseSecond(i) {
			this.i3 = i;
			if (this.i2 !== null && this.i3 !== null) {
				this.$emit('chooseLike', this.tabValue, this.listchild[this.i2].paramValue, this.directionList[this.i3].paramValue);
				setTimeout(() => {
					this.hide();
				}, 500);
			}
		},
		hide() {
			this.show = false;
			this.i1 = null;
			this.i2 = null;
			this.i3 = null;
		}
	},
	components: {}
};
</script>

<style>
.hideA {
	height: calc(100% - 310upx);
}

.mli {
	/* border: 1upx solid red; */
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 22upx 0;
}

.lione {
	background-color: #fff;
	/* height: 262upx; */
	padding: 10upx 40upx;
}

.list_boxs {
	background-color: rgba(84, 80, 80, 0.48);
	position: fixed;
	height: 80rpx;
	width: 100%;
	z-index: 88;
	transition: all 5.5s;
	transform: translateY(-120%);
}

.list_boxs2 {
	background-color: rgba(84, 80, 80, 0.48);
	position: absolute;
	top: 104upx;
	height: calc(100%);
	width: 100%;
	z-index: 88;
	transform: translateY(0);
	transition: all 5.5s;
}

.ii {
	width: 30upx;
	height: 30upx;
	display: block;
	margin-left: 12upx;
}

.actives {
	color: #f0ad4e;
}

.ibox {
	display: flex;
	align-items: center;
}

.top_kbox {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	padding: 28upx 5%;
	width: 90%;
	z-index: 99;
	/* #ifdef APP-PLUS */
	top: 0;
	/* #endif */
}

.boxa {
/* 	padding-top: 105upx;
	position: relative; */
	position: relative;
}

.remark-value {
	width: 50%;
}

.all-value {
	width: 100%;
}
</style>
