<template>

  <v-container style="max-width: 900px" class="mt-0 pt-0">
    <v-toolbar color="#FFFFFF00">
      <!-- <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn> -->
      <v-btn small icon :to="`/${chainId}/pool`"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-toolbar-title class="nowrap">Pool {{pool?.id}}. {{pool?.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <!-- |{{ pool }}| -->

    <v-sheet>
      <table width="100%">
        <!-- <thead>
          <th>x</th><th>y</th>
        </thead> -->
        <tbody>
          <tr>
            <td width="20%">Points</td><td>{{toCoin(pool?.points)}} {{chainInfo.tokenSymbol[0]}}</td>
          </tr><tr>
            <td>State</td><td>{{pool?.state}}</td>
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

    <PoolMembers :poolId="id" :members="pool?.members || []"></PoolMembers>

  </v-container>

</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
// import { SubstrateAPI } from '@/plugins/substrate'

import { IPool, IPoolMember } from '../types/global'
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
    // const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })

    const store = useStore()
    // const route = useRoute()
    const router = useRouter()
    const chainId = computed(() => store.state.chainId)
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const decimals = computed(() => store.state.substrate.decimals)
    const pools = computed<IPool[]>(() => store.getters['pool/list'] || [])
    const pool = computed<IPool | undefined>(() => getPool())
    const loading = ref(false)

    watch(() => chainId.value, async (newVal) => {
      console.debug('Pool.vue: chainId changed', newVal)
      store.dispatch('pool/setChainId', newVal) // ChainHome will see this..!
      // await substrate.connect(chainId.value)
      // getPool()
      router.push(`/${newVal}/pool`)
    })

    const getPool = (): IPool | undefined => {
      console.debug('getPool...', pool.value)
      if (pools.value.length === 0) {
        router.push(`/${chainId.value}/pool`)
      }
      const p = pools.value.find((pool: IPool) => Number(pool.id) === Number(props.id) )
      // console.debug('done', pool.value)
      return p
    }

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
