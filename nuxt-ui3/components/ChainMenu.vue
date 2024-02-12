<template>
  <client-only>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn
        class="text-none"
        v-bind="props"
      >
        <v-img :src="imageUrl" width="20px" height="20px"></v-img>
        <span class="d-none d-sm-inline">&nbsp;{{ chain.name }}</span>
        <v-icon class="d-none d-sm-inline">mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in chains"
        :key="index"
        :title="item.name"
        @click="setChain(item)"
        :input-value="item.id === chainId"
        >
        <template v-slot:prepend>
          <v-img :src="`/image/${item.id}-logo.png`" width="20px" height="20px" style="margin-right: 5px;"></v-img>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
  </client-only>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { type IChainState } from '@/stores/substrate'
import { SubstrateAPI } from '@/plugins/substrate'

export default defineComponent({
  name: 'ChainMenu',
  setup () {
    const store = useStore()
    const substrateStore = useSubstrateStore()

    const chainId = computed(() => store.chainId)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const chains = computed(() => substrateStore.chains)
    const chain = computed(() => chains.value[chainId.value] || {})
    const items = computed(() => Object.keys(chains.value).map((chainId: string) => {
      return {
        id: chainId,
        name: chains.value[chainId].name
      }
    }))
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI

    const route = useRoute()
    const router = useRouter()

    const imageUrl = computed(() => {
      // const url = new URL(`/image/${chainId}-logo.png`, import.meta.url).href
      const url = `/image/${chainId.value}-logo.png`
      // console.debug('ChainMenu.vue: getImageUrl', chainId, url)
      return url
    })

    const setChain = async (_chain: IChainState) => {
      console.debug('ChainMenu.vue: setChain', chainId.value, _chain.name)
      // console.debug('ChainMenu.vue: setChain', route, router)
      if (chainId.value === _chain.id) return
      store.setChainId(_chain.id)
      // let substrate listen to the new chainId...

      // const newPath = route.fullPath.replace(chainId.value, _chain.id)
      // console.debug('ChainMenu.vue: setChain', route, newPath)
      // // this.$store.dispatch('setChainId', _chain.id)
      // await substrate.connect(_chain.id)
      // //chainInfo = await substrate.api?.isReady
      // const chainInfo = JSON.parse(substrate.api?.registry?.getChainProperties()?.toString() || '{}')
      // // console.debug('ChainMenu.vue: chainInfo', chainInfo)
      // // const chainInfo = await substrate.api?.registry.getChainProperties()
      // console.log('chainInfo.tokenDecimals', {...chainInfo})
      // store.setChainId(_chain.id)
      // substrateStore.setChainInfo({ chainId: _chain.id, chainInfo })
      // // NO redirect HERE, let the individual /${chain}/${component} do this
      // // await nextTick()
      // // router.push(newPath)
    }

    return {
      // icons,
      // getIcon,
      imageUrl,
      items,
      chainId,
      chains,
      chain,
      setChain
    }
  }
})
</script>
