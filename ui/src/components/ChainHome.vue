<template>
  <v-container fluid>
    <!--
    <v-toolbar dense flat>
      <v-toolbar-title>
        <v-btn text><v-img :src="require(`@/assets/${chain}-logo.png`)" width="24px" height="24px"></v-img>&nbsp;
        {{chain}}
        </v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text :to="`/${chain}/pool`">
        <v-icon>mdi-waves</v-icon><span class="d-none d-sm-inline">Pools</span>
      </v-btn>

      <v-btn text :to="`/${chain}/candidate`">
        <span class="d-none d-sm-inline"><v-icon>mdi-basketball</v-icon></span>1KV
      </v-btn>

      <v-spacer></v-spacer>

    </v-toolbar>
    -->
    <v-fade-transition mode="out-in">
    <router-view>
      This is the {{chainId}} Home page
    </router-view>
  </v-fade-transition>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'ChainHome',
  props: {
    chainId: {
      type: String,
      required: true
      // default: 'kusama'
    }
  },
  computed: {
    // ...mapState(['chainId'])
  },
  watch: {
    async chainId (val: string) {
      console.debug('ChainHome.vue: watch.chainId()', val)
      // const chainInfo = await this.$substrate.connect(val)
      // await this.$substrate[val].isReady
      console.debug('ChainHome.vue: watch.chainId(): isReady!')
      // await this.setChainId(val)
    }
  },
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
