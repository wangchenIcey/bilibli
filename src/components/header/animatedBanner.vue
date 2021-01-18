<template>
  <div class="animated-banner">
    <div class="layer" v-for="(i, index) in list" :key="index">
      <img
        v-if="!i.video"
        :src="i.src"
        height="155"
        width="2016"
        class="layerchild"
        :style="`transform:scale(1) translateX(${
          index < 5 ? i.translateX + 'px' : i.translateX2 + 'px'
        });filter: blur(${
          index == 7 ? '5px' : index == 5 || index == 6 ? '2px' : '0px'
        }); opacity: ${i.opacity};`"
      />
      <video
        class="layerchild"
        v-else
        :src="i.src"
        loop
        autoplay
        muted
        height="155"
        width="2016"
        :style="`transform:scale(1) translateX(${
          i.translateX + 'px'
        });object-fit: cover;opacity: ${i.opacity};`"
      ></video>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const initCanvas = () => {
      //canvas init
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");

      //canvas dimensions
      var W = document.querySelector(".animated-banner").clientWidth;
      var H = document.querySelector(".animated-banner").clientHeight;
      console.log(W, H);
      canvas.width = W;
      canvas.height = H;
      //snowflake particles
      var mp = 50; //max particles
      var particles = [];
      for (var i = 0; i < mp; i++) {
        particles.push({
          x: Math.random() * W, //x-coordinate
          y: Math.random() * H, //y-coordinate
          r: Math.random() * 4, //radius
          d: Math.random() * 10, //density
        });
      }

      //Lets draw the flakes
      function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        for (var i = 0; i < mp; i++) {
          var p = particles[i];
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }
        ctx.fill();
        update();
      }

      //Function to move the snowflakes
      //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
      var angle = 0;
      function update() {
        // angle += 0.01;
        for (var i = 0; i < mp; i++) {
          var p = particles[i];
          //Updating X and Y coordinates
          //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
          //Every particle has its own density which can be used to make the downward movement different for each flake
          //Lets make it more random by adding in the radius
          p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
          p.x += Math.sin(angle) * 2;

          //Sending flakes back from the top when it exits
          //Lets make it a bit more organic and let flakes enter from the left and right also.
          if (p.x > W + 5 || p.x < -5 || p.y > H) {
            if (i % 3 > 0) {
              //66.67% of the flakes
              particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
            } else {
              //If the flake is exitting from the right
              if (Math.sin(angle) > 0) {
                //Enter from the left
                particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
              } else {
                //Enter from the right
                particles[i] = {
                  x: W + 5,
                  y: Math.random() * H,
                  r: p.r,
                  d: p.d,
                };
              }
            }
          }
        }
      }

      //animation loop
      setInterval(draw, 50);
    };
    onMounted(() => {
      initCanvas();
    });
  },
});
</script>
<style lang="scss" scoped>
.animated-banner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}
.animated-banner > .layer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
}
#canvas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.translayer{
    transition:all 0.5s ;
}
</style>