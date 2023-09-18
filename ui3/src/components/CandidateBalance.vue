<template>
  <v-card height="100%" elevation="1" :loading="loading">
    <v-card-title>Balance</v-card-title>
    <v-card-text>
      <table width="100%">
        <tr>
          <td>free</td><td class="text-right">{{toCoin(account.balance.free)}}</td>
        </tr>
        <tr>
          <td>reserved</td><td class="text-right">{{toCoin(account.balance.reserved)}}</td>
        </tr>
        <tr>
          <td>miscFrozen</td><td class="text-right">{{toCoin(account.balance.miscFrozen)}}</td>
        </tr>
        <tr>
          <td>feeFrozen</td><td class="text-right">{{toCoin(account.balance.feeFrozen)}}</td>
        </tr>
      </table>
    </v-card-text>
    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </v-card>
</template>

<script lang="ts">
import { SubstrateAPI } from '@/plugins/substrate'
import { defineComponent, computed, ref, inject, PropType, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ICandidate } from '@/types/global'
import Loading from './Loading.vue'

export default defineComponent({
  name: 'CandidateBalance',
  props: {
    candidate: {
      type: Object as PropType<ICandidate>, 
      required: true
    }
  },
  components: { Loading },
  setup (props) {
    const { candidate } = props
    const store = useStore()
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    const chainId = computed(() => store.state.chainId)
    const decimals = computed<Record<number,number>>(() => store.state['substrate/decimals'])
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    // const candidate = computed(() => store.state['candidate/candidate'])
    const model = ref(candidate)

    const loading = ref(true)
    const account = ref({
      nonce: 0,
      balance: {
        free: 0,
        reserved: 0,
        miscFrozen: 0,
        feeFrozen: 0
      }
    })
    const toCoin = (v: number) => {
      // return v / 1000000000000
      if (!v || v === 0) return "0.000000"
      // console.debug('CandidateBalance.vue: toCoin()', v, {...chainInfo})
      // console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      const info = {...chainInfo.value}
      // console.debug(info.tokenDecimals)
      // const decimalPlaces = info.tokenDecimals //.toJSON()[0]
      const decimalPlaces = chainId.value === 'kusama' ? 12 : 10
      const denom = chainId.value === 'kusama' ? 1000000000000 : 10000000000
      // const decimalPlaces = chainInfo.value?.tokenDecimals?.toJSON()[0] || 0
      // console.debug('decimalPlaces', decimalPlaces)
      // return v / decimals.value[decimalPlaces]
      return (v / denom).toFixed(6)
    }
    const getBalance = async (candidate: ICandidate) => {
      // console.debug('CandidateBalance.vue: getBalance()...', {...candidate})
      if(!substrate.connected) {
        console.debug('substrate not connected... waiting')
        await substrate.connect(chainId.value)
        // return
      }
      try {
        await substrate.api?.isReady
        if (!candidate || !candidate.stash) return
        var acct = await substrate.api?.query.system.account(candidate.stash)
        // console.log('CandidateBalance.vue: acct', acct)
        // acct = acct?.toJSON() || {}
        // console.debug(acct)
        const { nonce, data }: any = acct
        const balance = data.toJSON()
        // console.debug('nonce, account', nonce.toNumber(), account)
        // const now = await this.$substrate[this.chainId].query.timestamp.now()
        // console.log(`: balance of ${balance.free} and a nonce of ${nonce}`)
        account.value.balance = balance
        account.value.nonce = nonce.toNumber()
        loading.value = false
        // console.debug('CandidateBalance.vue: getBalance(): account', {...account.value})
        // clearInterval(int)
        return true
      } catch (err) {
        console.debug('CandidateBalance.vue: ERROR')
        console.error(err)
        await substrate.connect(chainId.value)
        return false
      }
    }
    watch(() => substrate.connected, (newVal) =>{
      console.debug('CandidateBalance.vue: watch() substrate.connected', newVal)
      if(newVal) getBalance(props.candidate)
    })
    watch(() => props.candidate, (newVal) => {
      console.debug('CandidateBalance.vue: watch() props.candidate', newVal)
      if(newVal.stash !== '') getBalance(newVal)
    }, { immediate: true })

    // onMounted(() => {
    //   let count = 0
    //   const int = setInterval(async () => {
    //     count++
    //     if (substrate.api) {
    //       if (await getBalance(candidate)) clearInterval(int)
    //     }
    //     if (count > 10) {
    //       console.debug('CandidateBalance.vue: no api found, clearing interval...')
    //       loading.value = false
    //       clearInterval(int)
    //     }
    //   }, 1000)
    // })
    getBalance(candidate)

    return {
      chainId,
      decimals,
      chainInfo,
      // candidate,
      model,
      loading,
      account,
      // getBalance,
      toCoin
    }
  }
})
</script>
