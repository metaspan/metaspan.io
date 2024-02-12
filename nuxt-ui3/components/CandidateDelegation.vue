<template>
  <v-container fluid class="ma-0 pa-0" style="min-height:800px">
    <v-toolbar color="none" density="compact">
      <v-toolbar-title>
        Delegation
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-toolbar>

    <v-progress-linear indeterminate v-show="loading"></v-progress-linear>

    <v-list two-line>
      <v-list-item v-for="(item) in delegations" :key="item.trackId">
        <hr>
        <!-- {{ item }} -->
        <v-list-item-title>
          {{ item.trackId }} - {{ getTrack(item.trackId).name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-row>
            <v-col><ClickToCopy :text="item.target" :display="shortStash(item.target)"></ClickToCopy></v-col>
            <v-col>{{ item.conviction }} - {{ formatAmount(item.balance) }} {{ tokenSymbol }}</v-col>
            <v-col>
              <span v-show="item.votes.length > 0">
                votes {{ item.votes }}
              </span>
            </v-col>
          </v-row>
        </v-list-item-subtitle>

      </v-list-item>

      <v-list-item v-show="loading">
        <v-list-item-title>
          <v-progress-circular :size="16" indeterminate color="primary"></v-progress-circular>
          Loading...
        </v-list-item-title>
      </v-list-item>
    </v-list>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, computed, watch, onBeforeMount, nextTick } from 'vue'
import { type ICandidate } from '../types/global'
import { SubstrateAPI } from '../plugins/substrate'
import ClickToCopy from './ClickToCopy.vue'
// import { shortStash } from './utils'

const trackNames: Record<string, string> = {
  root:               'Root', // 0
  whitelisted_caller: 'Whitelisted Caller', // 1
  staking_admin:      'Staking Admin', // 2
  treasurer:          'Treasurer', // 3
  lease_admin:        'Lease Admin', // 4
  fellowship_admin:   'Fellowship Admin', // 5
  general_admin:      'General Admin', // 6
  auction_admin:      'Auction Admin', // 7
  referendum_canceller: 'Referendum Canceller', // 8
  referendum_killer:  'Referendum Killer', // 9
  small_tipper:       'Small Tipper', // 10
  big_tipper:         'Big Tipper', // 11
  small_spender:      'Small Spender', // 12
  medium_spender:     'Medium Spender', // 13
  big_spender:        'Big Spender' // 14
}
const trackIds = [
  0, // Root
  1, // Whitelisted Caller
  2, 3, 4, 5, 6, 7, 8, 9, 
  10, // Staking Admin
  11, // Treasurer
  12, // Lease Admin
  13, // Fellowship Admin
  14, // General Admin
  15, // AuctionAdmin
  16, 17, 18, 19, 
  20, // Referendum Canceller
  21, // Referendum Killer
  22, 
  23, 24, 25, 26, 27, 28, 29, 
  30, // Small Tipper
  31, // Big Tipper
  32, // Small Spender
  33, // Medium Spender
  34, // Big Spender
  35,
  // 36
]

interface IDelegation {
  trackId: number
  //delegating: boolean
  target: string
  conviction: string
  balance: number
  votes: string[]
}

export default defineComponent({
  name: 'CandidateDelegation',
  props: {
    candidate: {
      type: Object as PropType<ICandidate>, 
      required: true
    }
  },
  components: {
    // Loading
    ClickToCopy
  },
  setup (props) {
    const candidate = ref(props.candidate)
    const store = useStore()
    const substrateStore = useSubstrateStore()
    const chainInfo = computed(() => substrateStore.chainInfo)
    const chainId = computed(() => store.chainId)
    // const decimals = computed(() => store.state['substrate/decimals'])
    const tokenSymbol = computed(() => chainInfo.value.tokenSymbol || '')
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI
    //const denom = Math.pow(10, chainInfo.value.tokenDecimals[0]) || -1000000000000

    watch(() => props.candidate, (newVal) => {
      candidate.value = newVal
    })

    const loading = ref(false)
    // const referenda = ref<any[]>()
    const tracks = ref<any[]>([])
    const delegations = ref<IDelegation[]>([])
    const refVoting = ref<any[]>([])

    const refresh =  async () => {
      loading.value = true
      tracks.value = await getTracks()
      delegations.value = await getDelegations(candidate.value.stash)
      // console.debug('refVoting', refVoting.value)
      await nextTick()
      // referenda.value = await getReferenda()
      loading.value = false
    }

    const getDelegations = async (account: string): Promise<IDelegation[]> => {
      // console.debug('getDelegations', account)
      // const delegations = await substrate.api?.query.referendum?.delegations(account) || JSON.parse('[]')
      // // console.debug('delegations', delegations)
      const delegations: IDelegation[] = []
      for (let i = 0; i < tracks.value.length; i++) {
        const trackId = tracks.value[i].id
        // console.debug('trackId', trackId)
        const result = await substrate.api?.query.convictionVoting.votingFor(account, trackId)
        //console.debug('votingFor', trackId, result.toJSON())
        const trackVote: any = result?.toJSON()
        if (trackVote?.delegating) {
          // console.debug('delegatingFor', trackId, trackVote.delegating.target, trackVote.delegating.balance, trackVote.delegating.conviction)
          delegations.push({
            trackId,
            target: trackVote.delegating.target,
            conviction: trackVote.delegating.conviction,
            balance: trackVote.delegating.balance, //)/Number(decimals.value)
            votes: []
          })
        }
        if (trackVote.casting) {
          // we have 'casting' votes in this track
          delegations.push({
            trackId,
            target: '',
            conviction: '',
            balance: 0,
            votes: trackVote.casting.votes.map((v: any) => v[0])
          })
        }
        if (!trackVote.delegating && !trackVote.casting) {
          console.debug('unknown state', trackVote.toJSON())
        }
      }
      return Promise.resolve(delegations)
    }

    const getTracks = async (): Promise<any[]> => {
      // tracks.value = []
      try { await substrate.api?.connect() } catch (err) {}
      let tracks = await substrate.api?.consts.referenda?.tracks || JSON.parse('[]')
      // console.debug('ntracks', tracks.toJSON())
      try { tracks = tracks.toJSON() } catch (err) {}
      // if (tracks.hasOwnProperty('toJSON')) tracks = tracks.toJSON()
      // tracks = {...tracks}
      // console.debug('tracks', tracks)
      const ttracks = []
      // tracks.forEach(async (track: any[]) => {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const [id, meta] = track
        // console.log('id', id)
        // const voting = await this.$substrate[this.chainId].query.convictionVoting.votingFor(this.stash, id.toJSON())
        ttracks.push({
          idx: i,
          id,
          ...meta,
          name: trackNames[meta.name.toString()]
          // voting: JSON.parse(voting.toString())
        })
      }
      // console.log('getTracks', ttracks)
      return Promise.resolve(ttracks)
    }

    const getTrack = (id: number) => {
      // console.debug('getTrack', id, this.tracks)
      const t = tracks.value?.find((f: any) => f.id === id)
      if (t) return t; else return { id }
    }

    const getTrackName = (item: any) => {
      // const iitem = {...item}
      const ttracks = tracks.value.map(t => { return {...t}})
      // console.debug('getTrackName', iitem, ttracks)
      var track = { name: 'unknown'}
      // console.log('track', track)
      if (item.ongoing) {
        track = ttracks.find(t => t.id === item.ongoing.track)
      // } else {
      //   console.log('item', item)
      }
      return track.name
    }

    onBeforeMount(() => {
      console.debug('CandidateDelegation.onBeforeMount()')
      // refresh()
    })

    refresh()

    return {
      chainId,
      chainInfo,
      loading,
      // referenda,
      tokenSymbol,
      tracks,
      delegations,
      refVoting,
      refresh,
      getTrack,
      // hasVotedInRef,
      shortStash,
      getTrackName
    }
  },
  methods: {
    formatAmount (amount: number, decimals = 4) {
      // console.debug('formatAmount', amount, this.chainInfo.tokenDecimals.toJSON()[0])
      // {"ss58Format":2,"tokenDecimals":[12],"tokenSymbol":["KSM"]}
      // const tokenDecimals = this.chainInfo.tokenDecimals.toJSON()[0] || 1
      // // console.debug('', tokenDecimals)
      // const denom = this.decimals[tokenDecimals]
      const denom = this.chainId === 'kusama' ? 1000000000000 : 10000000000
      return (amount / denom).toFixed(decimals)
    },
    asNumber (item: any): number {
      return parseInt(item, 10)
    },
    bigInt (item: any) {
      return Number(BigInt(item) / 10000n)
    }
  }
})
</script>
