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

    <router-view>
      This is the {{chain}} Home page
    </router-view>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'ChainHome',
  // props: {
  //   chain: {
  //     type: String,
  //     required: true
  //     // default: 'kusama'
  //   }
  // },
  computed: {
    ...mapState(['chain'])
  },
  watch: {
    async chain (val: string) {
      console.debug('ChainHome.vue: watch.chain()', val)
      await this.$substrate.connect(val)
      await this.$substrate[val].isReady
      console.debug('ChainHome.vue: watch.chain(): isReady!')
      await this.setChain(val)
    }
  },
  methods: {
    async setChain (chain: string) {
      console.debug('ChainHome.vue: setChain()', chain)
      await this.$store.dispatch('setChain', { chain })
      console.debug('ChainHome.vue: reading chain info()...')
      const chainInfo = await this.$substrate[this.chain].registry.getChainProperties()
      console.log('chainInfo.tokenDecimals', chainInfo.tokenDecimals.toJSON()[0])
      await this.$store.dispatch('substrate/setChainInfo', { chain: this.chain, chainInfo })
    }
  },
  async created () {
    console.debug('ChainHome.vue: created()', this.chain, this.$store.state.chain)
    if (!this.$store.state.candidate.chain || this.chain !== this.$store.state.chain) {
      // await this.$store.dispatch('setChain', { chain: this.chain })
      await this.setChain(this.chain)
    }
  },
  async mounted () {
    console.debug('ChainHome.vue: mounted()')
    // check api connection status
    var i = 0
    const interval = setInterval(async () => {
      i++
      if (this.$substrate[this.chain]) {
        console.info('ChainHome.vue: API found...')
        await this.$substrate[this.chain].isReady
        console.debug('ChainHome.vue: api.isReady')
        clearInterval(interval)
      }
      if (i > 10) {
        console.warn('ChainHome.vue: no API found...')
        clearInterval(interval)
      }
    }, 1000)
  },
  async beforeDestroy () {
    console.debug('ChainHome.vue: beforeDestroy()')
    await this.$substrate.polkadot.disconnect()
    await this.$substrate.kusama.disconnect()
    // await this.$store.dispatch('apiClose')
  }
})
</script>
