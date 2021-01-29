<template>
  <div class="card-list">
    <div class="storey-title"></div>
    <div class="zone-list-box">
      <div class="video-card-common" v-for="i in dataList" :key="i.id">
        <div class="card-pic">
          <a :href="`//www.bilibili.com/video/${i.bvid}`" target="_blank">
            <img :src="i.pic" alt="">
          </a>
        </div>
        <a
          :href="`//www.bilibili.com/video/${i.bvid}`"
          class="title"
          :title="i.title"
          target="_blank"
          >{{ i.title }}</a
        >
        <a
          :href="`//space.bilibili.com/${i.owner.mid}`"
          :title="i.owner.name"
          class="up"
          >{{ i.owner.name }}</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import { watch } from "vue";
export default {
  props: {
    dataList: {
      type: Array,
      default: [],
      requires: true,
    },
  },
  setup(props) {},
};
</script>
<style lang="scss" scoped>
.storey-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  height: 36px;
}
.zone-list-box {
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1286px;
  height: 404px;
  @media screen and (max-width: 1870px) {
    width: 1070px;
  }
  @media screen and (max-width: 1654px) {
    width: 854px !important;
  }
  .video-card-common {
    width: 206px;
    cursor: pointer;
    .card-pic {
      position: relative;
      width: 100%;
      height: 116px;
      a {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABHCAMAAAB4UkqjAAAAh1BMVEUAAADd3d3d3d…UCIZXAAAALHRSTlMAoJDx4OYL/DcGF+6+JNi4ycSIT2k6LPeWfRzTVPXPszEQrV0hpo12cEZAZFpRNIQAAAJVSURBVFjD7dbZcpswGIbhHwwSi81q8Ib33fnu//oatRIpmliDhQ/aaZ+TKInnjVgkhb4RJMhP9Fzo8PiD+vEA+JPnqS0+1dRHBJhibAzh2HNeekxP9Z8XBSMZM6SmRBYx65QeM6XsY3rKPqanLGMWqeDmOh0b/Io9+YHi3gKtdExgLznSlyjFMGnUphIMlcgY22C4DSPBxTu4IrXDe+yI6IDWbPSqGVoHoohDyip6XZVB4hFN1TgPyUaYQ5rSWQ0nZGcC6UyJukKypa4yIXX3HLLlqCdHX++HLRfS/9bbWvvHLSLNR3N6tRXdFwdxejekiYF4fDnWYa/WqSm2PqRCSy0hrbP5RxAaW8141N17tVbZ+S1fFYbWFF2+1lqg62BoBdAsqWOLroWhxTh+M8vmWuuaxp1WaWjRSn43yl35sHTLUjxiaWlqnYE4LZoJme3v13MibqepFZRL6otV5V+/Hv+xVvi+FsvZG1qh/LQ7uFXnF/HlwcEfYlDktW2r5EARUiXWc1xRWAC8tGwxsdJ9dcRnYrddMdtrjDZyAy3kXrSJ7O89u8zEZAIKxBRnFzbonWD3ZkfCrrmzP+6979nicjAnW3NZ4OS1R6GtVBa8drTek539up3NAgMvcv51WNZQitCiFBZQaqIMSrx1XrWNoWTy/w1r+hk+xjuMSVjGGC6WZ3S1xlDriqTKxzB+Ra3I4bDHne62drqmied57QR9z0D94dHnOEmvJ/pWAMm4ovL2TTcJ5cRyMlHrbkdG5c/5r82fYqt+K/iR89m2JrP9PEZyI80PsPxVT0P3FAEAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-position: 50%;
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 48px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAwCAYAAAGnNCAXAAAABGdBTUEAALGPC/xhBQAAAENJREFUCB1jYGBgYGICEpIgQgqNBRRi4MMmARYDyXKAWLwgggfOAnMJiIH0soJ0sMEJdlQWWBYshpAAK0ZwwSzS1AEAes8Ckyqvlc0AAAAASUVORK5CYII=);
          background-repeat: repeat-x;
          bottom: 0;
          left: 0;
          border-radius: 2px;
        }
        img{
          width: 100%;
    height: 100%;
    border-radius: 2px;
        }
      }
    }
    .title {
      display: block;
      font-size: 14px;
      line-height: 20px;
      margin: 10px 0 8px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-weight: 500;
      padding-right: 12px;
    }
    a:hover,
    a {
      text-decoration: none;
    }
    a {
      color: #212121;
      transition: color 0.3s;
    }
    .up {
      display: flex;
      font-size: 12px;
      color: #999;
      line-height: 16px;
    }
  }
}
</style>