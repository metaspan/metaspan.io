<template>
  <v-container class="mt-0 pt-0">
    <v-toolbar :loading="loading">
      <v-toolbar-title>1KV Nominations for {{ tokenSymbol }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="refetch" :loading="loading">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list :loading="loading">
      <v-list-item v-for="item in items.filter(f => f.address)" v-bind:key="item.address">
        <v-list-item-title>
          <v-row>
            <v-col>
              <a :href="`https://${chainId}.subscan.io/nominator/${item.address}`" target="_blank">
                {{ shortStash(item.address) }}
              </a>
              <!-- <ClickToCopy :display="shortStash(item.address)" :text="item.address"></ClickToCopy> -->
              <!-- {{ shortStash(item.address) }} -->
            </v-col>
            <v-col align="right">
              {{ toCoin(item.bonded).toLocaleString('en-gb', { minimumFractionDigits: 3, maximumFractionDigits: 3}) }}
              {{ tokenSymbol }}
            </v-col>
          </v-row>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-list>
            <v-list-item v-for="target in item.current" v-bind:key="target.stash" @click="gotoCandidate(target)">
              <template v-slot:prepend>
                <v-avatar size="small">
                  <Identicon :value="target.stash" :size="24" theme="polkadot"></Identicon>
                </v-avatar>
              </template>
              <v-list-item-title>
                {{ target.name }} {{ target.identity.sub? `/${target.identity.sub}` : '' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ target.stash }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <Loading :loading="loading" :absolute="true"></Loading>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import Identicon from './identicon/Identicon.vue'
import ClickToCopy from '@/components/ClickToCopy.vue'
import Loading from './Loading.vue'

interface ICurrent {
  name: string
  stash: string
  identity: {
    name: string
    sub: string
    verified: boolean
  }
}
interface IItem {
  address: string
  stash?: string
  bonded?: number
  chain?: string
  avgStake?: number
  newBondedAmount?: number
  nominationAmount?: number
  updatedAt?: string
  current?: ICurrent[]
}

const GET_1KV_NOMINATORS = gql`
query Query($chain: String!) {
  Nominators1kv(chain: $chain) {
    address
    stash
    bonded
    chain
    avgStake
    newBondedAmount
    nominationAmount
    updatedAt
    current {
      name
      stash
      identity {
        name
        sub
        verified
      }
    }
  }
}`

export default defineComponent({
  name: 'Nominations1kv',
  components: {
    // VDataTable,
    ClickToCopy,
    Identicon,
    Loading,
  },
  setup () {
    const store = useStore()
    const substrateStore = useSubstrateStore()
    const router = useRouter()
    const chainId = computed(() => store.chainId)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const tokenSymbol = computed(() => {
      // return chainInfo.value.tokenSymbol || ['???']
      return chainId.value === 'kusama' ? 'KSM' : 'DOT'
    })

    const decimals = computed(() => substrateStore.decimals)
    const display = useDisplay()
  
    watch(() => chainId.value, (newVal) => {
      refetch({ chain: newVal })
    })
  
    const items = ref<IItem[]>([])
    const headers: any[] = [
      { key: 'address', title: 'Address' },
      { key: 'bonded', title: 'Bonded' },
      { key: 'avgStake', title: 'Ang Stake' },
      // { key: 'address', title: 'Address' },
      // { key: 'address', title: 'Address' },
    ]

    const { result, loading, refetch, onResult } = useQuery(GET_1KV_NOMINATORS, {
      chain: chainId.value,
    })

    watch(() => chainInfo.value, (v) => {
      console.debug('watch', v)
    })

    onResult((queryResponse: any) => {
      console.debug('onResult', queryResponse.data.Nominators1kv)
      items.value = queryResponse.data.Nominators1kv?.map((m: any) => {
        return {
          address: m.address,
          stash: m.stash,
          bonded: m.bonded,
          chain: m.chain,
          avgStake: m.avgStake,
          newBondedAmount: m.newBondedAmount,
          nominationAmount: m.nominationAmount,
          updatedAt: m.updatedAt,
          current: m.current as any[],
        }
      })
      console.debug('items', items.value)
    })

    const toCoin = (v: any) => {
      // console.debug('toCoin()', v, chainInfo, chainId.value)
      var ret = 0
      try {
        const decimalPlaces = chainId.value === 'kusama' ? 12 : 10 // chainInfo.value.tokenDecimals?.toJSON()[0] || 0
        // console.debug(decimals.value)
        const denom = decimals.value[decimalPlaces]
        ret = Number(BigInt(v * 100) / BigInt(denom))/100 // .toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
      } catch (err) {
        console.error(err)
      }
      // console.debug('ret', ret)
      return ret
    }

    const gotoCandidate = (item: ICurrent) => {
      console.debug('gotoCandidate', item)
      // store.dispatch('substrate/setCandidate', item)
      router.push(`/${chainId.value}/candidate/${item.stash}`)
    }

    return {
      // icons,
      // getIcon,
      chainId,
      chainInfo,
      tokenSymbol,
      loading,
      refetch,
      items,
      headers,
      result,
      shortStash,
      toCoin,
      gotoCandidate,
    }
  },
})

</script>
