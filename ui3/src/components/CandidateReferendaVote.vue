<template>
  <v-container fluid class="ma-0 pa-0">

    <small>
    <v-row no-gutters v-for="([accountId, vote], idx) in refVote?.voteStack" :key="idx">
      <v-col class="text-no-wrap">
        <!-- {{ idx }}. -->
        <span v-if="vote.delegating">
          <v-icon size="18" color="grey">mdi-arrow-right</v-icon>
          {{ formatAmount(vote.delegating.balance, 1) }} {{ symbol }} {{ vote.delegating.conviction }}
        </span>

        <span v-if="vote.standard">
          <!-- {{ formatAmount(vote.standard.balance, 1) }} {{ getConviction(vote) }} -->
          <v-icon size="18" :color="ayeOrNay(vote.standard.vote).aye ? 'success' : 'red'">mdi-thumb-{{ayeOrNay(vote.standard.vote).aye ? 'up' : 'down'}}-outline</v-icon>
          {{ formatAmount(vote.standard?.balance, 2)}} {{ symbol }}
          ({{ getConviction(vote) }})
        </span>

        <span v-if="vote.splitAbstain">
          <v-icon size="18" color="purple">mdi-call-split</v-icon>
          (<v-icon size="12">mdi-arrow-up</v-icon>{{ formatAmount(vote.splitAbstain?.aye, 0) }},
          <v-icon size="12">mdi-arrow-down</v-icon>{{ formatAmount(vote.splitAbstain?.nay, 0) }},
          <v-icon size="12">mdi-arrow-left-right</v-icon>{{ formatAmount(vote?.splitAbstain?.abstain, 0) }})
        </span>

      </v-col>
      <!-- </v-list-item> -->
    </v-row>
    </small>

  </v-container>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import ClickToCopy from './ClickToCopy.vue'
import { shortStash } from '../global/utils'

export default defineComponent({
  name: 'CandidateReferendaVote',
  components: {
    ClickToCopy
  },
  props: {
    refVoting: { type: Array, required: true },
    stash: { type: String },
    referenda: { type: Object },
    voting: { type: Object }
  },
  setup (props) {
    const { stash, referenda, voting } = props
    const refVoting = ref(props.refVoting)
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const decimals = computed(() => store.state['substrate/decimals'])
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const convictions = {
        '0x00': { aye: false, nay: true, conviction: '0x' },
        '0x01': { aye: false, nay: true, conviction: '1x' },
        '0x02': { aye: false, nay: true, conviction: '2x' },
        '0x03': { aye: false, nay: true, conviction: '3x' },
        '0x04': { aye: false, nay: true, conviction: '4x' },
        '0x05': { aye: false, nay: true, conviction: '5x' },
        '0x06': { aye: false, nay: true, conviction: '6x' },
        '0x07': { aye: false, nay: true, conviction: '7x' },
        '0x08': { aye: false, nay: true, conviction: '8x' },
        '0x80': { aye: true, nay: false, conviction: '0x' },
        '0x81': { aye: true, nay: false, conviction: '1x' },
        '0x82': { aye: true, nay: false, conviction: '2x' },
        '0x83': { aye: true, nay: false, conviction: '3x' },
        '0x84': { aye: true, nay: false, conviction: '4x' },
        '0x85': { aye: true, nay: false, conviction: '5x' },
        '0x86': { aye: true, nay: false, conviction: '6x' },
        '0x87': { aye: true, nay: false, conviction: '7x' },
        '0x88': { aye: true, nay: false, conviction: '8x' }
      } as Record<string, any>

    // what is this?
    const refVote = ref<Record<any, any>>({})

    const symbol = computed(() => {
      // const symbol = this.chainInfo.tokenSymbol.toJSON()[0]
      const symbol = chainId.value === 'kusama' ? 'KSM' : 'DOT'
      // console.debug('getSymbol', symbol)
      return symbol
    })
    const delegating = computed<boolean>(() => refVote.value?.stack?.length > 0)
    const casting = computed(() => !refVote?.value?.stack || Object.keys(refVote.value.stack).length === 0 || refVote.value.stack.length === 0)
    // const casting = computed<boolean>(() => !delegating.value)

    const getConviction = (item: any) => {
      // console.debug('getConviction', item)
      const cv = item?.standard?.vote || ''
      // console.debug('cv', cv)
      return convictions[cv]?.conviction
    }
    const getStack = () => {
      const ret = refVote.value.stack.map((m: string) => shortStash(m)).join(',') || ''
      // console.debug('getStack', ret)
      return ret
    }

    watch(() => refVoting.value, newVal => {
      // console.debug('refVoting changed...', newVal)
      refVote.value = newVal[`r${referenda?.id}` as keyof typeof newVal] as any
    })
    
    onBeforeMount(() => {
      // console.debug('CandidateReferendaVote', {...referenda}, {...refVoting.value})
      const tmpReferenda = {...referenda}
      const refId = tmpReferenda.id || ''
      // console.debug('refId', refId)
      refVote.value = refVoting.value.find((f: any) => f.refId === refId) as Record<any, any>
      // console.log('refVote', refVote.value)
    })

    return {
      chainId,
      decimals,
      chainInfo,
      convictions,
      refVote,
      symbol,
      casting,
      delegating,
      shortStash,
      getConviction,
      getStack
    }
  },
  methods: {
    // getRefVote (id: any) {
    //   return this.refVoting[id]
    // },
    formatAmount (amount: number, decimals: number) {
      // const tokenDecimals = this.chainInfo.tokenDecimals.toJSON()[0] || 1
      // // console.debug('', tokenDecimals)
      // const denom = this.decimals[tokenDecimals]
      const denom = this.chainId === 'kusama' ? 1000000000000 : 10000000000
      return (amount / denom).toFixed(decimals)
    },
    ayeOrNay (key: string) {
      // const keyType = key of this.convictions
      return this.convictions[key]
    }
  }
})
</script>
