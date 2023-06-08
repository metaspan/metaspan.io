<template>

  <div class="d-none d-sm-block">

    <v-card tile elevation="1" width="100%">
      <v-card-title>
        <span class="text-h5">Score: {{candidate.score?.total.toFixed(3)}} <small>(Updated: {{timeAgo(candidate.score?.updated)}})</small></span>
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
            <td>{{formatDate(candidate.discoveredAt, dateFormat)}}</td>
            <td class="text-right">{{getScore('discovered')}} <small>/{{denoms['discovered']}}</small></td>
          </tr>
          <tr><th>Last Nominated</th>
            <td>n/a</td>
            <td>{{formatDate(candidate.nominatedAt, dateFormat)}}</td>
            <td class="text-right">{{getScore('nominated')}} <small>/{{denoms['nominated']}}</small></td>
          </tr>
          <tr><th>Rank</th>
            <td>{{ranges.rank.min}} - {{ranges.rank.max}}</td>
            <td>{{candidate.rank}}</td>
            <td class="text-right">{{getScore('rank')}} <small>/{{denoms['rank']}}</small></td>
          </tr>
          <tr><th>Unclaimed Eras</th>
            <td>n/a</td>
            <td>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</td>
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
            <td>{{candidate?.location}}</td>
            <td class="text-right">{{getScore('location')}} <small>/{{denoms['location']}}</small></td>
          </tr>
          <tr><th>Region</th>
            <td>n/a</td>
            <td>{{candidate.region}}</td>
            <td class="text-right">{{getScore('region')}} <small>/{{denoms['region']}}</small></td>
          </tr>
          <tr><th>Country</th>
            <td>n/a</td>
            <td>{{candidate.country}}</td>
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
            <td>{{candidate.provider}}</td>
            <td class="text-right">{{getScore('provider')}} <small>/{{denoms['provider']}}</small></td>
          </tr>
          <tr><th>Council Stake</th>
            <td>n/a</td>
            <td>{{candidate.councilStake}}</td>
            <td class="text-right">{{getScore('councilStake')}} <small>/{{denoms['councilStake']}}</small></td>
          </tr>
          <tr><th>Democracy</th>
            <td>n/a</td>
            <td>{{candidate.democracyVoteCount}} Votes</td>
            <td class="text-right">{{getScore('democracy')}} <small>/{{denoms['democracy']}}</small></td>
          </tr>
          <tr><th>Nominations</th>
            <td>n/a</td>
            <td>{{candidate.nominations}}</td>
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
              <v-progress-linear :value="(candidate.score?.total || 0)/(ranges.score?.max || 1)*100"></v-progress-linear>
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
import { ICandidate, ICandidateScore } from '../types/global'

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
    // const { candidate } = props
    const candidate = ref(props.candidate)
    const store = useStore()
    const model = ref<ICandidateScore>(candidate.value.score)
    const denoms = computed(() => store.getters['candidate/denoms'])
    console.debug('CandidateScore.vue: model', candidate, model.value)
    const ranges = computed(() => store.getters['candidate/ranges'])

    const getScore = (key: string) => {
      if (candidate.value.score && candidate.value.score[key as keyof typeof candidate.value.score]) {
        return Number(candidate.value.score[key as keyof typeof candidate.value.score] || 0).toFixed(2)
      } else {
        return 0.00
      }
    }

    watch(() => candidate.value, (newVal) => {
      console.debug('CandidateScore.vue: watch(candidate)', newVal)
      if (newVal.score) model.value = newVal.score
    }, { immediate: true })

    return {
      model,
      ranges,
      denoms,
      getScore
    }
  },
  data () {
    return {
      dateFormat: 'DD MMM YY',
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
    }
  },
  methods: {
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
