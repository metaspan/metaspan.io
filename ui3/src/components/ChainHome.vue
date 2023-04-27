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
import { SubstrateAPI } from '../plugins/substrate'

export default defineComponent({
  name: 'ChainHome',
  props: {
    chainId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const chainId = ref(props.chainId)
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    substrate.connect(chainId.value)

    watch(() => chainId.value, (newVal) => {
      substrate.connect(chainId.value)
    })

    onBeforeMount(() => {
      console.debug('ChainHome.vue: created()', chainId.value, store.state.chainId)
      if (chainId.value !== store.state.chainId) {
        store.dispatch('setChainId', chainId.value)
      }
    })

    return {
      chainId
    }
  }
})
</script>
