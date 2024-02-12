<template>
  <v-container class="mt-0 pt-0" style="min-height:800px">
    <v-toolbar color="none">
      <v-toolbar-title>
        OpenGov Delegation
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn> -->
    </v-toolbar>

    <v-progress-linear indeterminate v-show="loading"></v-progress-linear>

    <v-row>
      <v-col class="ma-2 pa-2" align="center">
        <v-card max-width="600" align="left">
          <v-card-title>Check Delegations</v-card-title>
          <v-text-field
            v-model="address2"
            label="Address"
            hint="Address/stash to check for delegations"
            autocomplete="on"
            @keyup.enter="refresh()"
          ></v-text-field>
          <v-row>
            <v-col class="text-center">
              <v-btn type="submit" color="primary" @click="refresh()">Check Delegation</v-btn>
            </v-col>
          </v-row>

          <v-list two-line align="none">
            <v-list-item v-for="(item) in delegations" :key="item.trackId">
              <hr>
              <!-- {{ item }} -->
              <v-list-item-title>
                {{ item.trackId }} - {{ getTrack(item.trackId).name }}
                <small><sup><a :href="`https://${chainId}.subsquare.io/referenda/track/${item.trackId}`" target="_blank" style="color: primary;">
                  <v-icon>mdi-open-in-new</v-icon></a></sup></small>
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
        </v-card>
      </v-col>
    </v-row>

    <v-row v-show="false">
      <v-col class="ma-2 pa-2" align="center">
        <v-card max-width="600" align="left">
          <v-card-title>Delegate</v-card-title>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                v-model="target"
                label="Target"
              ></v-text-field>

              <v-row>
                <v-col class="text-center">
                  <v-btn type="submit" color="primary" disabled>Delegate</v-btn>
                </v-col>
              </v-row>

            </v-form>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- <v-select
          :items="extensions"
          :item-title="(item) => item.name"
          :item-value="(item) => item"></v-select> -->
        <v-select
          v-model="signer"
          :items="allAccounts"
          :item-title="(item) => item.meta.name + '\n(' + item.address2 + ')'"
          :item-value="(item) => item"
          :hint="`Be sure the wallet matches chain (${chainId})`"
          :error-messages="[
            walletMatchesAddress ? '' : 'Wallet does not match address (' + address2 + ')',
            walletMatchesChain ? '' : 'Wallet does not match chain (' + chainId + ')',
          ]">
        </v-select>
      </v-col>
      <v-col>
        <v-btn @click="buildBatch"
          :color="walletMatchesChain ? 'primary' : 'red'">Build & Sign Batch</v-btn>
        
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea v-model="txBatch"></v-textarea>
        <!-- <pre>{{ txBatch }}</pre> -->
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      location="top"
      transition="fade-transition"
      color="orange"
    >
      {{ errorMessage }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, computed, watch, onBeforeMount, nextTick } from 'vue'

const isServer = typeof window === 'undefined'
// imports for signing
// import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
// end of imports for signing

import { SubstrateAPI } from '@/plugins/substrate'
import ClickToCopy from './ClickToCopy.vue'
// import router from '@/router'

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

class CDefaultTracks {
  data: any[]
  constructor () {
    this.data = []
  }
  toJSON () {
    return this.data
  }
}

export default defineComponent({
  name: 'CandidateDelegation',
  components: {
    // Loading
    ClickToCopy
  },
  props: {
    address: {
      type: String,
      required: false
    } 
  },
  setup (props: any) {
    // console.debug('OpenGovDelegation.setup()', props)
    // const candidate = ref(props.candidate)
    const store = useStore()
    const substrateStore = useSubstrateStore()
    const route = useRoute()
    const chainInfo = computed(() => substrateStore.chainInfo)
    const chainId = computed(() => store.chainId)
    // const decimals = computed(() => store.state['substrate/decimals'])
    const tokenSymbol = ref(chainInfo.value.tokenSymbol)
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI
    const router = useRouter()

    const address2 = ref(props.address || '')
    const target = ref('')
    const loading = ref(false)
    const errorMessage = ref('')
    const snackbar = ref(false)
    const tracks = ref<any[]>([])
    const delegations = ref<IDelegation[]>([])
    const refVoting = ref<any[]>([])

    var extensions = ref<any[]>([])
    var allAccounts = ref<any[]>([])
    var signer = ref<any>(null)

    const init = async () => {
      // console.debug('init')
      // extensions.value = await web3Enable('metaspan.io')
      // if (extensions.value.length === 0) {
      //   console.warn('no extensions installed')
      //   return
      // }
      // allAccounts.value = await web3Accounts()
      // // const ss58Prefix = substrate.api?.registry.chainSS58;
      // allAccounts.value.forEach((account: any) => {
      //   // account.meta.source = extensions.value.find((ex: any) => ex.address === account.meta.source)
      //   const publicKey = decodeAddress(account.address)
      //   // polkadot (0) or kusama (2)
      //   const ss58Prefix = account.meta.genesisHash === "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3" ? 0 : 2
      //   account.address2 = encodeAddress(publicKey, ss58Prefix)
      // })
      // console.log(allAccounts)
    }
    init()

    const walletMatchesAddress = computed(() => {
    //   console.debug('walletMatchesAddress', signer.value?.address2, address2.value)
    //   return signer.value?.address2 === address2.value
      return false
    })

    const walletMatchesChain = computed(() => {
    //   console.debug('walletMatchesChain', signer.value?.meta.genesisHash, substrate.api?.genesisHash)
    //   return substrate.api?.genesisHash.toString() === signer.value?.meta.genesisHash
      return false
    })

    watch(() => chainId.value, (newVal: any) => {
      router.push(`/${newVal}/delegate`)
    })

    watch(() => address2.value, (newVal: any) => {
      const url = new URL(window.location.href)
      const newPath = `/${chainId.value}/delegate/${newVal}`
      const newURL = `${url.protocol}//${url.host}${newPath}`;
      history.pushState({}, '', newURL);
    })

    const refresh =  async () => {
      if(address2.value === '') return
      console.debug('refresh', address2.value, chainId.value)
      loading.value = true
      tracks.value = await getTracks()
      delegations.value = await getDelegations(address2.value)
      // console.debug('refVoting', refVoting.value)
      await nextTick()
      // referenda.value = await getReferenda()
      loading.value = false
    }

    const getTracks = async (): Promise<any[]> => {
      console.debug('getTracks', chainId.value)
      // tracks.value = []
      try {
        await substrate.api?.isReady
      } catch (err) {
        console.warn('getTracks', err)
        return Promise.reject()
      }
      let tracks: any = substrate.api?.consts.referenda?.tracks || new CDefaultTracks()
      console.debug('tracks', tracks)
      try {
        tracks = tracks.toJSON()
      } catch (err) {
        console.warn('getTracks', err)
        snackbar.value = true
        errorMessage.value = 'Error getting delegations for address' // err.message
        return Promise.resolve([])
      }
      // if (tracks.hasOwnProperty('toJSON')) tracks = tracks.toJSON()
      // tracks = {...tracks}
      // console.debug('tracks', tracks)
      const ttracks = []
      // tracks.forEach(async (track: any[]) => {
      for (let i = 0; i < tracks.length; i++) {
        const track: any = tracks[i]
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

    const getDelegations = async (account: string): Promise<IDelegation[]> => {
      // console.debug('getDelegations', account)
      // const delegations = await substrate.api?.query.referendum?.delegations(account) || JSON.parse('[]')
      // // console.debug('delegations', delegations)
      const delegations: IDelegation[] = []
      for (let i = 0; i < tracks.value.length; i++) {
        const trackId = tracks.value[i].id
        // console.debug('trackId', trackId)
        var result = null
        try {
          result = await substrate.api?.query.convictionVoting.votingFor(account, trackId)
        } catch (err: any) {
          console.warn('getDelegations', err)
          snackbar.value = true
          errorMessage.value = 'Error getting delegations for address' // err.message
          return Promise.resolve([])
        }
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
        if (trackVote?.casting) {
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

    onBeforeMount(async () => {
      console.debug('CandidateDelegation.onBeforeMount()')
      setTimeout(async () => {
        await substrate.api?.isReady
        console.debug('CandidateDelegation.onBeforeMount() isReady')
        refresh()
      }, 1000)
    })

    const txBatch: any = ref() // ref<any[]>([])
    const buildBatch = async (api: any, calls: any[]) => {
      // // txBatch.value = [] as any[]
      // const txs = [] as any[]
      // for (let i = 0; i < delegations.value.length; i++) {
      //   const delegation: IDelegation = delegations.value[i]
      //   // const txs = [] as any[]
      //   for (let j = 0; j < delegation.votes.length; j++) {
      //     const tx = substrate.api?.tx.convictionVoting.removeVote(delegation.trackId, delegation.votes[j])
      //     txs.push(tx)
      //     // DEBUG
      //     // j = delegation.votes.length
      //   }
      //   // DEBUG
      //   // i = delegations.value.length
      //   console.debug('buildBatch', txs)
      //   // txBatch.value.push(...txs)
      // }
      // const txb = substrate.api?.tx.utility.batch(txs)

      // const account = signer.value
      // console.debug('account', account)
      // const injector = await web3FromSource(account?.meta.source)
      // console.debug('injector', injector)
      
      // txb?.signAndSend(account.address, { signer: injector.signer }, (result: any) => {
      //   console.debug('result', result)
      //   if (result.status.isInBlock) {
      //     console.debug(`Completed at block hash #${result.status.asInBlock.toString()}`)
      //   } else {
      //     console.debug(`Current status: ${result.status.type}`)
      //   }
      // })
      
      // // const signed = await txb?.signAsync(address2.value, { signer: await web3FromSource(extensions[0].name) })
      // // console.debug('buildBatch', signed)
      // // const txU8a = txb?.method.toU8a()
      // // const txHex = substrate.api?.createType('Extrinsic', txU8a).toHex();

      // // console.debug('buildBatch', txHex)
      // // txBatch.value = txHex // ?.method.args[0]
    }

    // refresh()

    return {
      chainId,
      address2,
      target,
      loading,
      snackbar,
      errorMessage,
      // referenda,
      tokenSymbol,
      tracks,
      delegations,
      refVoting,
      txBatch,
      extensions,
      allAccounts,
      signer,
      refresh,
      getTrack,
      // hasVotedInRef,
      shortStash,
      getTrackName,
      buildBatch,
      walletMatchesChain,
      walletMatchesAddress
    }
  },
  methods: {
    formatAmount (amount: number, decimals = 4): string {
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
