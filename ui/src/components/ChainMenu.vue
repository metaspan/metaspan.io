<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        class="text-none"
        v-bind="attrs"
        v-on="on"
      >
        <v-img :src="icon" width="24px" height="24px"></v-img><span class="d-none d-sm-inline"> {{chain.name}}</span> <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in chains"
        :key="index"
        @click="setChain(item)"
        :input-value="item.id === chainId"
        >
        <!-- <v-list-item-icon>
          <v-img :src="item.icon"></v-img>
        </v-list-item-icon> -->
        <!-- <template v-slot:default="{ active }"> -->
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        <!-- </template> -->
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

interface IData {
  icons: Record<string, any>
}
// eslint-disable-next-line
interface IMethods {
  setChain(item: any): void
}
interface IComputed {
  chainId: string
  chains: any[]
  chain: any
  icon: any
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'ChainMenu',
  computed: {
    ...mapState(['chainId', 'chains']),
    icon () {
      return this.icons[this.chainId]
    },
    chain () {
      // console.debug('chain()', this.chains)
      return this.chains[this.chainId] || {}
    }
  },
  data () {
    return {
      icons: {
        kusama: require('@/assets/kusama-logo.png'),
        polkadot: require('@/assets/polkadot-logo.png')
      }
    }
  },
  methods: {
    setChain (_chain: any) {
      console.debug('setChain', _chain.id)
      this.$store.dispatch('setChain', _chain.id)
      // this.$store.dispatch('setChain', _chain.id)
      // this.$router.push(`/${chain.id}/`)
    }
  }
})
</script>
