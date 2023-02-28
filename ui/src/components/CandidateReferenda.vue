<template>
  <v-card>
    <v-card-title>
      Referenda
    </v-card-title>
    <v-card-text>
      <!-- {{referenda}} -->
      <!-- {{democracy.direct}} -->

      <v-list dense>
        <v-list-item  v-for="(item) in referenda" :key="item.id">
          <!-- <v-list-item-icon>
            {{item.id}}
          </v-list-item-icon> -->
          <v-list-item-content>
            <hr>
            <v-list-item-title>
              #{{item.id}} on "{{getTrack(item.ongoing?.track).name || 'unknown' }}" (Track {{item.ongoing?.track}})
              <span v-if="item.ongoing">
                / Status: Ongoing <!-- {{item.info?.ongoing.tally}} -->
              </span>
              <span v-if="item.approved">
                / Status: Approved <!-- {{item.info?.approved}} -->
              </span>
            </v-list-item-title>

            <v-row dense>
              <v-col class="col-6 col-sm-8">
                <CandidateReferendaVote
                  :stash="stash"
                  :referenda="item"
                  :refVoting="refVoting"
                  :trackVoting="trackVoting"></CandidateReferendaVote>
              </v-col>

              <v-col class="col-1">
                <v-icon :color="refVoting[item.id]?.voted || item.delegating ? 'success' : 'grey'">mdi-vote-outline</v-icon>
              </v-col>

              <!-- <v-col v-show="!item.info?.approved" class="col-1">Ayes: <br><br>Nays: </v-col> -->
              <v-col v-show="!item.approved" class="col-5 col-sm-3">
                <!-- <div> -->
                  <v-progress-linear :value="getAyes(item)"
                    height="15" background-color="grey"
                    color="success">
                    <template v-slot:default="{}">
                      <small>{{ formatAmount(item.ongoing?.tally?.ayes, 2) }} {{chainInfo.tokenSymbol[0]}}</small>
                    </template>
                  </v-progress-linear>
                  <!-- <br> -->
                  <v-progress-linear :value="getNays(item)"
                    height="15" background-color="grey"
                    color="red">
                  <template v-slot:default="{}">
                    <small>{{ formatAmount(item.ongoing?.tally?.nays, 2) }} {{chainInfo.tokenSymbol[0]}}</small>
                  </template>
                </v-progress-linear>
                <!-- </div> -->
              </v-col>
            </v-row>
          </v-list-item-content>

          <!-- <v-list-item-action>
            <v-btn icon>
              <v-icon :color="item.casting?.votes?.length > 0 ? 'success' : 'grey'">mdi-vote-outline</v-icon>
            </v-btn>
          </v-list-item-action> -->
          <v-list-item-action>
            <div class="text-center">
            <v-btn icon small>
              <a class="btn" href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.dotters.network/kusama#/referenda" target="_blank">
                <v-img max-height="16" max-width="16" :src="`/image/${chainId}-logo.png`"></v-img>
              </a>
            </v-btn>
          <!-- </v-list-item-action> -->
          <!-- <v-list-item-action> -->
            <v-btn icon small>
              <a class="btn" :href="`https://${chainId}.polkassembly.io/referenda/${item.id}`" target="_blank">
                <v-img max-height="16" max-width="16" src="/image/polkassembly.png"></v-img>
              </a>
            </v-btn>
          <!-- </v-list-item-action> -->
          <!-- <v-list-item-action> -->
            <v-btn icon small>
              <a class="btn" :href="`https://${chainId}.subscan.io/referenda_v2/${item.id}`" target="_blank">
                <v-img max-height="16" max-width="16" src="/image/subscan-logo.png"></v-img>
              </a>
            </v-btn>
            </div>
          </v-list-item-action>

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
    </v-card-text>
    <!-- <Loading :loading="loading" :absolute="true"></Loading> -->
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { createType } from '@polkadot/types'
// import { hexToString } from '@polkadot/util'
import CandidateReferendaVote from './CandidateReferendaVote.vue'

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

// const info: IInfo = {
//   "ongoing": {
//     "track": 34,
//     "origin": { "origins": "BigSpender" },
//     "proposal": { "lookup": { "hash": "0x581fbf796fda697e05dd559768da5291ee3a6724cd4c9db49c69ea49ac2d1b5b", "len": 43 } },
//     "enactment": { "after": 16460818 },
//     "submitted": 15625631,
//     "submissionDeposit": { "who": "FsnxqJnqWVNMZZgxaQdhaCk9c5sL3WSggRCRqp1qEzk1L2i", "amount": 100000000000000 },
//     "decisionDeposit": { "who": "FsnxqJnqWVNMZZgxaQdhaCk9c5sL3WSggRCRqp1qEzk1L2i", "amount": 16666666500000 },
//     "deciding": { "since": 15625647, "confirming": null },
//     "tally": { "ayes": "0x00000000000000000111ac7f7db262c0", "nays": 10500000000000, "support": "0x00000000000000000044f3aade2a0e60" },
//     "inQueue": false,
//     "alarm": [ 16006508, [ 16006508, 0 ] ]
//   }
// }

interface IData {
  loading: boolean
  referenda: any[]
  tracks: any[]
  refVoting: Record<number, any>
  trackVoting: Record<number, any>
}
interface IMethods {
  formatAmount (amount: number, decimals?: number): string
  asNumber (item: any): number
  getReferenda (): void
  getDelegatedVote (acountId: string, trackId: number): any // [string[], any]
  getTracks (): void
  getTrackVoting (): void
  getTrack (id: number): any
  getProgress (item: any): number
  getAyes (item: any): number
  getNays (item: any): number
  bigInt (item: any): number
}
interface IComputed {
  chainId: string
  chainInfo: any
  decimals: Record<number, any>
  // referenda: any[]
  tokenSymbol: string
}
interface IProps {
  stash: string
}

const trackNames = {
  root: 'Root', // 0
  whitelisted_caller: 'Whitelisted Caller', // 1
  staking_admin: 'Staking Admin', // 2
  treasurer: 'Treasurer', // 3
  lease_admin: 'Lease Admin', // 4
  fellowship_admin: 'Fellowship Admin', // 5
  general_admin: 'General Admin', // 6
  auction_admin: 'Auction Admin', // 7
  referendum_canceller: 'Referendum Canceller', // 8
  referendum_killer: 'Referendum Killer', // 9
  small_tipper: 'Small Tipper', // 10
  big_tipper: 'Big Tipper', // 11
  small_spender: 'Small Spender', // 12
  medium_spender: 'Medium Spender', // 13
  big_spender: 'Big Spender' // 14
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'CandidateReferenda',
  props: {
    stash: { type: String }
  },
  components: {
    // Loading
    CandidateReferendaVote
  },
  computed: {
    // ...mapState(['chainId']),
    ...mapGetters('substrate', ['chainInfo']),
    ...mapState('substrate', ['chainId', 'decimals']),
    // ...mapState('candidate', ['referenda']),
    tokenSymbol () {
      return this.chainInfo.tokenSymbol.toJSON()[0] || '???'
    }
  },
  data () {
    return {
      loading: false,
      referenda: [] as any[],
      tracks: [],
      refVoting: {},
      trackVoting: {}
    }
  },
  methods: {
    formatAmount (amount: number, decimals = 4) {
      // console.debug('formatAmount', amount, this.chainInfo.tokenDecimals.toJSON()[0])
      // {"ss58Format":2,"tokenDecimals":[12],"tokenSymbol":["KSM"]}
      const tokenDecimals = this.chainInfo.tokenDecimals.toJSON()[0] || 1
      // console.debug('', tokenDecimals)
      const denom = this.decimals[tokenDecimals]
      return (amount / denom).toFixed(decimals)
    },
    asNumber (item: any): number {
      return parseInt(item, 10)
    },
    async getReferenda () {
      const referendumCount = await this.$substrate[this.chainId].query.referenda.referendumCount()
      const count = Number(referendumCount.toString())
      // console.log('referendumCount', count)
      const ids = this.tracks.map((m, idx) => { return { idx: m.idx, id: m.id } }).reverse().slice(0, 20)
      // console.debug(ids)
      // for (let i = 0; i < ids.length; i++) {
      for (let i = referendumCount - 1; i >= Math.max(0, referendumCount - 20); i--) {
        const info = await this.$substrate[this.chainId].query.referenda.referendumInfoFor(i)
        console.debug('info', info.toJSON())
        const ref = {
          id: i,
          // voting is recorded by track, not by referenda
          // ...voting.toJSON(),
          ...info.toJSON()
        }
        // console.debug('ref', ref)
        this.referenda.push(ref)
      }
      console.debug('referenda', this.referenda)
    },
    async getTracks () {
      this.tracks = []
      let tracks = await this.$substrate[this.chainId].consts.referenda.tracks
      tracks = tracks.toJSON()
      // console.debug('tracks', tracks.toJSON())
      // tracks.forEach(async (track: any[]) => {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const [id, meta] = track
        // console.log('id', id)
        // const voting = await this.$substrate[this.chainId].query.convictionVoting.votingFor(this.stash, id.toJSON())
        this.tracks.push({
          idx: i,
          id,
          ...meta,
          name: trackNames[meta.name.toString()]
          // voting: JSON.parse(voting.toString())
        })
      }
      console.log('getTracks', this.tracks)
    },

    async getDelegatedVote (accountId: string, trackId: number) {
      console.debug('getDelegatedVote', accountId, trackId)
      let ret = {}
      // let stack = [accountId]
      let vote = await this.$substrate[this.chainId].query.convictionVoting.votingFor(accountId, trackId)
      vote = vote.toJSON()
      // console.log('vote', i, track.name, track.id.toString(), vote)
      if (vote.casting) {
        console.debug('--> casting', vote)
        ret = [[], vote]
      } else if (vote.delegating) {
        console.debug('--> delegating to', vote.delegating.target)
        const target = vote.delegating.target
        const [stack, delegatedVote] = await this.getDelegatedVote(target, trackId)
        console.debug('===> delegated', stack, delegatedVote)
        // stack.push(accountId)
        // delegatedVote = delegatedVote.toJSON()
        return [[target, ...stack], delegatedVote]
      } else {
        console.warn('unknown vote status...???', vote)
        return [null, vote]
      }
      return Promise.resolve(ret)
    },

    async getTrackVoting () {
      // const voting: any[] = []
      const refVoting = {}
      // const trackVoting = {}
      for (let i = 0; i < this.tracks.length; i++) {
        const track = this.tracks[i]
        // console.debug('track', track)
        // get voting by track.id (not index)
        // let vote = await this.$substrate[this.chainId].query.convictionVoting.votingFor(this.stash, track.id)
        // vote = vote.toJSON()
        const [stack, vote] = await this.getDelegatedVote(this.stash, track.id)
        console.log('getTrackVoting', track.id, stack, vote)
        // if (vote.delegating) {
        //   console.debug('delegating', vote.delegating)
        //   const target = vote.delegating.target
        //   let [stack, delegatedVote] = await this.getDelegatedVote(target, track.id)
        //   //delegatedVote = delegatedVote.toJSON()
        //   console.debug('delegatedVote', delegatedVote)
        //   for (let k = 0; k < delegatedVote.casting?.votes?.length; k++) {
        //     const v = vote.casting?.votes[k]
        //     console.debug('===> v', v)
        //     const [refId, voted] = v // id is the referendum Id
        //     console.log('i.k.id', i, k, refId.toString(), voted)
        //     refVoting[`${refId}`] = { voted }
        //   }
        // } else
        if (vote.casting) {
          console.log('casting...')
          // for each vote, assing this to the refVoting dict
          for (let j = 0; j < vote.casting?.votes?.length; j++) {
            const v = vote.casting?.votes[j]
            const [refId, voted] = v // id is the referendum Id
            console.log('i.j.id', i, j, refId.toString(), voted)
            refVoting[`${refId}`] = { voted, stack, track }
          }
        } else {
          console.warn('we did nothing...')
        }
        // trackVoting[track.id.toString] = vote
      }
      console.debug('refVoting', refVoting)
      this.refVoting = refVoting
      // this.trackVoting = trackVoting
    },
    getTrack (id: number) {
      // console.debug('getTrack', id, this.tracks)
      const t = this.tracks.find(f => f.id === id)
      if (t) return t; else return { id }
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
  },
  async created () {
    await this.getTracks()
    await this.getTrackVoting()
    this.loading = true
    await this.getReferenda()
    this.loading = false
  },
  async mounted () {
    this.loading = true
    // // await this.$store.dispatch('candidate/getReferenda', { stash: this.stash })
    // try {
    //   await this.getReferenda()
    // } catch (err) {
    //   console.debug(err)
    // }
    this.loading = false
  }
})
</script>
