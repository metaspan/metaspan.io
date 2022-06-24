<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="cicon" align="center">Valid<br><v-icon :color="candidate.valid?'green':'red'">mdi-{{ candidate.valid?'check-circle':'close-circle' }}</v-icon></v-col>
      <v-col class="cicon" align="center">Active<br><v-icon :color="candidate.active?'green':'grey'">mdi-{{ candidate.active?'check-circle':'minus-circle' }}</v-icon></v-col>
      <v-col class="cicon" align="center">Rank<br>{{ candidate.rank }}</v-col>
      <v-col class="cicon" align="center">Score<br>{{ candidate.score ? candidate.score.total.toFixed(2) : 0.00 }}</v-col>
      <v-col class="cicon" align="center">Commission<br>{{ candidate.commission.toFixed(2) }}%</v-col>
      <v-col class="cicon" align="center">Discovered<br>{{ timeAgo(candidate.discoveredAt) }}</v-col>
      <v-col class="cicon" align="center">Nominated<br>{{ timeAgo(candidate.nominatedAt) }}</v-col>
      <v-col class="cicon" align="center">Online<br>{{ timeAgo(candidate.onlineSince) }}</v-col>
      <v-col class="cicon" align="center">Node version<br>TBC</v-col>
      <v-col class="cicon" align="center">Stash<br>{{ formatStash(candidate.stash) }}</v-col>
      <v-col class="cicon" align="center">Controller<br>TBC</v-col>
      <v-col class="cicon" align="center">Queued key<br>TBC</v-col>
      <v-col class="cicon" align="center">Next Key<br>TBC</v-col>
      <v-col class="cicon" align="center">Location<br>{{ candidate.location }}</v-col>
      <v-col class="cicon" align="center">Reward Dest.<br>TBC</v-col>
      <v-col class="cicon" align="center">Faults<br>{{candidate.faults}}</v-col>
      <v-col class="cicon" align="center">Unclaimed Eras<br>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</v-col>
      <v-col class="cicon" align="center">Democracy Vote Count<br>{{ candidate.democracyVoteCount }}</v-col>
      <v-col class="cicon" align="center">Council Stake<br>{{candidate.councilStake}}</v-col>
      <v-col class="cicon" align="center">Council Votes<br>{{candidate.councilVotes ? candidate.councilVotes.length : 0}}</v-col>
      <v-col class="cicon" align="center">Democracy Votes<br>{{candidate.democracyVotes}}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import Vue from 'vue'
import { ICandidate } from '../types/global'

interface IData {
  dateTimeFormat: string
  // eslint-disable-next-line
  activeEra: any,
  // eslint-disable-next-line
  header: any
}

interface IMethods {
  // eslint-disable-next-line
  isValid(x: any[]): boolean
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
  // valid: boolean
  // eslint-disable-next-line
  balance: any
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'Candidate',
  // props: ['model'],
  // mixins: [polkadot],
  computed: {
    ...mapState('candidate', ['candidate', 'ranges']),
    ...mapState('polkadot', { cache: 'cache' }),
    // valid (): boolean {
    //   return this.isValid(this.candidate.validity)
    // },
    // eslint-disable-next-line
    balance (): any {
      return this.cache[this.candidate.stash] || {}
    }
  },
  data (): IData {
    return {
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      activeEra: {},
      header: {}
    }
  },
  methods: {
    // eslint-disable-next-line
    timeAgo (d: any): string {
      return moment(d).fromNow()
    },
    isValid (items = []): boolean {
      // eslint-disable-next-line
      const invalid = items.find((i: any) => { return i.valid === false })
      return !invalid
    },
    // eslint-disable-next-line
    formatDate (v: any): string {
      // console.debug(v, this.dateTimeFormat)
      return moment(v).format(this.dateTimeFormat)
    },
    formatStash (stash: string, len = 5) {
      if (stash.length <= len * 2 + 3) return stash
      return stash.substr(0, len) + '..' + stash.substr(stash.length - len)
    }
  }
})
</script>

<style>
.cicon {
  font-size: 12px;
  margin: 1px;
  /* padding: 2px; */
  min-height: 50px;
  min-width: 90px;
  border: 1px dotted grey;
  border-radius: 5px;
}
</style>
