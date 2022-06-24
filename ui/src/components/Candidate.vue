<template>

  <v-container fluid>
    <v-toolbar flat>
      <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <!-- <v-spacer></v-spacer> -->
      <v-toolbar-title>
        <span class="text-h5">
          <span class="identicon">
            <Identicon :value="candidate.stash" :size="24" theme="polkadot"></Identicon>
          </span>
          {{candidate.name}} <span class="d-none d-md-inline">| {{ candidate.identity ? candidate.identity.name : '' }}</span>
        </span>
      </v-toolbar-title>
      <!-- <v-btn>Valid <v-icon :color="valid?'green':'red'">mdi-{{valid?"circle":"alert-circle"}}</v-icon></v-btn> -->
      <!-- <v-btn>Active <v-icon :color="candidate.active?'green':'grey'">mdi-{{candidate.active?"lightbulb-on":"lightbulb"}}</v-icon></v-btn> -->
      <!-- <v-toolbar-items>
      </v-toolbar-items> -->
      <v-spacer></v-spacer>
      <CandidateExternalLinks :candidate="candidate"></CandidateExternalLinks>
    </v-toolbar>
    <!-- {{candidate}} -->
    <!-- {{ loading }} <v-btn @click="test()" :loading="loading">Load</v-btn> -->

    <!-- <CandidateBalance class="d-none d-md-block" :candidate="candidate"></CandidateBalance> -->

    <CandidateIcons class="d-block d-md-none"></CandidateIcons>

    <!-- {{ranges}} -->
    <v-container class="d-none d-md-block">
      <v-row justify="center">
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Rank<br>{{ candidate.rank }}</v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Score<br>{{ (candidate.score && candidate.score.total ) ? candidate.score.total.toFixed(2) : 0.00 }}</v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Commission<br>{{ candidate.commission.toFixed(2) }}%</v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Valid<br><v-icon :color="candidate.valid?'green':'red'">mdi-{{ candidate.valid?'check-circle':'close-circle' }}</v-icon></v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Active<br><v-icon :color="candidate.active?'green':'grey'">mdi-{{ candidate.active?'check-circle':'minus-circle' }}</v-icon></v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Discovered<br>{{ timeAgo(candidate.discoveredAt) }}</v-col>
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Nominated<br>{{ timeAgo(candidate.nominatedAt) }}</v-col>
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Online<br>{{ timeAgo(candidate.onlineSince) }}</v-col>
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Node version<br>TBC</v-col>
      </v-row>
      <v-row justify="center">
        <v-col align="center">Stash<br>{{ formatStash(candidate.stash) }}</v-col>
        <v-col align="center">Controller<br>TBC</v-col>
        <v-col align="center">Queued key<br>TBC</v-col>
        <v-col align="center">Next Key<br>TBC</v-col>
      </v-row>
      <v-row justify="center">
        <v-col align="center">Node location<br>{{ candidate.location }}</v-col>
        <v-col align="center">Reward Destination<br>TBC</v-col>
        <v-col align="center">Faults<br>{{candidate.faults}}</v-col>
        <v-col align="center">Unclaimed Eras<br>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</v-col>
      </v-row>
      <v-row justify="center">
        <v-col align="center">Democracy Vote Count<br>{{ candidate.democracyVoteCount }}</v-col>
        <v-col align="center">Democracy Votes<br>{{candidate.democracyVotes}}</v-col>
        <v-col align="center">Council Stake<br>{{candidate.councilStake}}</v-col>
        <v-col align="center">Council Votes<br>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</v-col>
      </v-row>
    </v-container>
    <v-list>
      <!-- <v-list-item>Name: {{candidate.name}}</v-list-item> -->
      <!-- <v-list-item>Stash: {{candidate.stash}}</v-list-item> -->
      <!-- <v-list-item>total: {{candidate.total}}</v-list-item> -->
      <!-- <v-list-item>active: {{candidate.active}}</v-list-item> -->
      <!-- <v-list-item>valid: {{valid}}</v-list-item> -->
      <!-- <v-list-item>nominatedAt: </v-list-item> -->
      <!-- <v-list-item>offlineSince: {{candidate.offlineSince}}</v-list-item> -->
      <!-- <v-list-item>offlineAccumulated: {{candidate.offlineAccumulated}}</v-list-item> -->
      <!-- <v-list-item>rank: {{candidate.rank}}</v-list-item> -->
      <!-- <v-list-item>faults: {{candidate.faults}}</v-list-item> -->
      <!-- <v-list-item>invalidityReasons: {{candidate.invalidityReasons}}</v-list-item> -->
      <!-- <v-list-item>unclaimedEras: {{candidate.unclaimedEras}}</v-list-item> -->
      <!-- <v-list-item>inclusion: {{candidate.inclusion}}</v-list-item> -->
      <!-- <v-list-item>kusamaStash: {{candidate.kusamaStash}}</v-list-item> -->
      <!-- <v-list-item>commission: {{candidate.commission}}</v-list-item> -->
      <!-- <v-list-item>identity: {{candidate.identity}}</v-list-item> -->
      <v-list-item>
        <!-- {{candidate.validity}} -->
        <CandidateValidity :candidate="candidate"></CandidateValidity>
      </v-list-item>
      <v-list-item>
        <CandidateScore :candidate="candidate"></CandidateScore>
      </v-list-item>
      <!-- <v-list-item>location: {{candidate.location}}</v-list-item> -->
      <!-- <v-list-item>councilStake: {{candidate.councilStake}}</v-list-item> -->
      <!-- <v-list-item>councilVotes: {{candidate.councilVotes}}</v-list-item> -->
      <!-- <v-list-item>democracyVoteCount: {{candidate.democracyVoteCount}}</v-list-item> -->
      <!-- <v-list-item>democracyVotes: {{candidate.democracyVotes}}</v-list-item> -->
    </v-list>
    <Loading :loading="loading"></Loading>
  </v-container>

</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import Vue from 'vue'
// import polkadot from '@/mixins/polkadot.js'
import CandidateValidity from './CandidateValidity.vue'
import CandidateScore from './CandidateScore.vue'
// import CandidateBalance from './CandidateBalance.vue'
import CandidateIcons from './CandidateIcons.vue'
import Identicon from '@polkadot/vue-identicon'
import { ICandidate, ICandidateValidityItem } from '../types/global'
import CandidateExternalLinks from './CandidateExternalLinks.vue'
import Loading from './Loading.vue'

// import Identicon from './identicon/Identicon.ts'

interface IData {
  // eslint-disable-next-line
  unsubscribe(): any|null
  dateTimeFormat: string
  // eslint-disable-next-line
  activeEra: any,
  // eslint-disable-next-line
  header: any,
}

interface IMethods {
  test(): void
  // eslint-disable-next-line
  isValid(x: ICandidateValidityItem[]): boolean
  // eslint-disable-next-line
  timeAgo(t: any): string
  // eslint-disable-next-line
  formatDate(d: any, f: string): string
  formatStash(s: string): string
}

interface IComputed {
  candidate: ICandidate
  // eslint-disable-next-line
  cache: Record<string, any> // CacheItem
  loading: boolean
  // eslint-disable-next-line
  balance: any
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'Candidate',
  // props: ['model'],
  // mixins: [polkadot],
  components: {
    CandidateExternalLinks,
    CandidateScore,
    CandidateValidity,
    // CandidateBalance,
    CandidateIcons,
    Identicon,
    Loading
  },
  computed: {
    ...mapState('candidate', ['loading', 'candidate', 'ranges']),
    ...mapState('polkadot', { cache: 'cache' }),
    // valid (): boolean {
    //   return this.isValid(this.candidate.validity)
    // },
    // eslint-disable-next-line
    balance (): any {
      return this.cache.items[this.candidate.stash] || {}
    }
  },
  data (): IData {
    return {
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      activeEra: {},
      header: {},
      // eslint-disable-next-line
      unsubscribe () {}
    }
  },
  filters: {
    // eslint-disable-next-line
    formatDate (v: any): string {
      console.debug(v, this.dateTimeFormat)
      return moment(v).format(this.dateTimeFormat)
    }
  },
  methods: {
    test () {
      this.$store.dispatch('candidate/setLoading', true)
      setTimeout(() => {
        this.$store.dispatch('candidate/setLoading', false)
      }, 5000)
    },
    // eslint-disable-next-line
    timeAgo (d: any): string {
      return moment(d).fromNow()
    },
    isValid (validity: ICandidateValidityItem[]): boolean {
      // eslint-disable-next-line
      const invalid = validity.find((i: ICandidateValidityItem) => { return i.valid === false })
      return !invalid
    },
    // eslint-disable-next-line
    formatDate (v: any): string {
      // console.debug(v, this.dateTimeFormat)
      return moment(v).format(this.dateTimeFormat)
    },
    formatStash (stash: string, len = 8) {
      if (stash.length <= len * 2 + 3) return stash
      return stash.substr(0, len) + '...' + stash.substr(stash.length - len)
    }
  },
  async created () {
    // console.debug(this.$route.params)
    if (!this.candidate.stash) {
      console.debug('no stash?', this.$route.params)
      await this.$store.dispatch('candidate/setCandidate', this.$route.params.stash)
    }
    // let {nonce, balance} = await this.$polkadot.api().query.system.account(this.candidate.stash)
    // console.debug(nonce, balance)
  },
  async mounted () {
    window.scrollTo(0, 0)
    // var count = 0
    // var int = setInterval(async () => {
    //   count++
    //   if (this.$polkadot) {
    //     var nominators = await this.$polkadot.api.query.staking.nominators(this.candidate.stash)
    //     console.debug('nominators', this.candidate.stash, nominators)
    //     var vals = await this.$polkadot.api.query.staking.validators(this.candidate.stash)
    //     console.debug('vals', this.candidate.stash, vals)
    //     clearInterval(int)
    //   }
    //   if (count > 10) {
    //     console.debug('no api found, clearing interval...')
    //     clearInterval(int)
    //   }
    // }, 1000)
    // // this.$store.dispatch('polkadot/getActiveEra')
    // // const activeEra = await this.$polkadot.api.query.staking.activeEra();
    // // // let chain = await this.$polkadot.rpc.system.chain()
    // // console.debug('TEST', activeEra)
    // // this.activeEra = activeEra

    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    // let count = 0;
    // this.unsubscribe = await this.$polkadot.api.rpc.chain.subscribeNewHeads((header) => {
    //   console.log(`Chain is at block: #${header.number}`);
    //   this.header = header
    //   if (++count === 25) {
    //     this.unsubscribe()
    //     process.exit(0)
    //   }
    // })
  },
  beforeDestroy () {
    console.debug('unmounting...')
    if (this.unsubscribe !== null) this.unsubscribe()
  }
})
</script>

<style scoped>
.identicon {
  width: 24px;
  max-width: 24px;
  /* white-space:nowrap; */
  display: inline-block;
}

.none {
  text-decoration: none;
}
.position-relative {
  position: relative;
  width: 18px;
  height: 18px;
  overflow: hidden;
}
</style>
