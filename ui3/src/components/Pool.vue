<template>

  <v-container fluid class="ma-0 pa-0">
    <v-toolbar>
      <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <!-- <v-toolbar-title>
      </v-toolbar-title> -->
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
                    <AccountLink :accountId="pool.roles?.root || ''" />
                  </td>
                </tr><tr>
                  <td>Nominator</td><td align="right">
                    <AccountLink :accountId="pool.roles?.nominator || ''" />
                  </td>
                </tr><tr>
                  <td>Depositor</td><td align="right">
                    <AccountLink :accountId="pool.roles?.depositor || ''" />
                  </td>
                </tr><tr>
                  <td>State Toggler</td><td align="right">
                    <AccountLink :accountId="pool.roles?.stateToggler || ''" />
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
import { defineComponent, computed, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { IPool } from '../types/global'
import AccountLink from './AccountLink.vue'
import PoolMembers from './PoolMembers.vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_POOL_VIEW } from '../graphql/queries/pools'

interface IData {
  loading: boolean
}
// eslint-disable-next-line
interface IMethods {
  // toCoin (val: number): string
}
interface IComputed {
  chainId: string
  chainInfo: any
  pool: IPool
  decimals: any
  // getStash: string
}
interface IProps {
  id: string
}

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
    const store = useStore()
    const route = useRoute()
    const chainId = computed(() => store.state.chainId)
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const decimals = computed(() => store.state['substrate/decimals'])
    const pool = ref<IPool>({ roles: {} } as IPool)
    var { result, loading, error, refetch, onResult } = useQuery(GET_POOL_VIEW, {
      chain: chainId.value,
      poolId: parseInt(props.id)
    }, {
      fetchPolicy: 'cache-and-network'
    })
    onResult((event: any) => {
      console.debug('onResult', event)
      const { loading, data, networkStatus } = event
      pool.value = {...data.Pool}
    })

    onBeforeMount(() => {
      console.debug('Pool.vue created()', chainId.value, pool.value, route.params)
      if (!pool.value || pool.value.id !== parseInt(route.params.id.toString())) {
        console.debug('ID not same, loading id')
        console.debug('params.id', typeof parseInt(route.params.id.toString()))
        console.debug('pool.id', typeof pool.value.id)
        store.dispatch('pool/setPool', { id: parseInt(route.params.id.toString()) })
      }

    })

    return {
      store,
      chainId,
      chainInfo,
      decimals,
      pool
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    chainId (newVal: string) {
      this.$router.push(`/${newVal}/pool`)
    }
  },
  methods: {
    toCoin (v: any) {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      const denom = this.chainId === 'kusama' ? 1000000000000 : 10000000000
      // return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
      return (v / denom).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    }
  }
})
</script>
