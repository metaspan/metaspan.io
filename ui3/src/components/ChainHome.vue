<template>
  <v-container fluid class="ma-0 pa-0">

    <router-view v-slot="{ Component }">
      <!-- <transition name="fade" mode="out-in"> -->
        <component :is="Component" />
      <!-- </transition> -->
    </router-view>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, inject, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
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
    const route = useRoute()
    console.debug('ChainHome.vue: setup(): route', route)
    const chainId = ref(props.chainId || store.state.chainId)
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    substrate.connect(chainId.value)

    // props will not change, so we need to watch the route
    watch(() => chainId.value, async (newVal) => {
      await substrate.connect(chainId.value)
    })

    onBeforeMount(async () => {
      console.debug('ChainHome.vue: onBeforeMount()', chainId.value, store.state.chainId)
      if (chainId.value !== store.state.chainId) {
        console.debug('ChainHome.vue: setting chainId', chainId.value)
        store.dispatch('setChainId', chainId.value)
      }
      await substrate.api?.isReady
      const chainInfo = JSON.parse(substrate.api?.registry?.getChainProperties()?.toString() || '{}')
      store.dispatch('substrate/setChainInfo', { chainId: chainId.value, chainInfo })
    })
  }
})
</script>
