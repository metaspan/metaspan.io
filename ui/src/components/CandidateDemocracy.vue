<template>
  <v-card>
    <v-card-title>Democracy</v-card-title>
    <v-card-text>
      <!-- {{chainInfo}} -->
      <!-- {{democracy.direct}} -->

      <v-list>
        <v-list-item v-for="item in democracy.direct?.votes" v-bind:key="item[0]">
          {{item[0]}}, {{item[1]}} {{ formatAmount(item[1].standard?.balance) }} {{tokenSymbol}}
        </v-list-item>
      </v-list>

      {{democracy.delegations}}
      {{democracy.prior}}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
// import { } from '../global/utils'

export default Vue.extend({
  name: 'CandidateDemocracy',
  props: ['stash'],
  computed: {
    ...mapGetters('substrate', ['chainInfo']),
    ...mapState('substrate', ['decimals']),
    ...mapState('candidate', ['democracy']),
    tokenSymbol () {
      return this.chainInfo.tokenSymbol.toJSON()[0] || '???'
    }
  },
  methods: {
    formatAmount (amount: number) {
      // console.debug('formatAmount', amount, this.chainInfo.tokenDecimals.toJSON()[0])
      // {"ss58Format":2,"tokenDecimals":[12],"tokenSymbol":["KSM"]}
      const tokenDecimals = this.chainInfo.tokenDecimals.toJSON()[0] || 1
      console.debug('', tokenDecimals)
      const denom = this.decimals[tokenDecimals]
      return (amount / denom).toFixed(4)
    }
  },
  created () {
    // TODO get this from the chain
    this.$store.dispatch('candidate/getDemocracy', { stash: this.stash })
  }
})
</script>
