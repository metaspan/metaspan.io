<template>
  <v-container fluid  style="min-height:800px">
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
    <v-table>
      <thead>
        <th v-for="(head, idx) in headers" v-bind:key="idx">
          {{ head.text }}
        </th>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in result?.Validator?.nominators" v-bind:key="idx">
          <!-- {{ item }} -->
          <td>
            <div style="cursor:pointer">
              <ClickToCopy :display="shortStash(item.accountId)" :text="item.accountId" />
            </div>
          </td>
          <td class="text-right">
            <!-- {{ item.account.data.free }} -->
            {{ (toCoin(item.account?.data?.free || 0)).toLocaleString('en-GB', { maximumFractionDigits: 4 }) }}
          </td>
          <td class="text-center">
            <!-- <v-menu> -->
              {{ item.is1kv ? 'Yes' : 'No' }}
            <!-- </v-menu> -->
          </td>
          <td class="text-center">
            <!-- <a :href="`https://${chainId}.subscan.io/account/${item.accountId}?tab=vote`" target="_blank">[link]</a> -->
            <v-avatar size="18" tag="a" :href="`https://${chainId}.subscan.io/${item.accountId}?tab=vote`" target="_blank">
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
import { defineComponent, computed, inject, ref, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuery } from '@vue/apollo-composable'
import ClickToCopy from './ClickToCopy.vue'
import Loading from './Loading.vue'
import { GET_VALIDATOR_NOMINATORS } from '../graphql/queries/validators'
import { shortStash } from '../global/utils'
// import { VDataTable } from 'vuetify/labs/VDataTable'
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
    Loading
  },
  setup (props) {
    const { stash } = props
    console.debug('CandidateNominators.vue', stash)
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const decimals = computed(() => store.state.substrate.decimals)
    // const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false })
    const chainInfo = computed(() => substrate.chainInfo)

    const { result, loading, refetch, onResult } = useQuery(GET_VALIDATOR_NOMINATORS, {
      chain: chainId.value,
      stash: stash
    })

    // onResult((data: any) => {
    //   console.debug('onResult', data)
    // })

    console.debug('CandidateNominators.vue', 2)

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

    const mapItems = computed(() => {
      // return this.items
      console.debug('result.value', result.value)
      const items = result.value?.data?.Validator?.nominators?.map((m: any) => {
        console.debug(m)
        return {
          ...m, 
          shortStash: shortStash(m.accountId),
          balance: toCoin(m.account.data.free)
        }
      })
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

    // const loading = ref(false)
    // const items = ref([])
    const headers = ref([
      { text: 'Nom.', value: 'shortStash' },
      // { text: 'Id.', value: 'identity' },
      { text: 'Bal.', value: 'balance', align: 'right' },
      { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
      { text: '#', value: 'menu', width: '15px', align: 'right' }
    ])

    // const getNominatorsFromApi = () => {
    //   console.debug('getNominatorsFromApi()...')
    //   // this.loading = true
    //   // api.query.staking.nominators
    //   // const stash = 'Ew5NJucSyE17T4QYBhjbm1WYrGk2oULTHyjiJacLbCNfc4Q'
    //   let i = 0
    //   const interval = setInterval(async () => {
    //     i++
    //     try {
    //       if (substrate.api) {
    //         // const noms = await this.$substrate[this.chainId].query.staking.nominators.entries(stash)
    //         // noms.forEach(([key, nominator]) => {
    //         //   console.log('nkey', key.toString(), nominator.toString())
    //         // })
    //         const nominators = await substrate.api?.query.staking.nominators.entries()
    //         console.debug(`got ${nominators.length} entries !!`)
    //         const nominatorAddresses = nominators.map(([address]: any) => '' + address?.toHuman()[0])

    //         const vals = await substrate.api?.query.staking.validators.entries(stash)
    //         vals.forEach(([key, validator]) => {
    //           console.log('vkey', key.toString(), validator.toString())
    //         })

    //         // console.debug('noms', noms.toString(), 'vals', vals.toJSON())
    //         clearInterval(interval)
    //       }
    //     } catch (err) {
    //       console.warn(err)
    //       // attempt reconnect
    //       await substrate.api?.connect()
    //     }

    //     if (i > 10) {
    //       console.warn('CandidateNominators.vue: no API found')
    //       clearInterval(interval)
    //     }
    //   }, 1000)
    // }

    // const getNominators = async () => {
    //   console.debug('getNominators()...')
    //   // this.$store.dispatch('candidate/getNominators', { chainId: this.chainId, stash: this.stash })
    //   loading.value = true
    //   const { result, refetch } = useQuery(GET_VALIDATOR_NOMINATORS, {
    //     chain: chainId.value,
    //     stash: stash
    //   })
    //   // console.log('data', res.data.Nominators.map(n => n.accountId))
    //   console.debug('data', result.data)
    //   items.value = result.data?.Validator?.nominators || []
    //   loading.value = false
    // }

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
