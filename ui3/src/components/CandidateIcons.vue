<template>
  <v-card elevation="1">
    <v-card-title>Details</v-card-title>
    <v-card-text>
      <v-row justify="center">
        <v-col class="cicon" align="center">Valid<br><v-icon :color="model.valid?'green':'red'">mdi-{{ model.valid?'check-circle':'close-circle' }}</v-icon></v-col>
        <v-col class="cicon" align="center">Nom. 1kv<br><v-icon :color="model.nominated_1kv?'green':'grey'">mdi-{{ model.nominated_1kv?'minus-circle':'minus-circle' }}</v-icon></v-col>
        <v-col class="cicon" align="center">Active<br><v-icon :color="model.active?'green':'grey'">mdi-{{ model.active?'check-circle':'minus-circle' }}</v-icon></v-col>
        <v-col class="cicon" align="center">Rank<br>{{ model.rank }}</v-col>
        <v-col class="cicon" align="center">Score<br>{{ model.total?.toFixed(2) | 0.00 }}</v-col>
        <v-col class="cicon" align="center">Commission<br>{{ model.commission?.toFixed(2) | 0.00 }}%</v-col>
        <v-col class="cicon" align="center">Discovered<br>{{ timeAgo(model.discoveredAt) }}</v-col>
        <v-col class="cicon" align="center">Nominated<br>{{ timeAgo(model.nominatedAt) }}</v-col>
        <v-col class="cicon" align="center">Online<br>{{ timeAgo(model.onlineSince) }}</v-col>
        <v-col class="cicon" align="center">Node version<br>TBC</v-col>
        <v-col class="cicon" align="center">Stash<br>{{ formatStash(model.stash) }}</v-col>
        <v-col class="cicon" align="center">Controller<br>TBC</v-col>
        <v-col class="cicon" align="center">Queued key<br>TBC</v-col>
        <v-col class="cicon" align="center">Next Key<br>TBC</v-col>
        <v-col class="cicon" align="center">Location<br>{{ model.location }}</v-col>
        <v-col class="cicon" align="center">Reward Dest.<br>TBC</v-col>
        <v-col class="cicon" align="center">Faults<br>{{model.faults}}</v-col>
        <v-col class="cicon" align="center">Unclaimed Eras<br>{{model.unclaimedEras ? model.unclaimedEras.length : 0}}</v-col>
        <v-col class="cicon" align="center">Democracy Vote Count<br>{{ model.democracyVoteCount }}</v-col>
        <v-col class="cicon" align="center">Council Stake<br>{{model.councilStake}}</v-col>
        <v-col class="cicon" align="center">Council Votes<br>{{model.councilVotes ? model.councilVotes.length : 0}}</v-col>
        <v-col class="cicon" align="center">Democracy Votes<br>{{model.democracyVotes}}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import moment from 'moment'
import { useStore } from 'vuex'
import { ICandidate } from '../../../ui/bak/src/types/global'
// import { ICandidate } from '../types/global'

export default defineComponent({
  name: 'Candidate',
  props: ['candidate'],
  // mixins: [polkadot],
  setup (props) {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const model = ref<ICandidate>(props.candidate)
    watch(() => props.candidate, (newVal) => {
      console.debug('CandidateIcons.vue: watch candidate', props.candidate)
      model.value = newVal
    }, { immediate: true })
    return {
      chainId,
      model
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
