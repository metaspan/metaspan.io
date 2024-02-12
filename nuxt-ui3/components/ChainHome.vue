<template>
  <nuxt-page></nuxt-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount } from 'vue'

import { SubstrateAPI } from '../plugins/substrate'

export default defineComponent({
  name: 'ChainHome',
  // these props come from the router !!
  props: {
    chainId: {
      type: String,
      required: false
    }
  },
  setup (props) {
    const store = useStore()
    const substrateStore = useSubstrateStore()
    const route = useRoute()
    console.debug('ChainHome.vue: setup(): route', route)
    const chainId = computed(() => store.chainId)
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI
    // substrate.connect(chainId.value)

    // props will not change, so we need to watch the route
    // watch(() => chainId.value, async (newVal) => {
    //   await substrate.connect(chainId.value)
    // })
    watch(() => route.params.chainId, async (newVal) => {
      console.debug('ChainHome.vue: watch(route.params.chainId)', newVal)
      store.setChainId(newVal.toString())
    })

    onBeforeMount(async () => {
      console.debug('ChainHome.vue: onBeforeMount()', chainId.value, store.chainId)
      if (chainId.value !== route.params.chainId?.toString()) {
        console.debug('ChainHome.vue: setting chainId', route.params.chainId)
        // store.dispatch('setChainId', chainId.value)
        store.setChainId(route.params.chainId.toString())
      }
      // await substrate.api?.isReady
      // const chainInfo = JSON.parse(substrate.api?.registry?.getChainProperties()?.toString() || '{}')
      // // store.dispatch('substrate/setChainInfo', { chainId: chainId.value, chainInfo })
      // substrateStore.setChainInfo({ chainId: chainId.value, chainInfo })
    })
  }
})
</script>
