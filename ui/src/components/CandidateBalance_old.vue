<template>

  <v-system-bar color="lilac">
    <!-- <v-row class="text-align-center"> -->
    <!-- |{{balance}}| -->
    <!-- |{{loading}}| -->
    <v-spacer></v-spacer>
    Balance: {{ toKSM(balance.free)}}
    / {{ toKSM(balance?balance.reserved:0) }}
    / {{ toKSM(balance?balance.miscFrozen:0) }}
    / {{ toKSM(balance?balance.feeFrozen:0) }}
    / ({{ timeAgo(updatedAt) }})
    <v-btn icon x-small :loading="loading"></v-btn>
    <v-spacer></v-spacer>
  </v-system-bar>

</template>

<script lang="ts">
import moment from 'moment'
import { mapState } from 'vuex'
import Vue from 'vue'
import { ICandidate, ICache, IWalletBalance } from '../types/global'

interface IData {
  balance: IWalletBalance | null
  dateTimeFormat: string
}

interface IMethods {
  // isValid(): boolean
  timeAgo(v: number|string): string
  toKSM(v: number): string
  getBalance(): void
  formatDate(v: number|string): string
}

interface IComputed {
  candidate: ICandidate
  cache: ICache
  loading: boolean
  // valid: boolean
  updatedAt: Date | number | null
}

interface IProps {
  candidate: ICandidate
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'CandidateBalance',
  // props: { candidate: ICandidate },
  components: {},
  computed: {
    ...mapState('candidate', ['candidate']),
    ...mapState('polkadot', ['cache', 'loading']),
    // balance() {
    //     // console.debug(this.cache[this.candidate.stash])
    //     return this.cache[this.candidate.stash]?.model ? this.cache[this.candidate.stash].model.data : { free: 0 }
    // },
    updatedAt () {
      return (this.candidate.stash in this.cache.items) ? this.cache.items[this.candidate.stash].updatedAt : null
    }
  },
  data () {
    return {
      balance: {
        free: 0, reserved: 0, miscFrozen: 0, feeFrozen: 0
      },
      dateTimeFormat: 'YYYY/MM/DD HH:mm'
    }
  },
  watch: {
    cache: {
      deep: true,
      async handler (newval) {
        console.debug('cache', newval)
        this.getBalance()
      }
    }
  },
  methods: {
    toKSM (val: number): string {
      return (val / 1000000000000).toLocaleString('en-GB') + ' KSM'
    },
    getBalance (): void {
      this.balance = this.cache.items[this.candidate.stash]?.model ? this.cache.items[this.candidate.stash]?.model.data : {}
    },
    timeAgo (d) {
      return moment(d).fromNow()
    },
    formatDate (v: number|string): string {
      // console.debug(v, this.dateTimeFormat)
      return moment(v).format(this.dateTimeFormat)
    }
    // formatStash(stash, len=8) {
    //     if(stash.length <= len*2+3) return stash
    //     return stash.substr(0,len)+"..."+stash.substr(stash.length - len)
    // },
  },
  // created() {
  //     // this.$store.dispatch('')
  //     console.debug(this.$route.params)
  //     this.$store.dispatch('polkadot/get', this.candidate.stash)
  // },
  mounted () {
    this.getBalance()
  }
})
</script>
