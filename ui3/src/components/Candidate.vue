<template>

  <v-container style="max-width: 900px" class="mt-0 pt-0">
    <v-toolbar flat elevation="0" color="#FFFFFF00">
      <!-- <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn> -->
      <v-btn size="small" icon :to="`/${chainId}/candidate`"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-toolbar-title>
        <span class="text-h7 text-sm-h6 text-md-h5">
          <v-avatar>
            <Identicon :value="stash || ''" :size="24" theme="polkadot"></Identicon>
          </v-avatar>
          {{candidate?.name || '...'}} 
          <span class="d-none d-md-inline">| {{ candidate?.identity ? candidate.identity.name : '' }}</span>
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFav(candidate)">
        <v-icon :color="isFavourite ? 'yellow' : 'grey'">mdi-star</v-icon>
      </v-btn>
      <CandidateExternalLinks :candidate="candidate"></CandidateExternalLinks> &nbsp;
    </v-toolbar>

    <v-row>
      <v-col>
        <CandidateIdentity :candidate="candidate"></CandidateIdentity>
      </v-col>
      <v-col>
        <CandidateBalance :candidate="candidate"></CandidateBalance>
      </v-col>
    </v-row>

    <CandidateIcons :candidate="candidate" class="d-block d-md-none"></CandidateIcons>
    
    <CandidateActive :candidate="candidate"></CandidateActive>

    <v-container class="d-none d-md-block">
      <v-row justify="center">
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Rank<br>{{ candidate?.rank }}</v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Score<br>{{ candidate?.total?.toFixed(2) || 0.00 }}</v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Commission<br>{{ candidate?.commission ? candidate?.commission.toFixed(2) : '0.00' }}%</v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Valid<br><v-icon :color="candidate?.valid?'green':'red'">mdi-{{ candidate?.valid?'check-circle':'close-circle' }}</v-icon></v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Nominated (1kv)<br><v-icon :color="candidate?.nominated_1kv?'green':'grey'">mdi-{{ candidate?.nominated_1kv?'check-circle':'minus-circle' }}</v-icon></v-col>
        <v-col class="col-4 col-sm-3 col-md-2" align="center">Active<br><v-icon :color="candidate?.active?'green':'grey'">mdi-{{ candidate?.active?'check-circle':'minus-circle' }}</v-icon></v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Discovered<br>{{ timeAgo(candidate?.discoveredAt) }}</v-col>
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Nominated<br>{{ timeAgo(candidate?.nominatedAt) }}</v-col>
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Online<br>{{ timeAgo(candidate?.onlineSince) }}</v-col>
        <v-col class="outlined col-4 col-sm-3 col-md-2" align="center">Node version<br>{{ candidate.version }}</v-col>
      </v-row>
      <v-row justify="center">
        <v-col align="center">Stash<br>{{ formatStash(stash) }}</v-col>
        <v-col align="center">Reward Destination<br>{{ formatStash(candidate.rewardDestination || '') }}</v-col>
        <v-col align="center">Faults<br>{{candidate.faults}}</v-col>
        <v-col align="center">Unclaimed Eras<br>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</v-col>
        <!-- 
        <v-col align="center">Queued key<br>TBC</v-col>
        <v-col align="center">Next Key<br>TBC</v-col> -->
      </v-row>
      <v-row justify="center">
        <v-col align="center">Country<br>{{ candidate.country }}</v-col>
        <v-col align="center">Region<br>{{ candidate.region }}</v-col>
        <v-col align="center">Location<br>{{ candidate.location }}</v-col>
        <v-col align="center">Provider<br>{{ candidate.provider }}</v-col>
      </v-row>
      <!-- <v-row justify="center">
        <v-col align="center">Democracy Vote Count<br>{{ candidate.democracyVoteCount }}</v-col>
        <v-col align="center">Democracy Votes<br>{{candidate.democracyVotes}}</v-col>
        <v-col align="center">Council Stake<br>{{candidate.councilStake}}</v-col>
        <v-col align="center">Council Votes<br>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</v-col>
      </v-row> -->
    </v-container>
    
    <CandidateValidity :candidate="candidate"></CandidateValidity>

    <v-card>
      <br>
      <v-tabs v-model="tab">
        <v-tab key="score" value="score">Score</v-tab>
        <!-- <v-tab key="democracy">Democracy</v-tab> -->
        <v-tab key="referenda" value="referenda">Referenda</v-tab>
        <v-tab key="delegation" value="delegation">Delegation</v-tab>
        <v-tab key="nominators" value="nominators">Nominators</v-tab>
        <!-- <v-tabs-slider></v-tabs-slider> -->
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="score" value="score">
          <!-- <CandidateScoreTable :candidate="candidate"></CandidateScoreTable> -->
          <CandidateScoreList :candidate="candidate"></CandidateScoreList>
        </v-window-item>
        <!-- <v-tab-item key="democracy">
          <CandidateDemocracy :stash="candidate.stash"></CandidateDemocracy>
        </v-tab-item> -->
        <v-window-item key="referenda" value="referenda">
          <CandidateReferenda :candidate="candidate"></CandidateReferenda>
        </v-window-item>
        <v-window-item key="delegation" value="delegation">
          <CandidateDelegation :candidate="candidate"></CandidateDelegation>
        </v-window-item>
        <v-window-item key="nominators" value="nominators">
          <CandidateNominators :stash="stash"></CandidateNominators>
        </v-window-item>
      </v-window>
    </v-card>

    <Loading :loading="loading"></Loading>
    <v-snackbar v-model="showSnackbar" :timeout="2000">
      Candidate is {{ isFavourite ? '' : 'not' }} a favourite
    </v-snackbar>
  </v-container>

</template>

<script lang="ts">
import { defineComponent, inject, computed, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import Plausible from 'plausible-tracker'
import moment from 'moment'

import CandidateValidity from './CandidateValidity.vue'
// import CandidateScoreTable from './CandidateScoreTable.vue'
// import CandidateBalance from './CandidateBalance.vue'
import CandidateIcons from './CandidateIcons.vue'
import { ICandidate, ICandidateValidityItem } from '../types/global'
import CandidateExternalLinks from './CandidateExternalLinks.vue'
import Loading from './Loading.vue'
import CandidateScoreList from './CandidateScoreList.vue'
import CandidateBalance from './CandidateBalance.vue'
import CandidateIdentity from './CandidateIdentity.vue'
import CandidateNominators from './CandidateNominators.vue'
// import CandidateDemocracy from './CandidateDemocracy.vue'
import CandidateReferenda from './CandidateReferenda.vue'
import CandidateDelegation from './CandidateDelegation.vue'
import CandidateActive from './CandidateActive.vue'
import { SubstrateAPI } from '@/plugins/substrate'

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
// import Identicon from '@polkadot/vue-identicon'
import Identicon from './identicon/Identicon.vue'

import { ICandidateScore } from '../types/global'
import { shortStash } from '../global/utils'

interface IData {
  // eslint-disable-next-line
  unsubscribe(): any|null
  dateTimeFormat: string
  // eslint-disable-next-line
  activeEra: any
  // eslint-disable-next-line
  header: any
  tab: any
}

const initialScore = {
  address: '',
  aggregate: 0,
  asn: 0,
  bonded: 0,
  councilStake: 0,
  country: 0,
  delegations: 0,
  democracy: 0,
  discovered: 0,
  faults: 0,
  inclusion: 0,
  location: 0,
  nominated: 0,
  nominatorStake: 0,
  offline: 0,
  provider: 0,
  randomness: 0,
  rank: 0,
  region: 0,
  spanInclusion: 0,
  total: 0,
  unclaimed: 0,
  updated: 0,
} as ICandidateScore

const QUERY_CANDIDATE = gql`
query Data($chain: String!, $stash: String) {
  Candidate(chain: $chain, stash: $stash) {
    stash
    active
    commission
    # councilStake
    # councilVotes
    # democracyVotes
    location
    region
    country
    faults
    name
    rank
    nominated_1kv
    provider
    stale
    valid
    version
    rewardDestination
    total
    identity {
      info {
        display
        email
        legal
        riot
        twitter
        web
      }
      judgements
      subId
      parentIdentity {
        chain
        accountId
        deposit
        subId
        info {
          display
          email
          legal
          riot
          twitter
          web
        }
        judgements
      }
    }
    score {
      address
      aggregate
      bonded
      councilStake
      country
      delegations
      democracy
      discovered
      faults
      inclusion
      location
      nominated
      nominatorStake
      offline
      openGov
      openGovDelegations
      provider
      randomness
      rank
      region
      session
      spanInclusion
      total
      unclaimed
      updated
    }
    validity {
      valid
      type
      details
      updated
    }
  }
}`

const p = Plausible()

export default defineComponent({
  name: 'Candidate',
  components: {
    CandidateExternalLinks,
    // CandidateScoreTable,
    CandidateValidity,
    // CandidateBalance,
    CandidateIcons,
    Identicon,
    Loading,
    CandidateScoreList,
    CandidateBalance,
    CandidateIdentity,
    CandidateNominators,
    // CandidateDemocracy,
    CandidateReferenda,
    CandidateDelegation,
    CandidateActive,
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const plausible = inject<typeof p>('$plausible')
    const favourites = computed<string[]>(() => store.getters['candidate/favourites'])

    const stash = route.params.stash.toString()
    console.debug('Candidate.vue: setup(), stash', stash)
    const chainId = computed(() => store.state.chainId)
    // const candidate: ICandidate = computed(() => store.state['candidate/candidate']) as any
    const candidate = ref<ICandidate>({} as ICandidate)
    // if (!candidate?.stash) router.push(`/${chainId.value}/candidate`)
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    // const loading = computed(() => store.state['candidate/loading'])
    const ranges = computed(() => store.state['candidate/ranges'])
    const tab = ref('score')
    const showSnackbar = ref(false)

    var { result, loading, error, refetch, onResult }: any = useQuery(QUERY_CANDIDATE, {
      chain: chainId.value,
      stash: stash
    }, {
      fetchPolicy: 'no-cache'
    })
    console.debug('Candidate.vue: result.data', result.data)
    if (result?.data?.Candidate) candidate.value = result.data.Candidate

    onResult((event: any) => {
      console.debug('Candidate.vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      candidate.value = {...data.Candidate}
    })
    watch(() => chainId.value, (newVal) => {
      console.debug('watch: chainId', newVal)
      // refetch({ chain: newVal, stash: stash })
      nextTick(() => {
        console.debug('nextTick: chainId', newVal)
        router.push({ path: `/${newVal}/candidate` })
      })
    })
    watch(() => route.params.stash, (newVal) => {
      console.debug('watch: route.params.stash', newVal)
    })
    watch(() => tab.value, newVal => {
      if (plausible) {
        plausible.trackPageview({
          url: `${window.location.pathname}?tab=${newVal}`
        })
      }
    })

    const isFavourite = computed(() => {
      // console.debug('isFavourite', stash, favourites.value.includes(stash))
      return favourites.value.includes(candidate.value.stash)
    })

    const toggleFav = (item: any) => {
      console.debug('toggleFav', item.stash)
      store.dispatch('candidate/toggleFav', { chain: chainId.value, stash: item.stash })
      showSnackbar.value = true
      // setTimeout(() => {
      //   showSnackbar.value = false
      // }, 2000)
    }

    return {
      store,
      substrate,
      chainId,
      stash,
      tab,
      loading,
      refetch,
      candidate,
      ranges,
      shortStash,
      isFavourite,
      toggleFav,
      showSnackbar,
    }
  },
  data () {
    return {
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      activeEra: {},
      header: {},
      // eslint-disable-next-line
      unsubscribe () {},
      // tab: 'score'
    }
  },
  // watch: {
  //   chainId (val) {
  //     this.$router.push(`/${val}/candidate`)
  //   }
  // },
  filters: {
    // eslint-disable-next-line
    formatDate (v: any): string {
      console.debug(v, this.dateTimeFormat)
      return moment(v).format(this.dateTimeFormat)
    }
  },
  methods: {
    timeAgo (d: any): string {
      return moment(d).fromNow()
    },
    isValid (validity: ICandidateValidityItem[]): boolean {
      const invalid = validity.find((i: ICandidateValidityItem) => { return i.valid === false })
      return !invalid
    },
    formatDate (v: any): string {
      // console.debug(v, this.dateTimeFormat)
      return moment(v).format(this.dateTimeFormat)
    },
    formatStash (stash: string, len = 8) {
      if (!stash || stash === '') return stash
      if (stash.length <= len * 2 + 3) return stash
      return stash.substr(0, len) + '...' + stash.substr(stash.length - len)
    }
  },
  async created () {
    console.debug('Candidate.vue: created()', this.candidate, this.$route.params)
    if (!this.chainId) {
      console.debug('no chain?', this.$route.params)
      await this.store.dispatch('setChainId', this.$route.params.chainId)
      console.debug('App.vue: reading chain info()...')
      const chainInfo: any = await this.substrate.api?.registry.getChainProperties()
      console.log('chainInfo.tokenDecimals', chainInfo?.tokenDecimals?.toJSON()[0] || 'undefined')
      await this.store.dispatch('substrate/setChainInfo', { chainId: this.chainId, chainInfo })
    }
    // if (!this.candidate?.stash || this.candidate?.stash === '') {
    //   console.debug('no stash?', this.$route.params)
    //   await this.store.dispatch('candidate/setCandidate', { chainId: this.chainId, stash: this.$route.params.stash })
    //   console.debug(this.candidate)
    // }
  },
  async mounted () {
    window.scrollTo(0, 0)
  },
  beforeUnmount () {
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
