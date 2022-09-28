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
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Loading from './Loading.vue'

export default Vue.extend({
  name: 'CandidateBalance',
  props: {
    stash: {
      type: String,
      required: true
    }
  },
  components: { Loading },
  computed: {
    ...mapState(['chainId']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    ...mapState('candidate', ['candidate'])
  },
  data () {
    return {
      loading: true,
      account: {
        nonce: 0,
        balance: {
          free: 0,
          reserved: 0,
          miscFrozen: 0,
          feeFrozen: 0
        }
      }
    }
  },
  watch: {
    candidate: {
      deep: true,
      handler (val) {
        console.log('CandidateBalance.vue: watch.candidate()', val)
      }
    }
  },
  methods: {
    toCoin (v: number) {
      // return v / 1000000000000
      // console.debug('CandidateBalance.vue: toCoin()', v, this.chainInfo)
      // console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // console.debug('decimalPlaces', decimalPlaces)
      return v / this.decimals[decimalPlaces]
    },
    async getBalance () {
      console.debug('CandidateBalance.vue: getBalance()...')
      try {
        await this.$substrate[this.chainId].isReady
        const acct = await this.$substrate[this.chainId].query.system.account(this.stash)
        // console.debug(acct)
        const { nonce, data: balance } = acct
        // const now = await this.$substrate[this.chainId].query.timestamp.now()
        // console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`)
        this.account.balance = balance.toJSON()
        this.account.nonce = nonce.toNumber()
        this.loading = false
        console.debug('CandidateBalance.vue: getBalance(): account', this.account)
        // clearInterval(int)
        return true
      } catch (err) {
        console.debug('CandidateBalance.vue: ERROR')
        console.error(err)
        await this.$substrate.connect(this.chainId)
        return false
      }
    }
  },
  async created () {
    console.debug('CandidateBalance.vue created()', this.chainId)
    // >>>>>>>>>>>>>> not here, let the parent handle API connection!   <<<<<<<<<<<<<<<<<
    // if (!this.$substrate[this.chainId]) {
    //   await this.$substrate.connect(this.chainId)
    // }
    // if (!this.chainInfo) {
    //   console.warn('no chainInfo...')
    //   const chainInfo = await this.$substrate[this.chainId].registry.getChainProperties()
    //   console.log('chainInfo.tokenDecimals', chainInfo.tokenDecimals.toJSON()[0])
    //   await this.$store.dispatch('substrate/setChainInfo', { chainId: this.chainId, chainInfo })
    // }
  },
  mounted () {
    let count = 0
    const int = setInterval(async () => {
      count++
      if (this.$substrate[this.chainId]) {
        // var nominators = await this.$polkadot.api.query.staking.nominators(this.candidate.stash)
        // console.debug('nominators', this.candidate.stash, nominators)
        // var vals = await this.$polkadot.api.query.staking.validators(this.candidate.stash)
        // console.debug('vals', this.candidate.stash, vals)
        // api.query.system.account(<accountId>).
        if (await this.getBalance()) clearInterval(int)
      }
      if (count > 10) {
        console.debug('CandidateBalance.vue: no api found, clearing interval...')
        this.loading = false
        clearInterval(int)
      }
    }, 1000)
  }
})
</script>
