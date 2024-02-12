<template>
  <Pools></Pools>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'
import Pools from '@/components/Pools.vue'

export default defineComponent({
  components: {
    Pools
  },
  setup () {

    onBeforeMount(() => {
      console.debug('[[chainId]]/pool/index.vue: onBeforeMount()')
    })

  }
})

</script>
