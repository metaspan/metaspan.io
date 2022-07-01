<template>
  <v-card height="100%" elevation="1" :loading="loading">
    <v-card-title>Balance</v-card-title>
    <v-card-text>
      <table width="100%">
        <tr>
          <td>free</td><td class="text-right">{{toKSM(account.balance.free)}}</td>
        </tr>
        <tr>
          <td>reserved</td><td class="text-right">{{toKSM(account.balance.reserved)}}</td>
        </tr>
        <tr>
          <td>miscFrozen</td><td class="text-right">{{toKSM(account.balance.miscFrozen)}}</td>
        </tr>
        <tr>
          <td>feeFrozen</td><td class="text-right">{{toKSM(account.balance.feeFrozen)}}</td>
        </tr>
      </table>
    </v-card-text>
    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Loading from './Loading.vue'
export default Vue.extend({
  name: 'CandidateBalance',
  props: {
    stash: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('candidate', ['chain'])
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
  methods: {
    toKSM (v: number) {
      return v / 1000000000000
    }
  },
  async created () {
    let count = 0
    const int = setInterval(async () => {
      count++
      if (this.$substrate[this.chain]) {
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
        clearInterval(int)
      }
    }, 1000)
  },
  components: { Loading }
})
</script>
