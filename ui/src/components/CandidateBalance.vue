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
    ...mapState(['chain']),
    ...mapGetters('substrate', ['chainInfo'])
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
      },
      decimals: {
        0: 1,
        1: 10,
        2: 100,
        3: 1000,
        4: 10000,
        5: 100000,
        6: 1000000,
        7: 10000000,
        8: 100000000,
        9: 1000000000,
        10: 10000000000,
        11: 100000000000,
        12: 1000000000000
      }
    }
  },
  methods: {
    toCoin (v: number) {
      // return v / 1000000000000
      console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0]
      return v / this.decimals[decimalPlaces]
    }
  },
  async created () {
    console.debug('CandidateBalance.vue created()', this.chain)
    let count = 0
    const int = setInterval(async () => {
      count++
      if (this.$substrate[this.chain]) {
        await this.$substrate[this.chain].isReady
        // var nominators = await this.$polkadot.api.query.staking.nominators(this.candidate.stash)
        // console.debug('nominators', this.candidate.stash, nominators)
        // var vals = await this.$polkadot.api.query.staking.validators(this.candidate.stash)
        // console.debug('vals', this.candidate.stash, vals)
        // api.query.system.account(<accountId>).
        try {
          const acct = await this.$substrate[this.chain].query.system.account(this.stash)
          // console.debug(acct)
          const now = await this.$substrate[this.chain].query.timestamp.now()
          const { nonce, data: balance } = acct
          console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`)
          this.account.balance = balance
          this.account.nonce = nonce.toNumber()
          this.loading = false
          clearInterval(int)
        } catch (err) {
          console.debug('CandidateBalance.vue: OOPS')
          console.error(err)
        }
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
