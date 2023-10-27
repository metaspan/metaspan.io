<template>

  <v-container style="max-width: 900px" class="mt-0 pt-0">
    <v-toolbar color="#FFFFFF00">
      <!-- <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn> -->
      <v-btn small icon :to="`/${chainId}/pool`"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-toolbar-title class="nowrap">Pool {{pool.id}}. {{pool.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-sheet>
      <table width="100%">
        <!-- <thead>
          <th>x</th><th>y</th>
        </thead> -->
        <tbody>
          <tr>
            <td width="20%">Points</td><td>{{toCoin(pool.points)}} {{chainInfo.tokenSymbol}}</td>
          </tr><tr>
            <td>State</td><td>{{pool.state}}</td>
          </tr>
          <!-- <tr>
            <td>Member count</td><td>{{pool.memberCounter}}</td>
          </tr> -->
          <tr>
            <td>Roles</td><td>
              <table width="100%">
                <tr>
                  <td width="30%">Root</td><td align="right">
                    {{ shortStash(pool?.roles?.root || '') }}
                    <AccountLink :accountId="pool?.roles?.root || ''" />
                  </td>
                </tr>
                <tr>
                  <td>Nominator</td><td align="right">
                    {{ shortStash(pool?.roles?.nominator || '') }}
                    <AccountLink :accountId="pool?.roles?.nominator || ''" />
                  </td>
                </tr>
                <tr>
                  <td>Depositor</td><td align="right">
                    {{ shortStash(pool?.roles?.depositor || '') }}
                    <AccountLink :accountId="pool?.roles?.depositor || ''" />
                  </td>
                </tr>
                <tr>
                  <td>Bouncer</td><td align="right">
                    {{ shortStash(pool?.roles?.bouncer || '') }}
                    <AccountLink :accountId="pool?.roles?.bouncer || ''" />
                  </td>
                </tr>
                <tr v-if="pool?.roles?.stateToggler">
                  <td>State Toggler</td><td align="right">
                    {{ shortStash(pool?.roles?.stateToggler || '') }}
                    <AccountLink :accountId="pool?.roles?.stateToggler || ''" />
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

    <PoolMembers :poolId="id" :members="pool.members || []"></PoolMembers>

  </v-container>

</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount, inject, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { SubstrateAPI } from '@/plugins/substrate'

import { IPool } from '../types/global'
import AccountLink from './AccountLink.vue'
import PoolMembers from './PoolMembers.vue'
import { shortStash } from '../global/utils'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    AccountLink,
    PoolMembers
  },
  setup (props) {
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })

    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const chainId = computed(() => store.state.chainId)
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const decimals = computed(() => store.state.substrate.decimals)
    const pool = ref<IPool>({ id: Number(props.id), name: '', roles: {} } as IPool)
    const loading = ref(false)

    watch(() => chainId.value, async (newVal) => {
      console.debug('Pool.vue: chainId changed', newVal)
      store.dispatch('pool/setChainId', newVal) // ChainHome will see this..!
      // await substrate.connect(chainId.value)
      // getPool()
      router.push(`/${newVal}/pool`)
    })

    const getPool = async () => {
      if(!substrate.connected) {
        console.debug('substrate not connected... waiting')
        await substrate.connect(chainId.value)
        // return
      }
      try {
        await substrate.api?.isReady
        if (!pool.value || !pool.value.id) return
        var res = await substrate.api?.query.nominationPools.bondedPools(props.id)
        const bondedPool: any = res?.toJSON()
        res = await substrate.api?.query.nominationPools.metadata(props.id)
        const metadata: any = res?.toJSON()
        console.debug('bondedPool', bondedPool)
        console.debug('metadata', metadata)
        pool.value = bondedPool // ?.toJSON()?.points
        // pool.value.points = bondedPool?.points
        // pool.value.state = bondedPool?.state
        // pool.value.roles = bondedPool?.roles
        // pool.value.name = metadata?.name
        res = await substrate.api?.query.nominationPools.poolMembers(bondedPool.roles.root)
        console.debug('poolMembers', res)
        const members: any = res?.toJSON()
        console.debug('members', members)
      } catch (e) {
        console.error('error', e)
      }
    }

    onBeforeMount(() => {
      getPool()
      console.debug('Pool.vue created()', chainId.value, pool.value, route.params)
      if (!pool.value || pool.value.id !== parseInt(route.params.id.toString())) {
        console.debug('ID not same, loading id')
        console.debug('params.id', typeof parseInt(route.params.id.toString()))
        console.debug('pool.id', typeof pool.value.id)
        store.dispatch('pool/setPool', { id: parseInt(route.params.id.toString()) })
      }
    })

    const toCoin = (v: any) => {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      console.debug('toCoin()', v, chainInfo.value, chainId.value)
      const decimalPlaces = chainInfo?.value?.tokenDecimals?.[0] || 0
      console.debug('decimals', decimals.value)
      const denom = decimals.value[decimalPlaces]
      // const denom = chainId.value === denom // 'kusama' ? 1000000000000 : 10000000000
      // return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
      return (v / denom).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    }

    return {
      store,
      chainId,
      chainInfo,
      loading,
      decimals,
      pool,
      shortStash,
      toCoin
    }
  },
  watch: {
    chainId (newVal: string) {
      this.$router.push(`/${newVal}/pool`)
    }
  },
})
</script>
