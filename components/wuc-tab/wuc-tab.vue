<template>
  <scroll-view
    class="nav"
    :class="tabClass"
    :style="tabStyle"
    scroll-with-animation
    scroll-x
    :scroll-left="scrollLeft"
  >
    <div v-if="!textFlex">
      <div
        class="cu-item"
        :class="index === tabCur ? selectClass + ' cur':''"
        v-for="(item,index) in tabList"
        :key="index"
        :id="index"
        @tap="tabSelect(index,$event)"
      >
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div>

    <div class="flex text-center" v-if="textFlex">
      <div
        class="cu-item flex-sub"
        :class="index === tabCur ? selectClass + ' cur':''"
        v-for="(item,index) in tabList"
        :key="index"
        :id="index"
        @tap="tabSelect(index,$event)"
      >
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div>
  </scroll-view>
</template>
<script>
export default {
  name: "wuc-tab",
  data() {
    return {};
  },
  props: {
    tabList: {
      type: Array,
      default() {
        return [];
      }
    },
    tabCur: {
      type: Number,
      default() {
        return 0;
      }
    },
    tabClass: {
      type: String,
      default() {
        return "";
      }
    },
    tabStyle: {
      type: String,
      default() {
        return "";
      }
    },
    textFlex: {
      type: Boolean,
      default() {
        return false;
      }
    },
    selectClass: {
      type: String,
      default() {
        return "text-green";
      }
    }
  },
  methods: {
    tabSelect(index, e) {
      if (this.currentTab === index) return false;
      this.$emit("update:tabCur", index);
      this.$emit("change", index);
    }
  },
  computed: {
    scrollLeft() {
      return (this.tabCur - 1) * 60;
    }
  }
};
</script>
<style>
div,
scroll-view,
swiper,
button,
input,
textarea,
label,
navigator,
image {
  box-sizing: border-box;
}

.round {
  border-radius: 5000upx;
}

.radius {
  border-radius: 6upx;
}

.nav {
  white-space: nowrap;
}

::-webkit-scrollbar {
  display: none;
}

.nav .cu-item {
  height: 90upx;
  display: inline-block;
  line-height: 90upx;
  margin: 0 10upx;
  padding: 0 20upx;
}

.nav .cu-item.cur {
  border-bottom: 4upx solid;
}

.nav.fixed {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1024;
  box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}

.flex {
  display: flex;
}

.basis-xs {
  flex-basis: 20%;
}

.basis-sm {
  flex-basis: 40%;
}

.basis-df {
  flex-basis: 50%;
}

.basis-lg {
  flex-basis: 60%;
}

.basis-xl {
  flex-basis: 80%;
}

.flex-sub {
  flex: 1;
}

.flex-twice {
  flex: 2;
}

.flex-treble {
  flex: 3;
}

.flex-direction {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.align-center {
  align-items: center;
}

.align-stretch {
  align-items: stretch;
}

.self-start {
  align-self: flex-start;
}

.self-center {
  align-self: flex-center;
}

.self-end {
  align-self: flex-end;
}

.self-stretch {
  align-self: stretch;
}

.align-stretch {
  align-items: stretch;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.text-bold {
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.text-content {
  line-height: 1.6;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}
.text-green,
.line-green,
.lines-green {
  color: #39b54a;
}
</style>
