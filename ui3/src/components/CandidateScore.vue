<template>

  <div class="d-none d-sm-block">

    <v-card tile elevation="1" width="100%">
      <v-card-title>
        <span class="text-h5">Score: {{model.score?.total.toFixed(3)}} <small>(Updated: {{timeAgo(model.score?.updated)}})</small></span>
      </v-card-title>
    </v-card>

    <v-table density="compact">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Component</th>
            <th>Scorable Range</th>
            <th>This Validator</th>
            <th class="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr><th>28-Era Inclusion</th>
            <td>-<!--0.00%-85.71%--></td>
            <td>-</td>
            <td class="text-right">{{getScore('spanInclusion')}} <small>/{{denoms['spanInclusion']}}</small></td>
          </tr>
          <tr><th>84-Era Inclusion</th>
            <td>-<!--0.00%-86.90%--></td>
            <td>-</td>
            <td class="text-right">{{getScore('inclusion')}} <small>/{{denoms['inclusion']}}</small></td>
          </tr>
          <tr><th>First Discovered</th>
            <td>-<!--Aug 01, 2020 - Mar 15, 2022--></td>
            <td>{{formatDate(model.discoveredAt, dateFormat)}}</td>
            <td class="text-right">{{getScore('discovered')}} <small>/{{denoms['discovered']}}</small></td>
          </tr>
          <tr><th>Last Nominated</th>
            <td>n/a</td>
            <td>{{formatDate(model.nominatedAt, dateFormat)}}</td>
            <td class="text-right">{{getScore('nominated')}} <small>/{{denoms['nominated']}}</small></td>
          </tr>
          <tr><th>Rank</th>
            <td>{{ranges.rank.min}} - {{ranges.rank.max}}</td>
            <td>{{model.rank}}</td>
            <td class="text-right">{{getScore('rank')}} <small>/{{denoms['rank']}}</small></td>
          </tr>
          <tr><th>Unclaimed Eras</th>
            <td>n/a</td>
            <td>{{model.unclaimedEras ? model.unclaimedEras.length : 0}}</td>
            <td class="text-right">{{getScore('unclaimed')}}</td>
          </tr>
          <tr><th>Self Bonded</th>
            <td>-<!--10.02 - 98.16 KSM--></td>
            <td>-</td>
            <td class="text-right">{{getScore('bonded')}} <small>/{{denoms['bonded']}}</small></td>
          </tr>
          <tr><th>Faults</th>
            <td>0 - 7</td>
            <td>-</td>
            <td class="text-right">{{getScore('faults')}} <small>/{{denoms['faults']}}</small></td>
          </tr>
          <tr><th>Offline</th>
            <td>0 - 0</td>
            <td>-</td>
            <td class="text-right">{{getScore('offline')}} <small>/{{denoms['offline']}}</small></td>
          </tr>
          <tr><th>Node Location</th>
            <td>n/a</td>
            <td>{{model.location}}</td>
            <td class="text-right">{{getScore('location')}} <small>/{{denoms['location']}}</small></td>
          </tr>
          <tr><th>Region</th>
            <td>n/a</td>
            <td>{{model.region}}</td>
            <td class="text-right">{{getScore('region')}} <small>/{{denoms['region']}}</small></td>
          </tr>
          <tr><th>Country</th>
            <td>n/a</td>
            <td>{{model.country}}</td>
            <td class="text-right">{{getScore('country')}} <small>/{{denoms['country']}}</small></td>
          </tr>
          <!--
          <tr><th>ASN</th>
            <td>n/a</td>
            <td>{{model.asn}}</td>
            <td class="text-right">{{getScore(model.score.asn)}} <small>/{{denoms['asn']}}</small></td>
          </tr>
          -->
          <tr><th>Provider</th>
            <td>n/a</td>
            <td>{{model.provider}}</td>
            <td class="text-right">{{getScore('provider')}} <small>/{{denoms['provider']}}</small></td>
          </tr>
          <tr><th>Council Stake</th>
            <td>n/a</td>
            <td>{{model.councilStake}}</td>
            <td class="text-right">{{getScore('councilStake')}} <small>/{{denoms['councilStake']}}</small></td>
          </tr>
          <tr><th>Democracy</th>
            <td>n/a</td>
            <td>{{model.democracyVoteCount}} Votes</td>
            <td class="text-right">{{getScore('democracy')}} <small>/{{denoms['democracy']}}</small></td>
          </tr>
          <tr><th>Nominations</th>
            <td>n/a</td>
            <td>{{model.nominations}}</td>
            <td class="text-right">{{getScore('nominatorStake')}} <small>/{{denoms['nominatorStake']}}</small></td>
          </tr>
          <tr><th>Delegations</th>
            <td>-</td>
            <td>-</td>
            <td class="text-right">{{getScore('delegations')}} <small>/{{denoms['delegations']}}</small></td>
          </tr>
          <tr><th>Open Gov</th>
            <td>-</td>
            <td>-</td>
            <td class="text-right">{{getScore('openGov')}} <small>/{{denoms['openGov']}}</small></td>
          </tr>
          <tr><th>Open Gov Delegations</th>
            <td>-</td>
            <td>-</td>
            <td class="text-right">{{getScore('openGovDelegations')}} <small>/{{denoms['openGovDelegations']}}</small></td>
          </tr>

          <tr><th>Aggregate</th>
            <td></td>
            <td></td>
            <td class="text-right">{{getScore('aggregate')}}</td>
          </tr>
          <tr><th>Randomness</th>
            <td></td>
            <td></td>
            <td class="text-right">{{getScore('randomness')}}%</td>
          </tr>
          <tr><th>Total</th>
            <td></td>
            <td>
              <!-- <v-slider readonly v-model="model.score.total" :min="ranges.score.min" :max="ranges.score.max"></v-slider> -->
              <v-progress-linear :value="model.score.total/ranges.score.max*100"></v-progress-linear>
            </td>
            <td class="text-right">{{getScore('total')}}</td>
          </tr>
        </tbody>
      </template>
    </v-table>

  </div>

</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from 'vue'
import moment from 'moment'
import { useStore } from 'vuex'
// import * as vbe from 'github:w3f/1k-validators-be'
// const {vbe} = require('../../node_modules/1k-validators-be/src/score.ts')

// const example = {
//   "score":{
//     // "_id":"614a1a23fbb2e800131adc1c",
//     // "address":"1LUckyocmz9YzeQZHVpBvYYRGXb3rnSm2tvfz79h3G3JDgP",
//     // "updated":1666088833460,
//     // "total":403.00090180980516,
//     // "aggregate":364.999133737423,
//     "asn":0,
//     "bonded":31.771943528081604,
//     "councilStake":37.5,
//     "country":16.99115044247784,
//     "delegations":0,
//     "democracy":100,
//     "discovered":2.8900386845507606,
//     "faults":5,
//     "inclusion":46.66666666666666,
//     "location":40,
//     "nominated":4.289516582908357,
//     "nominatorStake":80.20268409290995,
//     "offline":2,
//     "provider":0,
//     "randomness":1.104114680172694,
//     "rank":14.678284182305624,
//     "region":5.517241379310329,

//     "spanInclusion":0,
//     "unclaimed":0,
//     // "__v":0
//   },
//   "total":403.00090180980516
// }
import { ICandidate } from '../types/global'

export default defineComponent({
  name: 'CandidateScore',
  props: {
    candidate: {
      type: Object as PropType<ICandidate>, 
      default: { score: {
      total: 0
    } } },
  },
  setup (props) {
    const { candidate } = props
    const store = useStore()
    const model = ref(candidate)
    console.debug('CandidateScore.vue: model', model.value)
    const ranges = computed(() => store.getters['candidate/ranges'])
    watch(() => candidate, (newVal) => {
      console.debug('CandidateScore.vue: watch(candidate)', newVal)
      model.value = newVal
    }, { immediate: true })
    return {
      model,
      ranges
    }
  },
  data () {
    return {
      dateFormat: 'DD MMM YY',
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      denoms: {
        // https://raw.githubusercontent.com/w3f/1k-validators-be/master/packages/core/config/kusama.sample.json
        // https://raw.githubusercontent.com/w3f/1k-validators-be/master/packages/core/config/main.sample.json
        // https://github.com/w3f/1k-validators-be/blob/master/helmfile.d/config/kusama/otv-backend-prod.yaml.gotmpl#L59
        // https://github.com/w3f/1k-validators-be/blob/master/helmfile.d/config/polkadot/otv-backend-prod.yaml.gotmpl#58
        inclusion: 160,
        spanInclusion: 200,
        discovered: 5,
        nominatorStake: 30, // key: nominated
        rank: 5,
        bonded: 50,
        faults: 5,
        offline: 2,
        location: 40,
        region: 10,
        country: 10,
        provider: 100,
        councilStake: 50, // key: council
        democracy: 100,
        nominations: 100,
        delegations: 60,
        openGov: 100,
        openGovDelegations: 100
      }
    }
  },
  methods: {
    getScore (key: string) {
      if (this.candidate.score && this.candidate.score[key]) {
        return this.candidate.score[key].toFixed(2)
      } else {
        return 0.00
      }
    },
    formatDate (v: number|string, format: string) {
      // console.debug(v, this.dateTimeFormat)
      const f = format || this.dateTimeFormat
      return moment(v).format(f)
    },
    dateSpan (span = '5', unit = 'weeks', format = 'YY/MM/DD') {
      const start = moment().add(-span as moment.DurationInputArg1, unit as moment.DurationInputArg2).format(format)
      const end = moment().add(-1, 'days').format(format)
      return `${start} - ${end}`
    },
    timeAgo (timestamp: number) {
      return moment(timestamp).fromNow()
    }
  },
  mounted () {
    // console.debug('vbe', vbe)
    console.debug(this.candidate?.score)
  }
})
</script>
