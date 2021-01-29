<template>
  <div class="b-wrap">
    <div class="primary-menu-itnl">
      <div class="page-tab">
        <ul class="con">
          <li>首页</li>
          <li>动态</li>
          <li>排行榜</li>
          <li>频道</li>
        </ul>
      </div>
      <span class="tab-line-itnl"></span>
      <div class="channel-menu-itnl">
        <span v-for="i in navList" :key="i.tid">
          <div class="item">
            <a :href="i.route" class="name">
              <span
                >{{ i.name }}<em v-if="i.tid">{{ i.count||'--' }}</em></span
              >
            </a>
          </div>
        </span>
      </div>
      <span class="tab-line-itnl none"></span>
      <div class="friendship-link">
        <span>
          <div class="item">
            <a href="" class="name">
              <svg class="svg-icon"></svg>
              <span>专栏</span>
            </a>
          </div>
        </span>
        <span>
          <div class="item">
            <a href="" class="name">
              <svg class="svg-icon"></svg>
              <span>专栏</span>
            </a>
          </div> </span
        ><span>
          <div class="item">
            <a href="" class="name">
              <svg class="svg-icon"></svg>
              <span>专栏</span>
            </a>
          </div> </span
        ><span>
          <div class="item">
            <a href="" class="name">
              <svg class="svg-icon"></svg>
              <span>专栏</span>
            </a>
          </div> </span
        ><span>
          <div class="item">
            <a href="" class="name">
              <svg class="svg-icon"></svg>
              <span>专栏</span>
            </a>
          </div> </span
        ><span>
          <div class="item">
            <a href="" class="name">
              <svg class="svg-icon"></svg>
              <span>专栏</span>
            </a>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, onMounted, reactive, toRefs } from "vue";
import * as jsondata from "../../menu.json";
import { online } from "../../api/header";
// const jsondata = require('../../menu.json')
interface state {
  navMenuConfig: object;
  onlineDataList: any;
}
export default {
  setup() {
    const state = reactive({
      navMenuConfig: [],
      onlineDataList: {},
    });
    onMounted(async () => {
      let onlineData = await online();
      state.onlineDataList = onlineData.data.data.region_count;
    });
    const navList = computed(() => {
      let navList = jsondata.default.Fe;
      Object.keys(navList).map((e) => {
        navList[e].count = state.onlineDataList[navList[e].tid];
        if (navList[e].tid == 998) {
          navList[e].count =
            state.onlineDataList[177] +
            state.onlineDataList[23] +
            state.onlineDataList[11];
        }
        navList[e].count = navList[e].count > 999 ? "999+" : navList[e].count;
      });
      return navList;
    });
    return {
      ...toRefs(state),
      navList,
    };
  },
};
</script>

<style lang="scss" scoped>
.b-wrap {
  width: 1630px;
  margin: 0 auto;
  .primary-menu-itnl {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    width: 100%;
    .page-tab {
      .con {
        display: flex;
        li {
          cursor: pointer;
          width: 50px;
          height: 68px;
          text-align: center;
          font-size: 14px;
          white-space: nowrap;
          border: 1px solid #fff;
          border-radius: 16px;
          transition: all 0.3s;
        }
      }
    }
    .channel-menu-itnl {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 5rem;
      height: 68px;
      flex: 1;
      .item {
        cursor: pointer;
        display: flex;
        height: 34px;
        .name {
          font-size: 14px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
          white-space: nowrap;
          text-decoration: none;
          color: #212121;
          transition: color 0.3s;
          em {
            font-style: normal;
            font-size: 12px;
            display: inline-block;
            background: #73c9e5;
            border-radius: 2px;
            color: #fff;
            margin-left: 1px;
            transform: scale(0.85);
            width: 32px;
            text-align: center;
          }
        }
      }
    }
    .friendship-link {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 68px;
      width: 220px;
      .item {
        height: 34px;
        display: flex;
        .name {
          font-size: 14px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
          white-space: nowrap;
          text-decoration: none;
          color: #212121;
          transition: color 0.3s;
          .svg-icon {
            width: 1.8em;
            height: 1.8em;
            vertical-align: middle;
            fill: currentColor;
            overflow: hidden;
          }
        }
      }
    }
    .tab-line-itnl {
      display: inline-block;
      height: 46px;
      border-left: 1px solid #e7e7e7;
      margin: 0 20px;
    }
    .tab-line-itnl.none {
      margin: 0 24px 0 0;
    }
  }
}
@media screen and (max-width: 1870px) {
  .b-wrap {
    width: 1414px;
    // .primary-menu-itnl {
    // }
  }
}
@media screen and (max-width: 1654px) {
  .b-wrap {
    width: 1198px;
    .primary-menu-itnl {
      .tab-line-itnl {
        margin: 0 8px;
      }
      .tab-line-itnl.none {
        margin: 0 8px 0 0;
      }
    }
  }
}
@media screen and (max-width: 1438px) {
  .b-wrap {
    width: 999px;
    .primary-menu-itnl {
      .tab-line-itnl {
        margin: 0 8px;
      }
      .tab-line-itnl.none {
        margin: 0 12px 0 0;
      }
    }
  }
}
</style>