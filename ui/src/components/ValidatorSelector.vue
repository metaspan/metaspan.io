<template>

  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Validator Selector ({{chainId}} / {{stash}})</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-items>
        <v-btn small>{{filteredList.length}} of {{count}} vals.</v-btn>
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
        <v-btn small icon @click="calcNominations()"><v-icon>mdi-start</v-icon></v-btn>
      </v-toolbar-items> -->
    </v-toolbar>

    <v-card>
      <v-card-text>
        Stash: {{stash}} <br>
        Is 1KV: {{valIs1kv(stash)}} <br>
        ID: {{ getId() }}
      </v-card-text>
    </v-card>

    <Loading :loading="loading"></Loading>
  </v-container>

</template>

<script lang="ts">
// import { defineComponent } from 'vue'
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { hexToString } from '@polkadot/util'
import { IValidator, ICandidate, IChainInfo, ICandidateIdentity } from '../types/global'
import Loading from './Loading.vue'
import axios from 'axios'

type TF = ReturnType<typeof setInterval>

interface IData {
  stash: string
  candidate: ICandidate
  list: IValidator[]
  validator: IValidator
  multiplier: number
  // commission: [number, number]
  hasId: boolean
  loading: boolean
}
interface IMethods {
  loadValidator (): void
  load (): void
  toNumber (value: any): number
  valIs1kv (stash: string): boolean
  parseId (id: ICandidateIdentity): string
  getId (): string
  calcNominations (): void
}
interface IComputed {
  chainId: string
  decimals: Record<number, number>
  chainInfo: any // IChainInfo
  candidates: ICandidate[]
  // filteredList: IValidator[]
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'ValidatorSelector',
  components: {
    Loading
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    ...mapGetters('candidate', { candidates: 'list' })
    // filteredList () {
    //   const [minCommission, maxCommission] = this.commission
    //   return this.list.filter((v: IValidator) => {
    //     return (v.prefs?.commission <= maxCommission * this.multiplier &&
    //       v.prefs?.commission >= minCommission * this.multiplier) &&
    //       (this.is1kv ? this.valIs1kv(v.stash) : true) &&
    //       (this.hasId ? v.identity : true)
    //   })
    // }
    // ...mapState('pool', ['apiConnected']),
    // ...mapGetters('pool', ['list']),
    // ...mapState('substrate', ['decimals']),
    // ...mapGetters('substrate', ['chainInfo'])
  },
  data () {
    return {
      stash: '',
      // candidates: [] as ICandidate[],
      candidate: {} as ICandidate,
      list: [] as IValidator[],
      validator: {} as IValidator,
      multiplier: 10000000,
      // minCommission: 1,
      // maxCommission: 10,
      // commission: [1, 15], // kusama min = 15%?
      is1kv: false,
      hasId: false,
      loading: false
    }
  },
  watch: {
    // chainId (val) {
    //   this.$store.dispatch('pool/setChainId', val)
    // }
  },
  methods: {
    // async gotoItem (item: IPool, evt: any) {
    //   console.debug('gotoItem()', item, evt)
    //   await this.$store.dispatch('pool/setPool', item)
    //   this.$router.push(`/${this.chainId}/pool/${item.id}`)
    // },
    async loadValidator () {
      console.debug('ValidatorSelector.vue: loadValidators()', this.chainId)
      this.loading = true
      this.candidates = []
      let ret = await axios.get(`https://api.metaspan.io/api/${this.chainId}/candidate`)
      this.candidates = ret.data
      this.list = []
      // await this.$substrate[this.chainId].isReady
      const limit = 50 // hard-coded in api...
      // let offset = 0
      ret = await axios.get(`https://api.metaspan.io/api/${this.chainId}/validator/${this.stash}`)
      this.validator = ret.data
      this.loading = false
    },
    load () {
      this.loadValidator()
    },
    parseId (id) {
      console.debug('parseId', id)
      if (id) {
        return id.name + '/' + id.sub
      } else {
        return ''
      }
    },
    getId () {
      this.candidate = this.candidates.find(f => f.stash === this.stash) || {} as ICandidate
      console.debug('identity', this.candidate?.identity)
      return this.parseId(this.candidate?.identity)
    },
    toNumber (value: any): number {
      if (typeof value === 'string') {
        return Number(BigInt(value))
      } else {
        return Number(value)
      }
    },
    async calcNominations () {
      // this.filteredList.forEach((v: IValidator) => {
      console.debug(this.chainInfo)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.decimals[this.chainInfo.toJSON().tokenDecimals]
      let nomBal = 0
      console.debug('checking noms for', this.stash)
      for (let i = 0; i < this.validator.nominators?.length || 0; i++) {
        // if (i > 2) continue
        const nom = this.validator.nominators[i]
        const bal = await this.$substrate[this.chainId].query.system.account(nom)
        nomBal += bal.data.miscFrozen.toNumber() / this.decimals[decimalPlaces]
        console.debug(nom, bal.data.miscFrozen.toNumber() / this.decimals[decimalPlaces])
      }
      console.debug(this.validator.stash, 'has', nomBal, 'in nominations')
    },
    valIs1kv (stash: string) {
      const found = this.candidates.find((c: ICandidate) => c.stash === stash)
      return !!found
    }
  },
  async created () {
    console.debug(this.$route)
    this.stash = this.$route.params.stash.toString()
    this.$store.dispatch('selector/setValidator', this.stash)
    // console.debug('ValidatorSelector.vue created()', this.chainId, this.list?.length)
    // if (!this.list || this.list.length === 0) {
    //   this.load(this.stash)
    // }
  },
  mounted () {
    this.calcNominations()
  },
  beforeDestroy () {
    // if (this.interval) clearInterval(this.interval)
  }
})
</script>
