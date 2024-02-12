<template>
  <client-only>
  <v-container style="max-width: 900px" class="mt-0 pt-0">
    <v-toolbar color="#FFFFFF00">
      <v-toolbar-title>Pools ({{ chainId }})</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-progress-linear indeterminate v-show="loading"></v-progress-linear>
    <PoolList :loading="loading" @clickRow="gotoItem" />
    <!-- <Loading :loading="loading"></Loading> -->
  </v-container>
  </client-only>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onBeforeMount } from 'vue'

import { hexToString } from '@polkadot/util'
import { type IPool } from '@/types/global'
// import PoolTable from './PoolTable.vue'
import PoolList from './PoolList.vue'
import { SubstrateAPI } from '@/plugins/substrate'
// import Loading from './Loading.vue'

type TF = ReturnType<typeof setInterval>

export default defineComponent({
  name: 'Pools',
  components: {
    // PoolTable,
    PoolList,
    // Loading
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const substrateStore = useSubstrateStore()
    const poolStore = usePoolStore()
    
    const chainId = computed(() => store.chainId)
    const apiConnected = computed(() => substrateStore.connected)
    const decimals = computed(() => substrateStore.decimals)
    const list = computed(() => poolStore.list)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const loading = ref(false)

    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI

    watch(() => chainId.value, (newVal) => {
      // store.dispatch('pool/setChainId', newVal) // ChainHome will see this..!
      poolStore.setChainId(newVal)
      router.push({
        name: 'chainId-pool',
        params: { chainId: newVal }
      })
      loadPools()
    })

    const gotoItem = (item: IPool, evt: any) => {
      console.debug('gotoItem()', item, evt)
      // await this.store.dispatch('pool/setPool', item)
      poolStore.setPool(item.id.toString())
      router.push(`/${chainId.value}/pool/${item.id}`)
    }

    var loadPools = async () => {}
    onBeforeMount(() => {

      loadPools = async (): Promise<void> => {
        // console.debug('Pools.vue: searching for api', chainId.value)
        if (!substrate?.api) {
          console.debug('Pools.vue: no api found', chainId.value)
          return
        }
        await substrate?.api?.isReady
        console.debug('Pools.vue: api ready', chainId.value)
        if (!loading.value) {
          try {
            const api = substrate.api
            // console.debug('Pools.vue', api)
            // let t: any
            const x: any = Number((await api?.query.nominationPools.lastPoolId() || 0).toString())
            console.log('lastPool', x)
            loading.value = true
            let promises = [] as any[]
            for (let i = 1; i <= x; i++) { promises.push(api?.query.nominationPools.bondedPools(i)) }
            let pools = await Promise.all(promises)
            // console.debug(pools)

            promises = []
            let metas = [] as any[]
            pools = pools.map((p, idx) => {
              const t = p.toJSON() || { state: 'Closed', memberCounter: 0, roles: {} }
              // console.log('t', t)
              t.id = idx + 1
              t.name = t.roles?.depositor || 'unknown' // root
              // console.debug(idx, 'stash', t.roles.root)
              // TODO what is this for?
              // promises.push(api.query.identity.identityOf(t.roles.depositor))
              metas.push(api?.query.nominationPools.metadata(t.id))
              return t
            })

            metas = await Promise.all(metas)
            // console.debug(metas)
            metas.forEach((m, idx) => {
              // console.debug(hexToString(m.toString()))
              // console.debug(m.toString())
              pools[idx].name = hexToString(m.toString())
            })

            // await store.dispatch('pool/setList', pools)
            poolStore.setList(pools)
            // console.debug('Pools.vue: clearing interval...')
            // clearInterval(this.interval)
            loading.value = false
          } catch (err) {
            console.debug(err)
            loading.value = false
          }
        }
      }

      setTimeout(async () => {
        if (list.value.length === 0) {
          loadPools()
        }
      }, 250)
    })

    const reload = async () => {
      console.debug('Pools.vue: reload()')
      await loadPools()
    }
  
    return {
      store,
      chainId,
      apiConnected,
      decimals,
      list,
      chainInfo,
      loading,
      substrate,
      loadPools,
      gotoItem,
      reload,
    }
  },
  data () {
    return {
      // loading: false,
      interval: {} as TF
    }
  },
  methods: {

    async reload () {
      await this.loadPools()
    },
    clearAllIntervals () {
      const int = parseInt(this.interval.toString())
      for (let i = 0; i <= int; i++) {
        try {
          clearInterval(i)
        } catch (err) {
          console.debug('Interval ' + i + ' not valid')
        }
      }
    }
  },
  async created () {
    // console.debug('Pools.vue created()', this.chainId, this.list?.length)
    // await this.substrate.api.connect(this.chainId)
    // if (this.list.length === 0) {
    //   nextTick(async () => {
    //     await this.loadPools()
    //     // await this.reload()
    //   })
    // }
  },
  // async mounted () {
  //   // this.$ga.page(`/${this.chainId}/pool`)
  // },
  beforeUnmount () {
    // console.debug('Pools.vue: beforeDestroy()')
    if (this.interval) clearInterval(this.interval)
  }
})
</script>
