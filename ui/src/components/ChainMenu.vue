<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        class="text-none"
        v-bind="attrs"
        v-on="on"
      >
      <v-img :src="icon" width="24px" height="24px"></v-img> {{chain}}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in chains"
        :key="index"
        @click="setChain(item)">
        <!-- <v-list-item-icon>
          <v-img :src="item.icon"></v-img>
        </v-list-item-icon> -->
        <v-list-item-title>{{ item.name }}</v-list-item-title>
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
  chain: string
  chains: any[]
  icon: any
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'ChainMenu',
  computed: {
    ...mapState(['chain', 'chains']),
    icon () {
      return this.icons[this.chain]
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
    setChain (item: any) {
      console.debug('setItem', item)
      this.$store.dispatch('setChain', { chain: item.id })
    }
  }
})
</script>
