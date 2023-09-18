<template>

  <v-container class="mt-0 pt-0">

    <v-toolbar>
      <v-toolbar-title>Pools ({{ chainId }})</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <v-card-title>Pools</v-card-title> -->
    <!-- <PoolTable class="d-none d-sm-block" :loading="loading" @clickRow="gotoItem" /> -->
    <PoolList :loading="loading" @clickRow="gotoItem" />
    <Loading :loading="loading"></Loading>
  </v-container>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, inject, onBeforeMount, nextTick} from 'vue'
import { useStore } from 'vuex'
import { hexToString } from '@polkadot/util'
import { IPool } from '../types/global'
// import PoolTable from './PoolTable.vue'
import PoolList from './PoolList.vue'
import { SubstrateAPI } from '../plugins/substrate'
import Loading from './Loading.vue'
import router from '@/router'

type TF = ReturnType<typeof setInterval>

export default defineComponent({
  name: 'Pools',
  components: {
    // PoolTable,
    PoolList,
    Loading
  },
  setup () {
    const store = useStore()
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    const chainId = computed(() => store.state.chainId)
    const apiConnected = computed(() => store.state.pool.apiConnected)
    const decimals = computed(() => store.state.substrate.decimals)
    const list = computed(() => store.getters['pool/list'])
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const loading = ref(false)
  
    watch(() => chainId.value, (newVal) => {
      store.dispatch('pool/setChainId', newVal) // ChainHome will see this..!
      router.push(`/${newVal}/pool`)
      loadPools()
    })

    const loadPools = async (): Promise<void> => {
      // console.debug('Pools.vue: searching for api', chainId.value)
      await substrate.api?.isReady
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

          await store.dispatch('pool/setList', pools)
          // console.debug('Pools.vue: clearing interval...')
          // clearInterval(this.interval)
          loading.value = false
        } catch (err) {
          console.debug(err)
          loading.value = false
        }
      }
    }

    onBeforeMount(() => {
      // nextTick(async () => {
      setTimeout(async () => {
        if (list.value.length === 0) {
          loadPools()
        }
      }, 250)
      // })
    })
  
    return {
      store,
      chainId,
      apiConnected,
      decimals,
      list,
      chainInfo,
      loading,
      substrate,
      loadPools
    }
  },
  data () {
    return {
      // loading: false,
      interval: {} as TF
    }
  },
  methods: {
    async gotoItem (item: IPool, evt: any) {
      // console.debug('gotoItem()', item, evt)
      await this.store.dispatch('pool/setPool', item)
      this.$router.push(`/${this.chainId}/pool/${item.id}`)
    },

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
