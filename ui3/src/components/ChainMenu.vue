<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn
        class="text-none"
        v-bind="props"
      >
        <v-img :src="getImageUrl(chainId)" width="20px" height="20px"></v-img>
        <span class="d-none d-sm-inline">&nbsp;{{chainId}}</span>
        <v-icon class="d-none d-sm-inline">mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in chains"
        :key="index"
        @click="setChain(item)"
        :input-value="item.id === chainId"
        >
        <template v-slot:prepend>
          <v-img :src="getImageUrl(item.id)" width="20px" height="20px"></v-img>
        </template>
        <!-- <v-list-item-icon>
          <v-img :src="item.icon"></v-img>
        </v-list-item-icon> -->
        <!-- <template v-slot:default="{ active }"> -->
          <v-list-item-title>&nbsp;{{ item.name }}</v-list-item-title>
        <!-- </template> -->
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { SubstrateAPI } from '../plugins/substrate'

// interface IData {
//   icons: Record<string, any>
// }
// // eslint-disable-next-line
// interface IMethods {
//   setChain(item: any): void
// }
// interface IComputed {
//   chainId: string
//   chains: any[]
//   chain: any
//   icon: any
// }
// // eslint-disable-next-line
// interface IProps {}

export default defineComponent({
  name: 'ChainMenu',
  setup () {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const chainInfo = computed(() => store.state.chainInfo)
    const chains = computed(() => store.state.chains)
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    const route = useRoute()
    const router = useRouter()
    // const icons = ref({
    //   kusama: import('@/assets/kusama-logo.png'),
    //   polkadot: import('@/assets/polkadot-logo.png')
    // } as Record<string, string>)
    // const getIcon = (): string => {
    //   return icons.value[chainId.value]
    // }
    const getImageUrl = (chainId: string) => {
      return new URL(`../assets/${chainId}-logo.png`, import.meta.url).href
    }
    const getChain = (): any => {
      return chains.value[chainId.value] || {}
    }
    const setChain = async (_chain: any) => {
      console.debug('ChainMenu.vue: setChain', chainId.value, _chain.id)
      // console.debug('ChainMenu.vue: setChain', route, router)
      if (chainId.value === _chain.id) return
      // const newPath = route.fullPath.replace(chainId.value, _chain.id)
      // console.debug('ChainMenu.vue: setChain', route.fullPath, newPath)
      // this.$store.dispatch('setChainId', _chain.id)
      await substrate.connect(_chain.id)
      //chainInfo = await substrate.api?.isReady
      const chainInfo = JSON.parse(substrate.api?.registry?.getChainProperties()?.toString() || '{}')
      // console.debug('ChainMenu.vue: chainInfo', chainInfo)
      // console.debug('ChainHome.vue: reading chainId info()...')
      // const chainInfo = await substrate.api?.registry.getChainProperties()
      console.log('chainInfo.tokenDecimals', {...chainInfo})
      // TODO: let parent do this?
      await store.dispatch('setChainId', _chain.id)
      await store.dispatch('substrate/setChainInfo', { chainId: _chain.id, chainInfo })
      // await nextTick()
      // router.push(newPath)
    }
    return {
      // icons,
      // getIcon,
      getImageUrl,
      chainId,
      chains,
      getChain,
      setChain
    }
  },
  // computed: {
  //   // icon () {
  //   //   return this.icons[this.chainId]
  //   // },
  //   // chain () {
  //   //   // console.debug('chain()', this.chains)
  //   //   return this.chains[this.chainId] || {}
  //   // }
  // },
})
</script>
