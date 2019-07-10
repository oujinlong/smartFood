<template>
	<view>
		<form @submit="formSubmit">
			<view class="form-mian">
				<!-- 预定信息 -->
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-flex uni-row" style="width: 100%;">
							<view class="uni-input" style="margin-right: 20upx;">{{ i18n.reservation.Date }}</view>
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
							<view class="uni-input" style="margin-right: 20upx;">{{ i18n.reservation.Arrivaltime }}</view>
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
							<view class="uni-input" style="margin-right: 20upx;">{{ i18n.reservation.Tabletype }}</view>
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
							<view class="uni-input" style="margin-right: 20upx;">{{ i18n.reservation.NumberofPeople }}</view>
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
						<view class="price-name">{{ i18n.reservation.Theminimumconsumption }}</view>
						<view class="price-value">{{ CURRENCY_SYMBOL }} {{ tableArray[tableIndex].zdCost || '0' }}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="price-name">{{ i18n.reservation.Advancepayment }}</view>
						<view class="price-value">{{ CURRENCY_SYMBOL }} {{ tableArray[tableIndex].fwCost || '0' }}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="price-name">{{ i18n.reservation.Theservicefee }}</view>
						<view class="price-value">{{ CURRENCY_SYMBOL }} {{ tableArray[tableIndex].ydCost || '0' }}</view>
					</view>
				</view>

				<!--用户信息-->
				<view>
					<view class="uni-flex uni-row">
						<view class="input-name">{{ i18n.common.Name }}</view>
						<view class="input-value"><input v-model="name" name="name" :placeholder="i18n.common.Name" /></view>
					</view>
					<view class="uni-flex uni-row" style="margin-top: 2rpx;">
						<view class="input-name">{{ i18n.common.Phone }}</view>
						<view class="input-value"><input v-model="phone" type="number" name="phone" :placeholder="i18n.common.Phone" /></view>
					</view>
				</view>

				<!--注释-->
				<view class="margin-top-xl">
					<view class="padding-sm bg-white">
						<view class="margin-bottom-xs">{{ i18n.common.Remark }}</view>
						<view class="uni-textarea"><textarea style="border: 1px solid #DDDEE1;margin-left: 2%;" name="textArea" v-model="remark" :placeholder="i18n.common.Remark" /></view>
					</view>
				</view>

				<view class="padding bg-white button-icon">
					<button type="warn" formType="submit" style="display: block;" v-bind:style="{ backgroundColor: storeColor }">{{ i18n.reservation.Reservation }}</button>
					</view>
			</view>
		</form>
		<payment-dialog :visible="isShowDialog" :price="tableArray[tableIndex].ydCost" @confirm="confirmClick" @hideHandle="hideHandle"></payment-dialog>
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
import CONFIG from '@/utils/config.js';
import { PaymentDialog } from '@/components/paymentDialog';
var graceChecker = require('@/common/graceChecker.js');

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
			remark: '',
			phone: '',
			name: '',
			isShowDialog: false,
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL
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
		hideHandle() {
			this.isShowDialog = false;
		},
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
			var rule = [
				{ name: 'name', checkType: 'notnull', checkRule: '', errorMsg: this.i18n.errorMessage.pleaseinputyourname },
				{ name: 'phone', checkType: 'notnull', checkRule: '', errorMsg: this.i18n.errorMessage.pleaseinputyourphonenum },
				{ name: 'phone', checkType: 'int', checkRule: '1,30', errorMsg: this.i18n.errorMessage.pleaseinputcurrentphonenum }
			];
			//进行表单检查
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if (checkRes) {
				this.isShowDialog = true;
			} else {
				uni.showToast({ title: graceChecker.error, icon: 'none' });
			}
		},
		confirmClick(item) {
			const {payIndex} = item
			const param = {
				isYue: payIndex, //余额支付=1，直接支付=2
				jcNum: this.peopleNumber, //就餐人数
				linkName: this.name, //预约姓名
				linkTel: this.phone, //预约电话
				money: this.tableArray[this.tableIndex].ydCost, //预定费用
				remark: this.remark, //备注
				storeId: this.storeId, //店铺id
				tableTypeId: this.tableArray[this.tableIndex].id, //桌位类型
				tableTypeName: this.tableArray[this.tableIndex].name, //桌位类型名称
				userId: this.userInfo.userId, //用户ID
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
					this.isShowDialog = false;
					uni.navigateTo({
						url: '/pages/home/child/reservationDetail?ydOrderId=' + res.ydOrderId
					});
				})
				.catch(error => {
					this.isShowDialog = false;
					console.error('error:', error);
				});
		}
	},
	mounted() {
		this.queryTableType();
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.storeColor
		});
	},
	computed: {
		...mapGetters({
			storeColor: 'storeColor',
			'userInfo': 'userInfo'
		}),
    i18n() {
      return this.$t('index');
    }
	},
	components: {
		uniIcon,
		uniPopup,
		PaymentDialog
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
</style>
