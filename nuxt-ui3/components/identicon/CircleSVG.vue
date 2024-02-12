<template>
  <svg :width="size" :height="size">
    <circle v-for="(circle, index) in circles"
            :key="index"
            :cx="circle.x"
            :cy="circle.y"
            :r="circle.radius"
            :fill="circle.color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  name: 'CircleSVG',
  props: {
    size: {
      type: Number,
      required: true
    },
    circles: {
      // type: Array,
      type: Object as PropType<any[]>, 
      required: true
    }
  },
  render() {
    return (
      '<svg width={this.size} height={this.size}>\
        {this.circles.map(circle => (\
          <circle cx={circle.x} cy={circle.y} r={circle.radius} fill={circle.color} />\
        ))}\
      </svg>'
    )
  }
})
</script>
