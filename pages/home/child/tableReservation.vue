<template>
	<view>
		<form @submit="formSubmit">
			<view class="form-mian">
				<!-- 预定信息 -->
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-flex uni-row" style="width: 100%;">
							<view class="uni-input" style="margin-right: 20upx;">Date</view>
							<view class="title-content">
								<picker mode="date" name="date" :value="date" :start="startDate" :end="endDate" @change="selectDate">
									<view class="uni-input">{{ date }}</view>
								</picker>
							</view>
							<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-flex uni-row" style="width: 100%;">
							<view class="uni-input" style="margin-right: 20upx;">Arrival time</view>
							<view class="title-content">
								<picker mode="time" name="arrivalTime" :value="arrivalTime" :start="startTime" end="" @change="selectArrivalTime">
									<view class="uni-input">{{ arrivalTime }}</view>
								</picker>
							</view>
							<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-flex uni-row" style="width: 100%;">
							<view class="uni-input" style="margin-right: 20upx;">Table type</view>
							<view class="title-content">
								<picker @change="selectTableType" name="tableIndex" :value="tableIndex" :range="tableArrayLabel">
									<view class="uni-input">{{ tableType }}</view>
								</picker>
							</view>
							<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-flex uni-row" style="width: 100%;">
							<view class="uni-input" style="margin-right: 20upx;">Number of People</view>
							<view class="title-content">
								<picker @change="selectPeopleNumber" name="peopleNumber" :value="peopleNumber" :range="peopleArray">
									<view class="uni-input">{{ peopleNumber }}</view>
								</picker>
							</view>
							<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
						</view>
					</view>
				</view>

				<!-- 预定消费金额 -->
				<view>
					<view class="uni-flex uni-row">
						<view class="price-name">The minimum consumption</view>
						<view class="price-value">{{ tableArray[tableIndex].zdCost }}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="price-name">Advance payment</view>
						<view class="price-value">{{ tableArray[tableIndex].fwCost }}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="price-name">The service fee</view>
						<view class="price-value">{{ tableArray[tableIndex].ydCost }}</view>
					</view>
				</view>

				<!--用户信息-->
				<view>
					<view class="uni-flex uni-row">
						<view class="input-name">Name</view>
						<view class="input-value"><input v-model="name" name="name" placeholder="Your name" /></view>
					</view>
					<view class="uni-flex uni-row" style="margin-top: 2rpx;">
						<view class="input-name">Phone</view>
						<view class="input-value"><input v-model="phone" type="number" name="phone" placeholder="Your phone number" /></view>
					</view>
				</view>

				<!--注释-->
				<view class="margin-top-xl">
					<view class="padding-sm bg-white">
						<view class="margin-bottom-xs">Remark</view>
						<view class="uni-textarea"><textarea style="border: 1px solid #DDDEE1;margin-left: 2%;" name="textArea" v-model="textArea" placeholder="Remark" /></view>
					</view>
				</view>

				<view class="padding bg-white button-icon"><button type="warn" formType="submit">Reservation</button></view>
			</view>
		</form>

		<!-- 支付弹框 -->
		<uni-popup :show="isShowDialog" position="middle" mode="fixed" @hidePopup="isShowDialog = false" class="pay-dialog">
			<view style="width: 100%;">
				<view class="pay-title">Payment options</view>
				<view class="uni-list">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in payItems" :key="item.value">
							<view class="uni-flex uni-row" style="position: relative;">
								<view class="flex-item" style="position: absolute;top:-7rpx;"><image :src="item.icon" style="width: 40upx;height: 40upx;"></image></view>
								<view class="flex-item padding-left-xl" style="line-height: 28upx;">{{ item.name }}</view>
							</view>
							<view><radio :value="item.value" :checked="index === currentPayIndex" /></view>
						</label>
					</radio-group>
					<view class="uni-list-cell-pd" style="text-align:center;border-top:1upx solid #DDDEE1;margin-top:2upx;">You selected {{ payItems[currentPayIndex].name }}</view>
				</view>
				<view class="confirm-button" :class="{ 'blue-button': payItems[currentPayIndex].name === 'Balance' }" @click="confirmClick">
					Confirm payment ${{ tableArray[tableIndex].ydCost }}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
function getDate(type) {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === 'start') {
	} else if (type === 'end') {
		date.setDate(date.getDate() + 30);
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();
	}
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;

	return `${year}-${month}-${day}`;
}
function formatTime() {
	const date = new Date();
	var h = date.getHours();
	h = h < 10 ? '0' + h : h;
	var minute = date.getMinutes();
	minute = minute < 10 ? '0' + minute : minute;
	return h + ':' + minute;
}
import { mapGetters } from 'vuex';
import { uniIcon, uniPopup } from '@dcloudio/uni-ui';
export default {
	name: '',
	onLoad(e) {
		this.storeId = e.storeId || '';
	},
	data() {
		return {
			date: getDate({ format: true }),
			arrivalTime: formatTime(),
			acctuallyTime: getDate('start'),
			startDate: getDate('start'),
			endDate: getDate('end'),
			startTime: formatTime(),
			peopleNumber: '1',
			peopleIndex: 0,
			peopleArray: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
			storeId: '',
			tableArray: [],
			tableArrayLabel: [],
			tableIndex: 0,
			tableType: '',
			textArea: '',
			phone: '',
			name: '',
			isShowDialog: false,
			payItems: [
				{
					icon: '../../../static/img/weixin.png',
					name: 'WeChat',
					value: 2
				},
				{
					icon: '../../../static/img/qb.png',
					name: 'Balance',
					value: 1
				}
			],
			currentPayIndex: 0
		};
	},
	props: {},
	watch: {
		date: {
			handler(newValue) {
				if (newValue === this.acctuallyTime) {
					this.startTime = formatTime();
				} else {
					this.startTime = '';
				}
			}
		}
	},
	methods: {
		selectDate(e) {
			//选择到店日期
			this.date = e.target.value;
		},
		selectArrivalTime(e) {
			//选择到店时间
			this.arrivalTime = e.target.value;
		},
		selectPeopleNumber(e) {
			this.peopleNumber = this.peopleArray[e.target.value];
		},
		selectTableType(e) {
			this.tableIndex = e.target.value;
			this.tableType = this.tableArrayLabel[e.target.value];
		},
		queryTableType() {
			//查询tableType
			this.tableArrayLabel = [];
			const param = {
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/tableType', {
					data: param
				})
				.then(res => {
					this.tableArray = res.tableTypeList;
					if (this.tableArray && this.tableArray.length > 0) {
						this.tableArray.forEach(item => {
							this.tableArrayLabel.push(item.name);
						});
						this.tableType = this.tableArrayLabel[0];
					}
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		formSubmit(e) {
			console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
			this.isShowDialog = true;
		},
		radioChange(evt) {
			//支付方式变更
			for (let i = 0; i < this.payItems.length; i++) {
				if (this.payItems[i].value.toString() === evt.target.value) {
					this.currentPayIndex = i;
					break;
				}
			}
		},
				confirmClick() {
			const param = {
				isYue: this.payItems[this.currentPayIndex].value, //余额支付=1，直接支付=2
				jcNum: this.peopleNumber, //就餐人数
				linkName: this.name, //预约姓名
				linkTel: this.phone, //预约电话
				money: this.tableArray[this.tableIndex].ydCost, //预定费用
				remark: this.remark, //备注
				storeId: this.storeId, //店铺id
				tableTypeId: this.tableArray[this.tableIndex].id, //桌位类型
				tableTypeName: this.tableArray[this.tableIndex].name, //桌位类型名称
				userId: 1, //用户ID
				xzDate: this.date, //预定日期
				ydCode: '', //预定编码（不需要填写，可为空）
				yjddDate: this.arrivalTime, //预定到店时间
				zdCost: this.tableArray[this.tableIndex].zdCost //最低消费
			};
			this.$request
				.post('/entry/wxapp/reservation', {
					data: param
				})
				.then(res => {
					// uni.navigateTo({
					// 	url: '/pages/home/child/reservationDetail?ydOrderId=' + res.ydOrderId
					// });
				})
				.catch(error => {
					uni.navigateTo({
						url: '/pages/home/child/reservationDetail?ydOrderId=23'
					});
					console.error('error:', error);
				});
		},
	},
	mounted() {
		this.queryTableType();
	},
	computed: {
		...mapGetters({})
	},
	components: {
		uniIcon,
		uniPopup
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.title-content {
	flex: 1;
	text-align: right;
	padding-right: 20rpx;
}

.arrow-right-icon {
	display: flex;
	justify-content: center;
	align-items: center;
}

.price-name {
	flex: 1;
	text-align: right;
	line-height: 60rpx;
}

.price-value {
	width: 120upx;
	padding-left: 40upx;
	line-height: 60rpx;
}

.input-name {
	width: 120upx;
	padding-left: 25rpx;
	height: 50rpx;
	padding: 15rpx 25rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	background: #fff;
}

.input-value {
	flex: 1;
	height: 50rpx;
	padding: 15rpx 25rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	background: #fff;
}
.form-mian {
	height: 100vh;
	position: relative;
	min-height: 1400rpx;
}
.button-icon {
	position: absolute;
	bottom: 0;
	width: calc(100% - 60upx);
}
.pay-title {
	background-color: #f2f2f2;
	border-top-left-radius: 10upx;
	border-top-right-radius: 10upx;
	text-align: center;
	padding: 20rpx;
	font-size: 30rpx;
}
.confirm-button {
	border-bottom-left-radius: 10upx;
	border-bottom-right-radius: 10upx;
	text-align: center;
	padding: 20rpx;
	font-size: 30rpx;
	color: white;
	background-color: #39b54a;
}
.blue-button {
	background-color: #34aaff;
}

.pay-dialog {
	/deep/ .uni-popup-middle.uni-popup-fixed {
		padding: 0;
		width: 85%;
	}
}
</style>
