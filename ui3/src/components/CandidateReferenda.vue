<template>
  <v-container fluid class="ma-0 pa-0" style="min-height:800px">
    <v-toolbar color="none" density="compact">
      <v-toolbar-title>
        Referenda
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-toolbar>
      <!-- {{referenda}} -->
      <!-- {{democracy.direct}} -->
    <v-progress-linear indeterminate v-show="loading"></v-progress-linear>

    <v-list density="compact">
      <v-list-item v-for="(item) in referenda" :key="item.id">
        <hr>
        <!-- {{ item }} -->
        <v-list-item-title>
          <v-row>
            <v-col cols="10">
              #{{item.id}} - {{ getTrackName(item) }}
              <v-chip v-if="item.ongoing?.track" size="x-small" color="primary" variant="outlined">{{ item.ongoing?.track }}</v-chip>
            </v-col>
            <v-col cols="2 sm-2" align="right">
              <!-- <v-icon size="18" :color="hasVoted(item) ? 'success' : 'grey'">mdi-vote-outline</v-icon> -->
            </v-col>
          </v-row>
        </v-list-item-title>

        <v-row>
          <!-- {{ item }} -->
          <!-- {{ refVoting }} -->
        </v-row>

        <v-row density="compact">
          <v-col cols="6">
            <CandidateReferendaVote
              :stash="candidate.stash"
              :referenda="item"
              :refVoting="refVoting"></CandidateReferendaVote>
          </v-col>

          <!-- <v-col v-show="!item.info?.approved" class="col-1">Ayes: <br><br>Nays: </v-col> -->
          <v-col v-if="item.approved" align="right">approved</v-col>
          <v-col v-if="item.rejected" align="right">rejected</v-col>
          <v-col v-if="item.timedOut" align="right">timedOut</v-col>
          <v-col cols="4" v-if="!item.approved && !item.rejected && !item.timedOut">
            <!-- <div> -->
              <v-progress-linear :model-value="getAyes(item)"
                height="15" background-color="grey"
                color="success">
                <template v-slot:default>
                  <small>{{ formatAmount(item.ongoing?.tally?.ayes, 2) }} {{tokenSymbol}}</small>
                </template>
              </v-progress-linear>
              <!-- <br> -->
              <v-progress-linear :model-value="getNays(item)"
                height="15" background-color="grey"
                color="red">
              <template v-slot:default="{}">
                <small>{{ formatAmount(item.ongoing?.tally?.nays, 2) }} {{tokenSymbol}}</small>
              </template>
            </v-progress-linear>
            <!-- </div> -->
          </v-col>

          <v-col cols="2 sm-2" align="right">
            <v-menu>
              <template v-slot:activator="{props}">
                <v-btn size="28" icon v-bind="props">
                  <!-- <v-icon size="18">mdi-dots-vertical</v-icon> -->
                  <v-icon size="18" :color="hasVotedInRef(item) ? 'success' : 'grey'">mdi-vote-outline</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-avatar size="18" tag="a" href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.ibp.network/kusama#/referenda" target="_blank">
                    <v-img max-height="16" max-width="16" :src="`/image/${chainId}-logo.png`"></v-img>
                  </v-avatar>
                </v-list-item>
                <v-list-item>
                  <v-avatar size="18" tag="a" :href="`https://${chainId}.polkassembly.io/referenda/${item.id}`" target="_blank">
                    <v-img max-height="16" max-width="16" src="/image/polkassembly.png"></v-img>
                  </v-avatar>
                </v-list-item>
                <v-list-item>
                  <v-avatar size="18" tag="a" :href="`https://${chainId}.subscan.io/referenda_v2/${item.id}`" target="_blank">
                    <v-img max-height="16" max-width="16" src="/image/subscan-logo.png"></v-img>
                  </v-avatar>
                </v-list-item>
                <v-list-item>
                  <v-avatar size="18" tag="a" :href="`https://${chainId}.subsquare.io/referenda/referendum/${item.id}`" target="_blank">
                    <v-img src="/image/subsquare.io.svg"></v-img>
                  </v-avatar>
                </v-list-item>
              </v-list>
            </v-menu>

          </v-col>

        </v-row>

      </v-list-item>

      <v-list-item v-show="loading">
        <v-list-item-title>
          <v-progress-circular :size="16" indeterminate color="primary"></v-progress-circular>
          Loading...
        </v-list-item-title>
      </v-list-item>
    </v-list>

      <!-- {{democracy?.delegations}}
      {{democracy?.prior}} -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, inject, watch, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
// import { createType } from '@polkadot/types'
// import { hexToString } from '@polkadot/util'
import CandidateReferendaVote from './CandidateReferendaVote.vue'
import { ICandidate } from '../types/global'
import { SubstrateAPI } from '../plugins/substrate'

interface ITally {
  ayes: number | string // hex?
  nays: number | string
  support: number | string
}

interface IOngoing {
  track: number
  origin: any
  proposal: any
  enactment: any
  submitted: any
  submissionDeposit: any
  decisionDeposit: any
  deciding: any
  tally: ITally
  inQueue: boolean
  alarm: any
}
interface IInfo {
  ongoing: IOngoing
}

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

export default defineComponent({
  name: 'CandidateReferenda',
  props: {
    candidate: {
      type: Object as PropType<ICandidate>, 
      required: true
    }
  },
  components: {
    // Loading
    CandidateReferendaVote
  },
  setup (props) {
    const candidate = ref(props.candidate)
    const store = useStore()
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const chainId = computed(() => store.state.chainId)
    const decimals = computed(() => store.state['substrate/decimals'])
    const tokenSymbol = ref(chainInfo.value.tokenSymbol)
    const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false })

    watch(() => props.candidate, (newVal) => {
      candidate.value = newVal
    })

    const loading = ref( false)
    const referenda = ref<any[]>()
    const tracks = ref<any[]>([])
    const refVoting = ref<any[]>([])

    const refresh =  async () => {
      loading.value = true
      tracks.value = await getTracks()
      await getRefVoting()
      // console.debug('refVoting', refVoting.value)
      await nextTick()
      referenda.value = await getReferenda()
      loading.value = false
    }

    const getReferenda = async (): Promise<any[]> => {
      // loading.value = true
      const referendumCount = await substrate.api?.query.referenda?.referendumCount() || 0
      const count = Number(referendumCount.toString())
      console.log('referendumCount', count)
      const history = 25
      // const ids = tracks.value?.map((m, idx) => { return { idx: m.idx, id: m.id } }).reverse().slice(0, history)
      // console.debug(ids)
      const refs = []
      // for (let i = 0; i < ids.length; i++) {
      for (let i = count - 1; i >= Math.max(0, count - history); i--) {
        const info = await substrate.api?.query.referenda.referendumInfoFor(i) || JSON.parse('{}')
        // console.debug('info', info?.toJSON())
        const ref = {
          id: i,
          // voting is recorded by track, not by referenda
          // ...voting.toJSON(),
          ...info.toJSON()
        }
        // console.debug('ref', ref)
        refs.push(ref)
      }
      // console.debug('referenda', referenda.value)
      return Promise.resolve(refs)
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

    const refVotingExample = [
      {
        refId: 1,
        voteStack: [
          // [accountId, "how voted"]
          [ 123, { delegating: {} }],
          [ 789, { delegating: {} }],
          [ 456, { voting: {} }]
        ]
      }
    ]

    const collectTrackVotes = (accountId: string, refId: number, trackId: number, vote: any) => {
      // console.debug('collectTrackVotes', accountId, refId, trackId, vote)
      const ref = refVoting.value.find((f: any) => f.refId === refId)
      if (ref) {
        ref.voteStack.push([accountId, vote])
      } else {
        refVoting.value.push({ refId, voteStack: [[accountId, vote]] })
      }
    }

    // did we vote or delegate?
    // returns [[accountId, vote]]
    const getTrackVotes = async (accountId: string, trackId: number, delegations: any[]): Promise<void> => {
      // console.debug('getTrackVotes', accountId, trackId)
      // let stack = [accountId]
      let vote = await substrate.api?.query.convictionVoting.votingFor(accountId, trackId)
      const vote2: any = vote?.toJSON()
      // console.log('vote2', trackId, vote2)
      if (vote2.casting) {
        // console.debug('--> casting', vote2.casting)
        // vote2.casting.votes?.forEach(([refId, vote]: any) => {
        for (let j = 0; j < vote2.casting.votes?.length; j++) {
          const [refId, vote] = vote2.casting.votes[j]
          // console.debug('handle votes for', refId)
          // finally we know what the parent voted for!
          // delegations.forEach((delegation: any) => {
          for(let i = 0; i < delegations.length; i++) {
            const [accid, delegation] = delegations[i]
            // console.debug('delegation', accid, delegation)
            collectTrackVotes(accid, refId, trackId, {...delegation})
          }
          collectTrackVotes(accountId, refId, trackId, vote)
        }
      } else if (vote2.delegating) {
        // console.debug('--> delegating to', vote2.delegating.target)
        // we don't yet know how the delegation was used...
        // collectTrackVotes(accountId, refId, trackId, vote)
        const target = vote2.delegating.target
        // const [stack, delegatedVote] = await getTrackVotes(target, trackId)
        await getTrackVotes(target, trackId, [...delegations, [accountId, vote2]])
      } else {
        console.warn('unknown vote status...???', vote2)
      }
    }

    /**
     * For each Track, get the voting for each Referendum (if any)
     */
    const getRefVoting = async (): Promise<void> => {
      console.debug('getRefVoting()...')
      // const voting: any[] = []
      refVoting.value = []
      // const trackVoting = {}
      for (let i = 0; i < tracks.value.length; i++) {
        const track: any = tracks.value[i]
        // console.debug('track', track)
        // get voting by track.id (not index)
        // let vote = await this.$substrate[this.chainId].query.convictionVoting.votingFor(this.stash, track.id)
        // vote = vote.toJSON()
        await getTrackVotes(candidate.value.stash, track.id, [])
      }
      // console.debug('refVoting', refVoting.value)
      // refVoting.value = refVoting2
      // this.trackVoting = trackVoting
      // return Promise.resolve(refVoting2)
    }

    const getTrack = (id: number) => {
      // console.debug('getTrack', id, this.tracks)
      const t = tracks.value?.find((f: any) => f.id === id)
      if (t) return t; else return { id }
    }

    const hasVotedInRef = (item: any) => {
      // const iitem = {...item}
      // console.debug('hasVotedInRef', {...item})
      // const [refId, _] = iitem
      if (item.id) {
        const refVote = refVoting.value.find(f => f.refId === item.id)
        // console.debug('=>', refVote)
        const hasVote = refVote?.voteStack.find(([_, vote]: any) => vote.standard || vote.splitAbstain)
        return hasVote ? true : false
      } else {
        return false
      }
      //const standard = vote.votes?.find()
    }
    const getTrackName = (item: any) => {
      const iitem = {...item}
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
      console.debug('CandidateReferenda.onBeforeMount()')
      // refresh()
    })

    refresh()

    return {
      substrate,
      chainId,
      // model,
      chainInfo,
      decimals,
      tokenSymbol,
      loading,
      referenda,
      tracks,
      refVoting,
      refresh,
      getTrack,
      hasVotedInRef,
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
    getProgress (item: IInfo) {
      const ayes = BigInt(item?.ongoing?.tally?.ayes || 0)
      const nays = BigInt(item?.ongoing?.tally?.nays || 1)
      const progress = Number(ayes * 100n / (ayes + nays)) / 100
      // console.log('getProgress', ayes, nays, progress)
      return Number(progress * 100)
    },
    getAyes (item: IInfo) {
      const ayes = BigInt(item?.ongoing?.tally?.ayes || 0)
      const nays = BigInt(item?.ongoing?.tally?.nays || 1)
      const progress = Number(ayes * 100n / (ayes + nays)) / 100
      // console.log('getProgress', ayes, nays, progress)
      return Number(progress * 100)
    },
    getNays (item: IInfo) {
      const ayes = BigInt(item?.ongoing?.tally?.ayes || 0)
      const nays = BigInt(item?.ongoing?.tally?.nays || 1)
      const progress = Number(nays * 100n / (ayes + nays)) / 100
      // console.log('getProgress', ayes, nays, progress)
      return Number(progress * 100)
    },
    bigInt (item: any) {
      return Number(BigInt(item) / 10000n)
    }
  }
})
</script>
