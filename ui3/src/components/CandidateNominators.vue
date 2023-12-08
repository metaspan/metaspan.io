<template>
  <v-container fluid style="min-height:800px">
    <v-toolbar elevation="0">
      <v-toolbar-title>Nominators (
        {{totalNominations}} 
        {{chainId}}
        )</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="refetch">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- {{ result.Validator.nominators }} -->
    <v-progress-linear indeterminate v-show="loading"></v-progress-linear>
    <v-table>
      <thead>
        <th v-for="(head, idx) in headers" v-bind:key="idx">
          {{ head.text }}
        </th>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in mapItems" v-bind:key="idx">
          <!-- {{ item }} -->
          <td>
            <div style="cursor:pointer">
              <v-row>
                <ClickToCopy :display="shortStash(item.accountId)" :text="item.accountId" />&nbsp;
                <v-chip color="primary" v-if="item.is1kv">1KV</v-chip>
              </v-row>
            </div>
          </td>
          <td class="text-right">
            {{ (toCoin(item.account?.data?.free || 0)).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </td>
          <!-- <td class="text-center">
              {{ item.is1kv ? 'Yes' : 'No' }}
          </td> -->
          <td class="text-center">
            <!-- <a :href="`https://${chainId}.subscan.io/account/${item.accountId}?tab=vote`" target="_blank">[link]</a> -->
            <v-avatar size="18" tag="a" :href="`https://${chainId}.subscan.io/nominator/${item.accountId}?tab=vote`" target="_blank">
              <v-img max-height="16" max-width="16" src="/image/subscan-logo.png"></v-img>
            </v-avatar>
          </td>
        </tr>
      </tbody>

    </v-table>
    <!-- <Loading :loading="loading" :absolute="true" :size="75"></Loading> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, inject, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useQuery } from '@vue/apollo-composable'
import ClickToCopy from './ClickToCopy.vue'
// import Loading from './Loading.vue'
import { GET_VALIDATOR_NOMINATORS } from '../graphql/queries/validators'
import { shortStash } from '../global/utils'
import { SubstrateAPI } from '../plugins/substrate'

export default defineComponent({
  props: {
    stash: {
      type: String,
      required: true
    },
  },
  components: {
    // VDataTable,
    ClickToCopy,
    // Loading
  },
  setup (props) {
    const { stash } = props
    console.debug('CandidateNominators.vue', stash)
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const decimals = computed(() => store.state.substrate.decimals)
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    // const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false })
    // const chainInfo = computed(() => substrate.chainInfo)

    const { result, loading, refetch, onResult } = useQuery(GET_VALIDATOR_NOMINATORS, {
      chain: chainId.value,
      stash: stash
    })

    onResult((data: any) => {
      console.debug('onResult', data)
    })

    console.debug('CandidateNominators.vue', 2)

    const toCoin = (v: any) => {
      // console.debug('toCoin()', v, chainInfo, chainId.value)
      var ret = 0
      try {
        const decimalPlaces = chainInfo.value.tokenDecimals?.[0] || 0
        // const decimalPlaces = chainId.value === 'kusama' ? 12 : 10
        // console.debug(decimals.value)
        const denom = decimals.value[decimalPlaces]
        ret = Number(BigInt(v * 100) / BigInt(denom))/100 // .toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
      } catch (err) {
        console.error(err)
      }
      // console.debug('ret', ret)
      return ret
    }

    const mapItems = computed(() => {
      // return this.items
      console.debug('result.value', result.value)
      const items = result.value?.Candidate?.nominators?.map((m: any) => {
        // console.debug(m)
        return {
          ...m, 
          shortStash: shortStash(m.accountId),
          balance: toCoin(m.account.data.free)
        }
      }).sort((a: any, b: any) => {
        return b.balance - a.balance
      })
      console.debug('mapItems', items)
      return items
    })

    const totalNominations = computed(() => {
      // console.debug('totalNominations', mapItems.value)
      const subtot = mapItems.value?.reduce((subtot: number, r: any) => {
        // console.debug('totalNominations', subtot, r)
        return subtot + (parseInt(r.account?.data?.free) || 0)
      }, 0) || 0
      // console.debug('subtot', subtot)
      return toCoin(subtot)
    })

    const headers = ref([
      { text: 'Nom.', value: 'shortStash' },
      // { text: 'Id.', value: 'identity' },
      { text: 'Bal.', value: 'balance', align: 'right' },
      // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
      { text: '↗️', value: 'menu', width: '15px', align: 'right' }
    ])

    onBeforeMount(() => {
      console.debug('CandidateNominators.vue: mounted()', chainId.value, stash)
      // getNominators()
      refetch()
    })

    return {
      chainId,
      decimals,
      chainInfo,
      loading,
      result,
      refetch,
      // items,
      headers,
      toCoin,
      // getNominatorsFromApi,
      mapItems,
      totalNominations,
      shortStash
    }
  }
})
</script>
