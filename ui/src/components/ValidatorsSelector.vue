<template>

  <v-container fluid>
    <v-toolbar flat>
      <v-toolbar-title>Validator Selector ({{chainId}})</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <!-- <v-card>
      <v-card-text> -->
        <v-row>
          <v-col>
            <v-text-field v-model="stake" label="Planned stake"></v-text-field>
            <v-checkbox small v-model="filter.is1kv" label="1KV?"></v-checkbox>
            <v-checkbox small v-model="filter.hasId" label="ID?"></v-checkbox>
            <v-checkbox small v-model="filter.active" label="Active?"></v-checkbox>
          </v-col>
          <v-col>
            <v-text-field v-model="filter.commission[0]" label="Min. Commission"></v-text-field>
            <v-text-field v-model="filter.commission[1]" label="Max. Commission"></v-text-field>
            <v-text-field v-model="filter.maxNominators" label="Max. Nominators"></v-text-field>
            <v-text-field v-model="numPeriods" label="Num. periods (Era)"></v-text-field>
          </v-col>
        </v-row>
      <!-- </v-card-text>
    </v-card> -->
    <!-- {{selected}} -->
    <v-toolbar dense dark elevation="2">
      <v-spacer></v-spacer>
      <div>{{filteredList.length}} of {{list.length}} vals.</div>
      <v-btn text @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      <v-btn text @click="calcActivity()"><v-icon>mdi-radioactive</v-icon></v-btn>
      <v-btn text @click="calcNominations()"><v-icon>mdi-calculator-variant-outline</v-icon></v-btn>
    </v-toolbar>

    <v-simple-table>
      <thead>
        <th></th>
        <th>Stash</th>
        <th>Comm</th>
        <th>ID</th>
        <th>Active</th>
        <th>Activity</th>
        <th>1KV</th>
        <th>Noms.</th>
        <th>Profile</th>
      </thead>
      <tbody>
        <tr v-for="item in filteredList" v-bind:key="item.stash">
          <td>
            <v-checkbox v-model="selected" :value="item.stash"></v-checkbox>
          </td>
          <td class="text-left"><router-link :to="`/${chainId}/selector/${item.stash}`">{{item.shortStash}}</router-link></td>
          <td class="text-center">{{item.prefs.commission / 10000000}}%</td>
          <td class="text-center">{{ item.identity ? item.identity.name || item.identity.info?.display : ''}}</td>
          <td class="text-center">
            <v-icon :color="isActive(item.stash) ? 'success' : ''">mdi-{{ isActive(item.stash) ? 'circle' : 'checkbox-blank-circle-outline' }}</v-icon>
          </td>
          <td :id="`activity_${item.stash}`"></td>
          <td class="text-center">
            <v-icon :color="valIs1kv(item.stash) ? 'success' : ''">mdi-{{ valIs1kv(item.stash) ? 'check-circle' : 'checkbox-blank-circle-outline'}}</v-icon>
          </td>
          <td class="text-center">
            <v-chip small :color="getChipColor(item.nominators?.length || 0)">{{item.nominators?.length || 0}}</v-chip>
          </td>
          <td>
            <!-- <div width="40px" height="16px"> -->
              <div :id="`chart_${item.stash}`"></div>
            <!-- </div> -->
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <Loading :loading="loading"></Loading>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { hexToString } from '@polkadot/util'
import { IValidator, ICandidate, IChainInfo } from '../types/global'
import Loading from './Loading.vue'
import axios from 'axios'
import Chart, { ChartItem } from 'chart.js/auto'

type TF = ReturnType<typeof setInterval>

interface IFilter {
  is1kv: boolean
  hasId: boolean
  active: boolean
  commission: [number, number]
  maxNominators: number
}
interface IData {
  activeSet: string[]
  count: number
  multiplier: number
  selected: string[]
  // minCommission: number
  // maxCommission: number
  stake: number
  numPeriods: number
  activity: Record<string, number[]>
  filter: IFilter
  loading: boolean
}
interface IMethods {
  loadValidators (): void
  reload (): void
  toNumber (value: any): number
  valIs1kv (stash: string): boolean
  isActive (stash: string): boolean
  clearAllIntervals (): void
  calcActivity(): void
  calcNominations (): void
  getChipColor (noms: number): string
}
interface IComputed {
  chainId: string
  decimals: Record<number, number>
  chainInfo: any // IChainInfo
  list: IValidator[]
  candidates: ICandidate[]
  filteredList: IValidator[]
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'ValidatorsSelector',
  components: {
    Loading
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('selector', ['list']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    ...mapGetters('candidate', { candidates: 'list' }),
    filteredList () {
      const [minCommission, maxCommission] = this.filter.commission
      return this.list.filter((v: IValidator) => {
        return (v.prefs?.commission <= maxCommission * this.multiplier &&
          v.prefs?.commission >= minCommission * this.multiplier) &&
          (this.filter.active ? this.isActive(v.stash) : true) &&
          (this.filter.is1kv ? this.valIs1kv(v.stash) : true) &&
          (this.filter.hasId ? v.identity : true) &&
          (this.filter.maxNominators > 0 ? v.nominators?.length <= this.filter.maxNominators : true)
      })
    }
    // ...mapState('pool', ['apiConnected']),
    // ...mapGetters('pool', ['list']),
    // ...mapState('substrate', ['decimals']),
    // ...mapGetters('substrate', ['chainInfo'])
  },
  data () {
    return {
      // candidates: [] as ICandidate[],
      // list: [] as IValidator[],
      activeSet: [],
      count: 0,
      multiplier: 10000000,
      stake: 10,
      numPeriods: 5,
      activity: {},
      // maxCommission: 10,
      selected: [],
      filter: {
        is1kv: false,
        hasId: false,
        active: false,
        commission: [1, 15], // kusama min = 15%?
        maxNominators: 300
      },
      loading: false,
      interval: {} as TF
    }
  },
  watch: {
    chainId (val) {
      this.$store.dispatch('selector/setChainId', val)
    },
    filter: {
      deep: true,
      handler (newVal: boolean) {
        this.$store.dispatch('selector/setFilter', newVal)
      }
    }
  },
  methods: {
    // async gotoItem (item: IPool, evt: any) {
    //   console.debug('gotoItem()', item, evt)
    //   await this.$store.dispatch('pool/setPool', item)
    //   this.$router.push(`/${this.chainId}/pool/${item.id}`)
    // },
    async loadValidators () {
      console.debug('ValidatorSelector.vue: loadValidators()', this.chainId)
      this.loading = true
      let list: IValidator[] = []
      await this.$store.dispatch('selector/setList', list)
      // await this.$substrate[this.chainId].isReady
      const limit = 50 // hard-coded in api...
      let offset = 0
      let ret = await axios.get(`https://api.metaspan.io/api/${this.chainId}/validator?limit=${limit}`)
      const count = ret.data?.count
      this.count = count
      list = ret.data.list
      for (let i = 1; i < Math.ceil(count / limit); i++) {
        offset += limit
        ret = await axios.get(`https://api.metaspan.io/api/${this.chainId}/validator?limit=${limit}&offset=${offset}`)
        console.log(ret.data)
        ret.data.list.forEach((val: IValidator) => {
          if (!list.find((f: IValidator) => f.stash === val.stash)) {
            list.push(val)
          } else {
            console.debug(val.stash, 'already in list')
          }
        })
      }
      this.$store.dispatch('selector/setList', list)
      this.loading = false
    },
    reload () {
      this.loadValidators()
    },
    toNumber (value: any): number {
      if (typeof value === 'string') {
        return Number(BigInt(value))
      } else {
        return Number(value)
      }
    },
    /*
             |       Era     |    Session    |    Epoch     | Slot
    Kusama   |   6hr ( 3600) |   1hr  ( 600) |  1hr  (600)  | 6sec
    Polkadot |  24hr (14400) |   4hr  (2400) |  4hr (2400)  | 6sec
    */
    async calcActivity () {
      const activity = {}
      let era = await this.$substrate[this.chainId].query.staking.activeEra()
      // var header = await this.$substrate[this.chainId].derive.chain.getHeader()
      // console.debug('header', header.toJSON())
      era = era.toJSON()
      console.debug(era)
      // const slots = this.chainId === 'kusama' ? 600 : 2400 // step size for blocks/headers
      // var started = era.start // slot?
      for (let i = era.index; i > era.index - this.numPeriods; i--) {
        const start = await this.$substrate[this.chainId].query.staking.erasStartSessionIndex(i)
        // start = start.toJSON()
        const slotNumber = start.toJSON() // * slots
        console.debug(i, 'start', start.toJSON(), slotNumber)
        const blockHash = await this.$substrate[this.chainId].rpc.chain.getBlockHash(slotNumber)
        // start = start.createdAtHash
        console.debug('blockHash', blockHash.toString())

        const apiAt = await this.$substrate[this.chainId].at(blockHash.toString())
        let vals = await apiAt.query.session.validators()
        vals = vals.toJSON()
        console.debug(vals)
        this.filteredList.forEach(val => {
          if (!activity[val.stash]) {
            activity[val.stash] = {}
          }
          activity[val.stash][`${i}`] = vals.includes(val.stash) ? 1 : 0
        })
        console.debug(activity)
        // vals.forEach((val: string) => {
        //   console.log(val)
        //   activity[val][`${i}`] = 1
        // })
        // console.debug(activity)
      }
      this.filteredList.forEach(val => {
        let sum = 0
        Object.values(activity[val.stash]).forEach((val: any) => { sum += val })
        console.log(val.stash, sum)
        const avg = sum / Object.keys(activity[val.stash]).length
        const el = document.getElementById(`activity_${val.stash}`)
        if (el) el.innerHTML = (avg * 100).toFixed(2) + '%'
      })
      // for (var j = 0; j < this.filteredList.length; j++) {
      //   const v = this.filteredList[j]
      //   const el = document.getElementById(`activity_${v.stash}`)
      //   if (el) el.innerHTML = 'loading...'
      // }
    },
    async calcNominations () {
      // this.filteredList.forEach((v: IValidator) => {
      const tokenDecimals = this.chainInfo.tokenDecimals.toJSON()[0]
      console.debug(tokenDecimals, this.decimals[tokenDecimals])
      // console.debug(this.decimals)
      const denom = this.decimals[tokenDecimals]
      console.debug('denom', denom)
      for (let j = 0; j < this.filteredList.length; j++) {
        const v = this.filteredList[j]
        const el = document.getElementById(`chart_${v.stash}`)
        if (el) el.innerHTML = 'loading...'
        // if (j > 2) continue
        if (v.nominators.length < 256) { // TODO make this dynamic
          if (el) el.innerHTML = 'ok'
          continue
        }
        let nomBal = BigInt(0)
        let nomHist = [] as bigint[]
        console.debug('checking noms for', v.stash, v.nominators?.length)
        for (let i = 0; i < v.nominators?.length || 0; i++) {
          // if (i > 2) continue
          const nom = v.nominators[i]
          const bal = await this.$substrate[this.chainId].query.system.account(nom)
          const val = BigInt(bal.data.miscFrozen) / BigInt(denom)
          nomHist.push(val)
          nomBal += val
          console.debug(i, val, nomBal)
          // console.debug(nom, bal.data.miscFrozen.toNumber() / denom)
        }
        nomHist = nomHist.sort((a: bigint, b: bigint) => { return a < b ? -1 : 1 })
        console.debug('nomHist', nomHist)
        if (el) el.innerHTML = nomHist[256] > this.stake ? 'too low ' + nomHist[256] : 'ok'
        // eslint-disable-next-line

        // const el = document.getElementById(`chart_${v.stash}`) as HTMLCanvasElement // ?.getContext('2d') as ChartItem
        // const ctx = el.getContext('2d') as ChartItem
        // console.debug(ctx)
        // const c = new Chart(
        //   ctx,
        //   {
        //     type: 'line',
        //     options: {
        //       elements: {
        //         line: {
        //           tension: 0.1,
        //           borderWidth: 1
        //         },
        //         point: {
        //           radius: 1
        //         }
        //       },
        //       plugins: {
        //         legend: {
        //           display: false
        //         },
        //         tooltip: {
        //           enabled: false
        //         }
        //       }
        //       // annotations: {[
        //       //   {
        //       //   // annotations: [{
        //       //     type: 'line',
        //       //     mode: 'horizontal',
        //       //     scaleID: 'y-axis-0',
        //       //     value: 5,
        //       //     borderColor: 'rgb(75, 192, 192)',
        //       //     borderWidth: 4,
        //       //     label: {
        //       //       enabled: false,
        //       //       content: 'Test label'
        //       //     }
        //       //   }
        //       // ]}
        //     },
        //     data: {
        //       labels: nomHist,
        //       datasets: [
        //         { data: nomHist }
        //       ]
        //     }
        //   }
        // )
        console.debug(v.stash, 'has', nomBal, 'in nominations')
      }
    },
    clearAllIntervals () {
      // const int = parseInt(this.interval.toString())
      // for (var i = 0; i <= int; i++) {
      //   try {
      //     clearInterval(i)
      //   } catch (err) {
      //     console.debug('Interval ' + i + ' not valid')
      //   }
      // }
    },
    valIs1kv (stash: string) {
      // console.debug(this.candidates)
      const found = this.candidates?.find((c: ICandidate) => c.stash === stash)
      return !!found
    },
    isActive (stash: string) {
      return this.activeSet.includes(stash)
    },
    getChipColor (noms: number) {
      if (noms >= 256) {
        return 'red'
      } else if (noms >= 200) {
        return 'warning'
      } else {
        return 'success'
      }
    }
  },
  async created () {
    console.debug('ValidatorsSelector.vue created()', this.chainId, this.list?.length)
    if (!this.candidates || this.candidates.length === 0) {
      await this.$store.dispatch('candidate/getList')
      setTimeout(() => {
        if (this.list.length === 0) this.reload()
      }, 5000)
    } else {
      if (!this.list || this.list.length === 0) {
        if (this.list.length === 0) this.reload()
      }
    }
    this.filter = this.$store.state.selector.filter
  },
  async mounted () {
    // console.debug('candidates', this.candidates)
    const vals = await this.$substrate[this.chainId].query.session.validators()
    this.activeSet = vals.toJSON()
  },
  beforeDestroy () {
    // if (this.interval) clearInterval(this.interval)
  }
})
</script>
