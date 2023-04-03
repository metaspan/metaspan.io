<template>
  <div>
    <!-- {{ refVote }} -->
    <v-row density="compact">
      <v-col align-self="center" class="col-3" v-if="casting">
        <v-icon small>mdi-arrow-right</v-icon>Casting:
      </v-col>
      <v-col align-self="center" class="col-3" v-if="delegating">
        <v-icon small class="col-1">mdi-arrow-decision-auto</v-icon> Delegating:
      </v-col>
      <v-col align-self="center" class="col-3" v-if="!(casting || delegating)">
        <v-icon small class="col-1">mdi-arrow-decision-auto</v-icon> ???: {{casting}} {{delegating}}
      </v-col>

      <v-col align-self="center">
        <span v-show="(!(refVote?.voted?.standard || refVote?.voted?.splitAbstain))"> <em>No vote found</em> </span>
        <span v-if="refVote?.voted?.splitAbstain">
          <v-icon small class="col-1" color="purple">mdi-call-split</v-icon>
          <!-- {{refVote}} -->
          {
          aye:{{ formatAmount(refVote?.voted?.splitAbstain?.aye, 1) }},
          nay:{{ formatAmount(refVote?.voted?.splitAbstain?.nay, 1) }},
          abstain:{{ formatAmount(refVote?.voted?.splitAbstain?.abstain, 1) }}
          }
        </span>
        <span v-if="refVote?.voted?.standard">
          <v-icon small class="col-1" :color="ayeOrNay(refVote.voted.standard.vote).aye ? 'success' : 'red'">mdi-thumb-{{ayeOrNay(refVote.voted.standard.vote).aye ? 'up' : 'down'}}-outline</v-icon>
          {{ formatAmount(refVote?.voted?.standard?.balance, 2)}} {{ symbol }}
          ({{ getConviction(refVote) }})
          <!-- {{referenda.casting.votes}} -->
        </span>
      </v-col>
    </v-row>

    <v-row dense v-if="delegating">
      <v-col align-self="center">
        Delegation route:
      </v-col>
      <v-col align-self="center">
      <!-- {{ getStack() }} -->
        <span v-for="(accountId, idx) in refVote.stack" v-bind:key="idx">
          <ClickToCopy
          :display="(idx+1) +':'+shortStash(accountId)" :text="accountId"></ClickToCopy>
        </span>
      </v-col>
    </v-row>

    <!-- <v-row dense v-if="referenda.delegating">
      <v-col class="col-3">
        <v-icon small class="col-1">mdi-arrow-decision-auto</v-icon> Delegating:
      </v-col>
      <v-col align-self="center">
        {{formatAmount(referenda.delegating.balance, 3)}} {{chainInfo.tokenSymbol}}
        <ClickToCopy :display="shortStash(referenda.delegating.target)" :text="referenda.delegating.target"></ClickToCopy>
      </v-col>
    </v-row> -->

    <!-- <v-row>
      <v-col>
        {{referenda.delegating}} ||
        {{refVote}}
      </v-col>
    </v-row> -->
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
// import { shortStash } from '../global/utils'
import ClickToCopy from './ClickToCopy.vue'

interface IData {
  refVote: any
  convictions: Record<string, any>
}
// eslint-disable-next-line
interface IMethods {
  shortStash (stash: string): string
  formatAmount (amount: number, decimals: number): string
  getConviction (item: any): string
  getStack (): string
  ayeOrNay (key: any): any
}
interface IComputed {
  chainId: string
  decimals: any[]
  chainInfo: any
  symbol: string
  casting: boolean
  delegating: boolean
}
interface IProps {
  refVoting: any
  stash: string
  referenda: any
  voting: any
}

export default defineComponent({
  name: 'CandidateReferendaVote',
  components: {
    ClickToCopy
  },
  props: {
    refVoting: { type: Object },
    stash: { type: String },
    referenda: { type: Object },
    voting: { type: Object }
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    symbol () {
      // const symbol = this.chainInfo.tokenSymbol.toJSON()[0]
      const symbol = this.chainId === 'kusama' ? 'KSM' : 'DOT'
      console.debug('getSymbol', symbol)
      return symbol
    },
    casting () { return !this.refVote?.stack || this.refVote?.stack.length === 0 },
    delegating () { return this.refVote?.stack.length > 0 }
  },
  data: () => {
    return {
      refVote: {} as any,
      convictions: {
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
    shortStash (stash: string): string {
      return stash.slice(0, 6) + '...' + stash.slice(-6)
    },
    ayeOrNay (key: string) {
      // const keyType = key of this.convictions
      return this.convictions[key]
    },
    getConviction (item: any) {
      console.debug('getConviction', item)
      const cv = item?.voted?.standard?.vote || ''
      console.debug('cv', cv)
      return this.convictions[cv]?.conviction
    },
    getStack () {
      const ret = this.refVote?.stack.map((m: string) => this.shortStash(m)).join(',') || ''
      console.debug('getStack', ret)
      return ret
    }
  },
  async created () {
    console.debug('CandidateReferendaVote', this.referenda, this.refVoting)
    const refId = this.referenda?.id || ''
    console.debug('refId', refId)
    this.refVote = this.refVoting ? this.refVoting[refId] : null
    console.log('refVote', this.refVote)
  }
})
</script>
