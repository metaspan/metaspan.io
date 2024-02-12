<template>
  <client-only>
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
  </client-only>
</template>

<script lang="ts">
import { SubstrateAPI } from '@/plugins/substrate'
import { defineComponent, computed, ref, type PropType, watch, onMounted } from 'vue'
import { type ICandidate } from '@/types/global'
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
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI
    const store = useStore()
    const substrateStore = useSubstrateStore()
    const chainId = computed(() => store.chainId)
    const decimals = computed<Record<number,number>>(() => substrateStore.decimals)
    const chainInfo = computed(() => substrateStore.chainInfo)
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
      if (!v || v === 0) return "0.000000"
      const info = {...chainInfo.value}
      const decimalPlaces = chainId.value === 'kusama' ? 12 : 10
      const denom = chainId.value === 'kusama' ? 1000000000000 : 10000000000
      return (v / denom).toFixed(6)
    }

    // placeholder for SSR
    var getBalance = async (candidate: ICandidate): Promise<void> => {}

    onBeforeMount(() => {
      console.debug('CandidateBalance.vue: onBeforeMount()...')

      getBalance = async (candidate: ICandidate) => {
        // console.debug('CandidateBalance.vue: getBalance()...', {...candidate})
        if(!substrate) {
          console.warn('substrate not created...')
          return
        }
        if(!substrate.connected) {
          console.debug('substrate not connected... waiting')
          await substrate.connect(chainId.value)
          // return
        }
        try {
          await substrate.api?.isReady
          if (!candidate || !candidate.stash) return
          var acct = await substrate.api?.query.system.account(candidate.stash) || {}
          // console.log('CandidateBalance.vue: acct', acct)
          // acct = acct?.toJSON() || {}
          // console.debug(acct)
          const { nonce, data }: any = acct
          const balance = data?.toJSON() || {}
          // console.debug('nonce, account', nonce.toNumber(), account)
          // const now = await this.$substrate[this.chainId].query.timestamp.now()
          // console.log(`: balance of ${balance.free} and a nonce of ${nonce}`)
          account.value.balance = balance
          account.value.nonce = nonce?.toNumber() || 0
          loading.value = false
          // console.debug('CandidateBalance.vue: getBalance(): account', {...account.value})
          // clearInterval(int)
          //return true
        } catch (err) {
          console.debug('CandidateBalance.vue: ERROR')
          console.error(err)
          await substrate.connect(chainId.value)
          //return false
        }
      }

      if(substrate?.connected) getBalance(candidate)

      watch(() => substrateStore.connected, (newVal) =>{
        console.debug('CandidateBalance.vue: watch() substrate.connected', newVal)
        if(newVal) getBalance(props.candidate)
      })
    })

    watch(() => props.candidate, (newVal) => {
      console.debug('CandidateBalance.vue: watch() props.candidate', newVal)
      if(newVal.stash !== '') getBalance(newVal)
    }, { immediate: true })

    onMounted(() => {
      getBalance(candidate)
    })

    return {
      chainId,
      decimals,
      chainInfo,
      model,
      loading,
      account,
      toCoin
    }
  }
})
</script>
