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
      <v-btn @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      <v-btn @click="calcActivity()"><v-icon>mdi-radioactive</v-icon></v-btn>
      <v-btn @click="calcNominations()"><v-icon>mdi-calculator-variant-outline</v-icon></v-btn>
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
// import Vue from 'vue'
import { defineComponent, computed, ref, watch, inject, onBeforeMount } from 'vue'
import { useStore, mapState, mapGetters } from 'vuex'
import { hexToString } from '@polkadot/util'
import { IValidator, ICandidate, IChainInfo } from '../types/global'
import Loading from './Loading.vue'
import axios from 'axios'
import Chart, { ChartItem } from 'chart.js/auto'
import { SubstrateAPI } from '@/plugins/substrate'

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

export default defineComponent({
  name: 'ValidatorsSelector',
  components: {
    Loading
  },
  setup() {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const list = computed<any[]>(() => store.state['selector/list'])
    const decimals = computed(() => store.state['substrate/decimals'])
    const candidates = computed(() => store.state['candidate/list'])
    const activeSet = ref([] as string[])
    const count = ref(0)
    const multiplier = ref(10000000)
    const stake = ref(10)
    const numPeriods = ref(5)
    const activity = ref({})
    // maxCommission: 10,
    const selected = ref([])
    const filter = ref({
      is1kv: false,
      hasId: false,
      active: false,
      commission: [1, 15], // kusama min = 15%?
      maxNominators: 300
    })
    const loading = ref(false)
    const interval = ref({} as TF)
    const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false })

    const valIs1kv = (stash: string) => {
      // console.debug(this.candidates)
      const found = candidates.value.find((c: ICandidate) => c.stash === stash)
      return !!found
    }
    const isActive = (stash: string): boolean => {
      return activeSet.value.includes(stash)
    }

    const filteredList = computed(() => {
      const [minCommission, maxCommission] = filter.value.commission
      return list.value.filter((v: IValidator) => {
        return (v.prefs?.commission <= maxCommission * multiplier.value &&
          v.prefs?.commission >= minCommission * multiplier.value) &&
          (filter.value.active ? isActive(v.stash) : true) &&
          (filter.value.is1kv ? valIs1kv(v.stash) : true) &&
          (filter.value.hasId ? v.identity : true) &&
          (filter.value.maxNominators > 0 ? v.nominators?.length <= filter.value.maxNominators : true)
      })
    })

    const loadValidators = async () => {
      console.debug('ValidatorSelector.vue: loadValidators()', chainId.value)
      loading.value = true
      let list: IValidator[] = []
      await store.dispatch('selector/setList', list)
      // await this.$substrate[this.chainId].isReady
      const limit = 50 // hard-coded in api...
      let offset = 0
      let ret = await axios.get(`https://api.metaspan.io/api/${chainId.value}/validator?limit=${limit}`)
      count.value = ret.data?.count
      list = ret.data.list
      for (let i = 1; i < Math.ceil(count.value / limit); i++) {
        offset += limit
        ret = await axios.get(`https://api.metaspan.io/api/${chainId.value}/validator?limit=${limit}&offset=${offset}`)
        console.log(ret.data)
        ret.data.list.forEach((val: IValidator) => {
          if (!list.find((f: IValidator) => f.stash === val.stash)) {
            list.push(val)
          } else {
            console.debug(val.stash, 'already in list')
          }
        })
      }
      store.dispatch('selector/setList', list)
      loading.value = false
    }
    const reload = () => {
      loadValidators()
    }
    const toNumber = (value: any): number => {
      if (typeof value === 'string') {
        return Number(BigInt(value))
      } else {
        return Number(value)
      }
    }

    /*
             |       Era     |    Session    |    Epoch     | Slot
    Kusama   |   6hr ( 3600) |   1hr  ( 600) |  1hr  (600)  | 6sec
    Polkadot |  24hr (14400) |   4hr  (2400) |  4hr (2400)  | 6sec
    */
    const calcActivity = async () => {
      // const activity = {}
      const activity: Record<string, any> = {}
      let era = await substrate.api?.query.staking.activeEra()
      // var header = await this.$substrate[this.chainId].derive.chain.getHeader()
      // console.debug('header', header.toJSON())
      const era2: any = era?.toJSON()
      console.debug(era2)
      // const slots = this.chainId === 'kusama' ? 600 : 2400 // step size for blocks/headers
      // var started = era.start // slot?
      for (let i = era2.index; i > era2.index - numPeriods.value; i--) {
        const start = await substrate.api?.query.staking.erasStartSessionIndex(i)
        // start = start.toJSON()
        const slotNumber: any = start?.toJSON() // * slots
        console.debug(i, 'start', start?.toJSON(), slotNumber)
        const blockHash: any = await substrate.api?.rpc.chain.getBlockHash(slotNumber)
        // start = start.createdAtHash
        console.debug('blockHash', blockHash?.toString())

        const apiAt = await substrate.api?.at(blockHash?.toString())
        let vals = await apiAt?.query.session.validators()
        const vals2: any = vals?.toJSON() || []
        console.debug(vals2)
        filteredList.value.forEach((val: any) => {
          if (!activity[val.stash]) {
            activity[val.stash] = {}
          }
          activity[val.stash][`${i}`] = vals2.includes(val.stash) ? 1 : 0
        })
        console.debug(activity)
        // vals.forEach((val: string) => {
        //   console.log(val)
        //   activity[val][`${i}`] = 1
        // })
        // console.debug(activity)
      }
      filteredList.value.forEach((val: any) => {
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
    }

    const calcNominations = async () => {
      // this.filteredList.forEach((v: IValidator) => {
      const chainInfo: any =  await substrate.api?.registry.getChainProperties()
      const tokenDecimals = chainInfo.value.tokenDecimals.toJSON()[0]
      console.debug(tokenDecimals, decimals.value[tokenDecimals])
      // console.debug(this.decimals)
      const denom = decimals.value[tokenDecimals]
      console.debug('denom', denom)
      for (let j = 0; j < filteredList.value.length; j++) {
        const v = filteredList.value[j]
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
          const bal: any = await substrate.api?.query.system.account(nom)
          const val = BigInt(bal.data.miscFrozen) / BigInt(denom)
          nomHist.push(val)
          nomBal += val
          console.debug(i, val, nomBal)
          // console.debug(nom, bal.data.miscFrozen.toNumber() / denom)
        }
        nomHist = nomHist.sort((a: bigint, b: bigint) => { return a < b ? -1 : 1 })
        console.debug('nomHist', nomHist)
        if (el) el.innerHTML = nomHist[256] > stake.value ? 'too low ' + nomHist[256] : 'ok'
        // eslint-disable-next-line

        console.debug(v.stash, 'has', nomBal, 'in nominations')
      }
    }

    watch(() => chainId.value, newVal => {
      store.dispatch('selector/setChainId', newVal)
    })
    watch(() => filter.value, newVal => {
      store.dispatch('selector/setFilter', newVal)
    })

    onBeforeMount(async () => {
      console.debug('ValidatorsSelector.vue created()', chainId.value, list.value.length)
      if (!candidates.value || candidates.value.length === 0) {
        await store.dispatch('candidate/getList')
        setTimeout(() => {
          if (list.value.length === 0) reload()
        }, 5000)
      } else {
        if (!list.value || list.value.length === 0) {
          if (list.value.length === 0) reload()
        }
      }
      filter.value = store.state.selector.filter
      // console.debug('candidates', this.candidates)
      const vals = await substrate.api?.query.session.validators()
      activeSet.value = vals?.toJSON() as [] || []
    })

    return {
      chainId,
      list,
      decimals,
      candidates,
      activeSet,
      count,
      multiplier,
      stake,
      numPeriods,
      activity,
      selected,
      filter,
      loading,
      interval,
      filteredList,
      isActive,
      valIs1kv,
      reload,
      calcActivity,
      calcNominations
    }
  },
  methods: {
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
    getChipColor (noms: number) {
      if (noms >= 256) {
        return 'red'
      } else if (noms >= 200) {
        return 'warning'
      } else {
        return 'success'
      }
    }
  }
})
</script>
