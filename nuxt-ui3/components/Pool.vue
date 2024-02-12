<template>

  <client-only>
  <v-container style="max-width: 900px" class="mt-0 pt-0">
    <v-toolbar color="#FFFFFF00">
      <!-- <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn> -->
      <v-btn small icon @click="navToPools()"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-toolbar-title class="nowrap">Pool {{pool?.id}}. {{pool?.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-sheet>
      <table width="100%">
        <tbody>
          <tr>
            <td width="20%">Points</td><td>{{ toCoin(pool?.points) }} {{ chainInfo.tokenSymbol }}</td>
          </tr><tr>
            <td>State</td><td>{{pool?.state}}</td>
          </tr>
          <tr>
            <td>Member count</td><td>{{ pool?.members?.length || 0 }}</td>
          </tr>
          <tr>
            <td>Roles</td><td>
              <table width="100%">
                <tr>
                  <td width="30%">Root</td><td align="right">
                    {{ shortStash(pool?.roles?.root || '') }}
                    <AccountLink :chain-id="chainId" :account-id="pool?.roles?.root || ''" />
                  </td>
                </tr>
                <tr>
                  <td>Nominator</td><td align="right">
                    {{ shortStash(pool?.roles?.nominator || '') }}
                    <AccountLink :chain-id="chainId" :accountId="pool?.roles?.nominator || ''" />
                  </td>
                </tr>
                <tr>
                  <td>Depositor</td><td align="right">
                    {{ shortStash(pool?.roles?.depositor || '') }}
                    <AccountLink :chain-id="chainId" :accountId="pool?.roles?.depositor || ''" />
                  </td>
                </tr>
                <tr>
                  <td>Bouncer</td><td align="right">
                    {{ shortStash(pool?.roles?.bouncer || '') }}
                    <AccountLink :chain-id="chainId" :accountId="pool?.roles?.bouncer || ''" />
                  </td>
                </tr>
                <tr v-if="pool?.roles?.stateToggler">
                  <td>State Toggler</td><td align="right">
                    {{ shortStash(pool?.roles?.stateToggler || '') }}
                    <AccountLink :chain-id="chainId" :accountId="pool?.roles?.stateToggler || ''" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- <tr>
            <td>name</td><td>{{pool.name}}</td>
          </tr> -->
        </tbody>
      </table>
    </v-sheet>

    <PoolMembers :poolId="poolId" :members="pool?.members || []"></PoolMembers>

  </v-container>
  </client-only>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount, watch } from 'vue'
import { hexToString } from '@polkadot/util'

import { SubstrateAPI } from '@/plugins/substrate'

import { type IPool, type IPoolMember } from '../types/global'
import AccountLink from './AccountLink.vue'
import PoolMembers from './PoolMembers.vue'
import { shortStash } from '../utils'

import { GET_POOL } from '~/graphql/pools'

export default defineComponent({
  // props: {
  //   id: {
  //     type: String,
  //     required: true
  //   }
  // },
  components: {
    AccountLink,
    PoolMembers
  },
  setup (props) {

    const store = useStore()
    const poolStore = usePoolStore()
    const substrateStore = useSubstrateStore()
    const route = useRoute()
    const router = useRouter()
    const chainId = computed(() => store.chainId)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const decimals = computed(() => substrateStore.decimals)
    const pools = computed<IPool[]>(() => poolStore.list || [])
    const poolId = computed(() => route.params.poolId.toString())
    const pool = computed<IPool>(() => poolStore.pool || {} as IPool)
    const loading = ref(false)

    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI

    // var refetch // = async (any: any): Promise<any> => {}
    // var onResult = (result: any) => {}
    var loadPools = async (): Promise<void> => {}

    onBeforeMount(async () => {
      console.debug('[[chainId]]/pool/[[id]].vue: onBeforeMount()', chainId.value, poolId.value)
      if (chainId.value !== route.params.chainId.toString()) {
        store.setChainId(route.params.chainId.toString())
      }

      const loadPools = async (): Promise<void> => {
        // console.debug('Pools.vue: searching for api', chainId.value)
        if (!substrate?.api) {
          console.debug('Pool.vue: no api found', chainId.value)
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

      if(pools.value.length === 0) {
        await loadPools()
        // let pool = pools.value.find((pool: IPool) => Number(pool.id) === Number(poolId.value))
        poolStore.setPool(poolId.value)
      }

      if (pool.value.id !== poolId.value) {
        poolStore.setPool(poolId.value)
      }

    })

    // listen for chainId changes
    watch(() => chainId.value, async (newVal) => {
      console.debug('Pool.vue: chainId changed', newVal)
      // store.dispatch('pool/setChainId', newVal) // ChainHome will see this..!
      poolStore.setChainId(newVal)
      // await substrate.connect(chainId.value)
      // getPool()
      router.push(`/${newVal}/pool`)
    })

    const toCoin = (v: any) => {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      console.debug('toCoin()', v, chainInfo.value, chainId.value)
      const decimalPlaces = chainInfo?.value?.tokenDecimals || 0
      console.debug('decimals', decimals.value)
      const denom = decimals.value[decimalPlaces]
      // const denom = chainId.value === denom // 'kusama' ? 1000000000000 : 10000000000
      // return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
      return (v / denom).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    }

    const navToPools = () => {
      router.push({
        name: `chainId-pool`,
        params: { chainId: chainId.value }
      })
    }

    return {
      store,
      chainId,
      chainInfo,
      loading,
      decimals,
      poolId,
      pool,
      shortStash,
      toCoin,
      navToPools
    }
  },
  watch: {
    chainId (newVal: string) {
      this.$router.push(`/${newVal}/pool`)
    }
  },
})
</script>
