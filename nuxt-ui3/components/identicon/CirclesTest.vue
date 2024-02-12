<template>
  <div>
    <CircleSVG :size="200" :circles="[
      { x: 50, y: 50, radius: 20, color: 'red' },
      { x: 100, y: 100, radius: 30, color: 'green' },
      { x: 150, y: 50, radius: 40, color: 'blue' }
    ]" />
  </div>
</template>

<script lang="ts">
  import CircleSVG from './CircleSVG.vue'
  
  export default {
    name: 'App',
    components: { CircleSVG }
  }
</script>
