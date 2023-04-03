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
import { defineComponent, ref, inject, watch } from 'vue'
import { mapState } from 'vuex'
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
    const chainId = ref(props.chainId)
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    substrate.connect(chainId.value)
    watch(() => chainId.value, (newVal) => {
      substrate.connect(chainId.value)
    })
  },
  // watch: {
  //   async chainId (val: string) {
  //     console.debug('ChainHome.vue: watch.chainId()', val)
  //     // const chainInfo = await this.$substrate.connect(val)
  //     // await this.$substrate[val].isReady
  //     console.debug('ChainHome.vue: watch.chainId(): isReady!')
  //     // await this.setChainId(val)
  //   }
  // },
  methods: {
    // NOT HERE, check ChainMenu.vue
    // async setChainId (chainId: string) {
    //   console.debug('ChainHome.vue: setChain()', chainId)
    //   await this.$substrate.connect(chainId)
    //   await this.$substrate[chainId].isReady
    //   await this.$store.dispatch('setChainId', chainId)
    //   console.debug('ChainHome.vue: reading chainId info()...')
    //   const chainInfo = await this.$substrate[this.chainId].registry.getChainProperties()
    //   console.log('chainInfo.tokenDecimals', chainInfo.tokenDecimals.toJSON()[0])
    //   // TODO: let parent do this?
    //   await this.$store.dispatch('substrate/setChainInfo', { chainId: chainId, chainInfo })
    // }
  },
  async created () {
    console.debug('ChainHome.vue: created()', this.chainId, this.$store.state.chainId)
    if (this.chainId !== this.$store.state.chainId) {
      this.$store.dispatch('setChainId', this.chainId)
    }
    // if (!this.$store.state.candidate.chainId || this.chainId !== this.$store.state.chainId) {
    //   // await this.$store.dispatch('setChainId', this.chain)
    //   await this.setChainId(this.chainId)
    // }
  },
  async mounted () {
    console.debug('ChainHome.vue: mounted()')
    // check api connection status
    // var i = 0
    // const interval = setInterval(async () => {
    //   i++
    //   if (this.$substrate[this.chain]) {
    //     console.info('ChainHome.vue: API found...')
    //     await this.$substrate[this.chain].isReady
    //     console.debug('ChainHome.vue: api.isReady')
    //     clearInterval(interval)
    //   }
    //   if (i > 10) {
    //     console.warn('ChainHome.vue: no API found...')
    //     clearInterval(interval)
    //   }
    // }, 1000)
  }
  // don't do this, it messes up the connection
  // async beforeDestroy () {
  //   console.debug('ChainHome.vue: beforeDestroy()')
  //   if (this.$substrate.polkadot) await this.$substrate.polkadot.disconnect()
  //   if (this.$substrate.kusama) await this.$substrate.kusama.disconnect()
  //   // await this.$store.dispatch('apiClose')
  // }
})
</script>
