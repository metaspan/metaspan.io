<template>

  <client-only>
  <v-container style="max-width: 900px" class="mt-0 pt-0">
    <v-toolbar flat elevation="0" color="#FFFFFF00">
      <v-btn size="small" icon @click="navTo('candidate')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <span class="text-h7 text-sm-h6 text-md-h5">
          <v-avatar>
            <Identicon :value="stash || ''" :size="24" theme="polkadot"></Identicon>
          </v-avatar>
          {{candidate?.name || '...'}} 
          <span class="d-none d-md-inline">({{ parseIdentity(candidate?.identity) }})</span>
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
        <v-col align="center">Stash<br>{{ shortStash(stash) }}</v-col>
        <v-col align="center">Reward Destination<br>{{ shortStash(candidate.rewardDestination || '') }}</v-col>
        <v-col align="center">Faults<br>{{candidate.faults}}</v-col>
        <v-col align="center">Unclaimed Eras<br>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</v-col>
      </v-row>
      <v-row justify="center">
        <v-col align="center">Country<br>{{ candidate.country }}</v-col>
        <v-col align="center">Region<br>{{ candidate.region }}</v-col>
        <v-col align="center">Location<br>{{ candidate.location }}</v-col>
        <v-col align="center">Provider<br>{{ candidate.provider }}</v-col>
      </v-row>
    </v-container>
    
    <CandidateValidity :candidate="candidate"></CandidateValidity>

    <v-card min-height="400px">
      <v-tabs v-model="tab">
        <v-tab value="score">Score</v-tab>
        <v-tab value="referenda">Referenda</v-tab>
        <v-tab value="delegation">Delegation</v-tab>
        <v-tab value="nominators">Nominators</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="score">
            <CandidateScoreList :candidate="candidate"></CandidateScoreList>
          </v-window-item>
          <v-window-item value="referenda">
            <CandidateReferenda :candidate="candidate"></CandidateReferenda>
          </v-window-item>
          <v-window-item value="delegation">
            <CandidateDelegation :candidate="candidate"></CandidateDelegation>
          </v-window-item>
          <v-window-item value="nominators">
            <CandidateNominators :stash="stash"></CandidateNominators>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- <Loading :loading="loading"></Loading> -->

    <!-- <v-snackbar v-model="showSnackbar" :timeout="2000">
      Candidate is {{ isFavourite ? '' : 'not' }} a favourite
    </v-snackbar> -->

  </v-container>
  </client-only>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, nextTick, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment'

import CandidateValidity from './CandidateValidity.vue'
// import CandidateScoreTable from './CandidateScoreTable.vue'
// import CandidateBalance from './CandidateBalance.vue'
import CandidateIcons from './CandidateIcons.vue'
import { type ICandidate, type ICandidateValidityItem, type ICandidateScore, type IIdentity } from '../types/global'
import CandidateExternalLinks from './CandidateExternalLinks.vue'
import Loading from './Loading.vue'
import CandidateScoreList from './CandidateScoreList.vue'
import CandidateBalance from './CandidateBalance.vue'
import CandidateIdentity from './CandidateIdentity.vue'
import CandidateNominators from './CandidateNominators.vue'
// import CandidateDemocracy from './CandidateDemocracy.vue'
import CandidateReferenda from './CandidateReferenda.vue'
import CandidateDelegation from './CandidateDelegation.vue'
import { SubstrateAPI } from '@/plugins/substrate'

// import Identicon from '@polkadot/vue-identicon'
import Identicon from './identicon/Identicon.vue'

import { shortStash } from '../utils'

interface IData {
  unsubscribe(): any|null
  dateTimeFormat: string
  activeEra: any
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

import { QUERY_CANDIDATE } from '@/graphql/candidates'

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
  },
  setup () {
    const store = useStore()
    const candidateStore = useCandidateStore()
    const router = useRouter()
    const route = useRoute()
    const favourites = computed<string[]>(() => candidateStore.favourites)
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI

    const chainId = computed(() => store.chainId)
    const stash = computed(() => route.params.stash?.toString() || '')
    // console.debug('Candidate.vue: setup(), stash', stash.value)

    // // const candidate: ICandidate = computed(() => store.state['candidate/candidate']) as any
    const candidate = ref<ICandidate>({} as ICandidate)
    // // if (!candidate?.stash) router.push(`/${chainId.value}/candidate`)
    // // const loading = computed(() => store.state['candidate/loading'])
    const ranges = computed(() => candidateStore.ranges)
    const tab = ref('score')
    const showSnackbar = ref(false)

    const dateTimeFormat = ref('YYYY/MM/DD hh:mm')
    const activeEra = {}
    const header = {}
    var unsubscribe = () => {}

    // placeholders for SSR
    var loading = ref(true)
    var refetch = (x: any) => {}

    // onBeforeUnmount(() => {
    //   console.debug('unmounting...')
    //   if (unsubscribe !== null) unsubscribe()
    // })

    onBeforeMount(() => {
      console.debug('Candidate.vue: onBeforeMount()', chainId.value, stash.value)
      var { loading: cLoading, error, refetch: cRefetch, onResult }: any = useQuery(QUERY_CANDIDATE, {
        chain: chainId.value,
        stash: stash
      }, {
        fetchPolicy: 'no-cache'
      })
      // if (result?.data?.Candidate) candidate.value = result.data.Candidate

      refetch = cRefetch
      loading = cLoading
      // cRefetch({ chain: chainId.value, stash: stash })

      onResult((event: any) => {
        console.debug('Candidate.vue: setup(): onResult', event)
        const { loading, data, networkStatus } = event
        candidate.value = {...data.Candidate}
      })

    })

    onMounted(() => {
      // console.debug('Candidate.vue: onMounted()')
      window.scrollTo(0, 0)
    })

    watch(() => chainId.value, (newVal) => {
      console.debug('watch: chainId', newVal)
      nextTick(() => {
        console.debug('nextTick: chainId', newVal)
        router.push({
          name: `chainId-candidate`,
          params: { chainId: newVal }
        })
      })
    })

    watch(() => tab.value, newVal => {
      useTrackPageview({
        url: `${window.location.pathname}?tab=${newVal}`        
      })
    })

    const isFavourite = computed(() => {
      // console.debug('isFavourite', stash, favourites.value.includes(stash))
      return favourites.value.includes(candidate.value.stash)
    })

    const toggleFav = (item: any) => {
      console.debug('toggleFav', item.stash)
      candidateStore.toggleFav({ chain: chainId.value, stash: item.stash })
      showSnackbar.value = true
    }

    const timeAgo = (d: any): string => {
      return moment(d).fromNow()
    }

    const navTo = (path: string) => {
      router.push({
        name: `chainId-${path}`,
        params: { chainId: chainId.value }
      })
    }

    const parseIdentity = (identity: IIdentity) => {   
      var ret = ''
      if (identity?.name) ret += identity.name
      if (identity?.parentIdentity) ret += `${identity.parentIdentity.info?.display}/${identity.parentIdentity.subId}`
      return ret
    }

    return {
      chainId,
      stash,
      tab,
      loading,
    //   refetch,
      candidate,
    //   ranges,
    //   shortStash,
      isFavourite,
      toggleFav,
    //   showSnackbar,
      timeAgo,
    //   formatDate,
      navTo,
      parseIdentity,
    }
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
