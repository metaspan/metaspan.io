<template>
  <v-card>
    <v-card-title>
      Referenda
      <v-btn icon>
        <v-img :src="`/image/${chainId}-logo.jpg`" max-height="16" max-width="16"></v-img>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- {{referenda}} -->
      <!-- {{democracy.direct}} -->

      <v-list transition="scale-transition">
        <v-list-item  v-for="(item) in referenda" :key="item.id">
          <!-- <v-list-item-icon>
            {{item.id}}
          </v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title>
              {{item.id}}. Track: {{getTrack(item.info?.ongoing?.track).name || 'unknown' }}
              <v-icon :color="item.casting?.votes?.length > 0 ? 'success' : 'grey'">mdi-vote-outline</v-icon>
            </v-list-item-title>
            <!-- {{item.casting}} -->
            <v-row>
              <v-col class="col-6 col-sm-8">
                <div v-if="item.info?.ongoing">
                  Status: Ongoing <!-- {{item.info?.ongoing.tally}} -->
                </div>
                <div v-if="item.info?.approved">
                  Statue: Approved <!-- {{item.info?.approved}} -->
                </div>
              </v-col>
              <!-- <v-col v-show="!item.info?.approved" class="col-1">Ayes: <br><br>Nays: </v-col> -->
              <v-col v-show="!item.info?.approved" class="col-6 col-sm-4">
                <div>
                  <v-progress-linear :value="getAyes(item?.info)"
                    height="15" background-color="grey"
                    color="success">
                  <template v-slot:default="{}">
                    <small>{{ formatAmount(item.info?.ongoing?.tally?.ayes, 2) }} {{chainInfo.tokenSymbol[0]}}</small>
                  </template>
                </v-progress-linear>
                <br>
                  <v-progress-linear :value="getNays(item?.info)"
                    height="15" background-color="grey"
                    color="red">
                  <template v-slot:default="{}">
                    <small>{{ formatAmount(item.info?.ongoing?.tally?.nays, 2) }} {{chainInfo.tokenSymbol[0]}}</small>
                  </template>
                </v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </v-list-item-content>

          <!-- <v-list-item-action>
            <v-btn icon>
              <v-icon :color="item.casting?.votes?.length > 0 ? 'success' : 'grey'">mdi-vote-outline</v-icon>
            </v-btn>
          </v-list-item-action> -->
          <v-list-item-action>
            <v-btn icon>
              <a class="btn" :href="`https://${chainId}.polkassembly.io/referenda/${item.id}`" target="_blank">
                <v-img max-height="16" max-width="16" src="/image/polkassembly.png"></v-img>
              </a>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon>
              <a class="btn" href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.dotters.network/kusama#/referenda" target="_blank">
                <v-img :src="`/image/${chainId}-logo.png`" max-height="16" max-width="16"></v-img>
              </a>
            </v-btn>
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
// import Loading from './Loading.vue'
import { hexToString } from '@polkadot/util'

// function hexToNumber(hex: string) {
//   if (typeof hex !== 'string') {
//     throw new TypeError('hexToNumber: expected string, got ' + typeof hex);
//   }
//   return BigInt(`0x${hex}`);
// }

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
}
interface IMethods {
  formatAmount (amount: number): string
  asNumber (item: any): number
  getReferenda (): void
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
      tracks: []
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
      // console.debug('asNumber', item)
      // if (typeof item === 'number') {
      //   return item as number
      // } else {
      //   console.debug(item)
      //   // const str = hexToString(item)
      //   const str = item.toString()
      //   console.debug('str', str)
      //   return Number(str)
      // }
      return parseInt(item, 10)
    },
    async getReferenda () {
      const referendumCount = await this.$substrate[this.chainId].query.referenda.referendumCount()
      const count = Number(referendumCount.toString())
      console.log('referendumCount', count)
      for (let i = count; i > Math.max(0, count - 20); i--) {
        const voting = await this.$substrate[this.chainId].query.convictionVoting.votingFor(this.stash, i)
        const info = await this.$substrate[this.chainId].query.referenda.referendumInfoFor(i)
        const ref = { id: i, ...voting.toJSON(), info: info.toJSON() }
        // console.debug('ref', i, ref)
        this.referenda.push(ref)
      }
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
    this.tracks = []
    const tracks = await this.$substrate[this.chainId].consts.referenda.tracks
    // console.debug('tracks', tracks.toJSON())
    tracks.forEach((track: any[]) => {
      const [id, meta] = track
      this.tracks.push({ id: id.toJSON(), ...meta.toJSON(), name: trackNames[meta.name.toString()] })
    })
  },
  async mounted () {
    this.loading = true
    // await this.$store.dispatch('candidate/getReferenda', { stash: this.stash })
    try {
      await this.getReferenda()
    } catch (err) {
      console.debug(err)
    }
    this.loading = false
  }
})
</script>
