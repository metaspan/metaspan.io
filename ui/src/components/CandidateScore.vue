<template>

  <div class="d-none d-sm-block">

    <v-card tile elevation="1" width="100%">
      <v-card-title>
        <span class="text-h5">Score: {{candidate.score.total.toFixed(3)}}</span>
      </v-card-title>
    </v-card>

    <v-simple-table dense>
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
            <td class="text-right">{{getScore(candidate.score.spanInclusion)}} <small>/{{denoms['spanInclusion']}}</small></td>
          </tr>
          <tr><th>84-Era Inclusion</th>
            <td>-<!--0.00%-86.90%--></td>
            <td>-</td>
            <td class="text-right">{{getScore(candidate.score.inclusion)}} <small>/{{denoms['inclusion']}}</small></td>
          </tr>
          <tr><th>First Discovered</th>
            <td>-<!--Aug 01, 2020 - Mar 15, 2022--></td>
            <td>{{formatDate(candidate.discoveredAt, dateFormat)}}</td>
            <td class="text-right">{{getScore(candidate.score.discovered)}} <small>/{{denoms['discovered']}}</small></td>
          </tr>
          <tr><th>Last Nominated</th>
            <td>{{ dateSpan('37', 'days', dateFormat) }}</td>
            <td>{{formatDate(candidate.discoveredAt, dateFormat)}}</td>
            <td class="text-right">{{getScore(candidate.score.nominated)}} <small>/{{denoms['nominated']}}</small></td>
          </tr>
          <tr><th>Rank</th>
            <td>{{ranges.rank.min}} - {{ranges.rank.max}}</td>
            <td>{{candidate.rank}}</td>
            <td class="text-right">{{getScore(candidate.score.rank)}} <small>/{{denoms['rank']}}</small></td>
          </tr>
          <tr><th>Self Bonded</th>
            <td>-<!--10.02 - 98.16 KSM--></td>
            <td>-</td>
            <td class="text-right">{{getScore(candidate.score.bonded)}} <small>/{{denoms['bonded']}}</small></td>
          </tr>
          <tr><th>Faults</th>
            <td>0 - 7</td>
            <td>-</td>
            <td class="text-right">{{getScore(candidate.score.faults)}} <small>/{{denoms['faults']}}</small></td>
          </tr>
          <tr><th>Offline</th>
            <td>0 - 0</td>
            <td>-</td>
            <td class="text-right">{{getScore(candidate.score.offline)}} <small>/{{denoms['offline']}}</small></td>
          </tr>
          <tr><th>Node Location</th>
            <td>N/A</td>
            <td>{{candidate.location}}</td>
            <td class="text-right">{{getScore(candidate.score.location)}} <small>/{{denoms['location']}}</small></td>
          </tr>
          <tr><th>Council Stake</th>
            <td>N/A</td>
            <td>{{candidate.councilStake}}</td>
            <td class="text-right">{{getScore(candidate.score.councilStake)}} <small>/{{denoms['councilStake']}}</small></td>
          </tr>
          <tr><th>Democracy</th>
            <td>N/A</td>
            <td>{{candidate.democracyVoteCount}} Votes</td>
            <td class="text-right">{{getScore(candidate.score.democracy)}}</td>
          </tr>
          <tr><th>Unclaimed Eras</th>
            <td>N/A</td>
            <td>{{candidate.unclaimedEras ? candidate.unclaimedEras.length : 0}}</td>
            <td class="text-right">{{getScore(candidate.score.unclaimed)}}</td>
          </tr>
          <tr><th>Aggregate</th>
            <td></td>
            <td></td>
            <td class="text-right">{{getScore(candidate.score.aggregate)}}</td>
          </tr>
          <tr><th>Randomness</th>
            <td></td>
            <td></td>
            <td class="text-right">{{getScore(candidate.score.randomness)}}%</td>
          </tr>
          <tr><th>Total</th>
            <td></td>
            <td>
              <!-- <v-slider readonly v-model="candidate.score.total" :min="ranges.score.min" :max="ranges.score.max"></v-slider> -->
              <v-progress-linear :value="candidate.score.total/ranges.score.max*100"></v-progress-linear>
            </td>
            <td class="text-right">{{getScore(candidate.score.total)}}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

  </div>

</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapGetters } from 'vuex'
// import * as vbe from 'github:w3f/1k-validators-be'
// const {vbe} = require('../../node_modules/1k-validators-be/src/score.ts')
import Vue from 'vue'

export default Vue.extend({
  name: 'CandidateScore',
  props: ['candidate'],
  computed: {
    ...mapGetters('candidate', ['ranges'])
  },
  data () {
    return {
      dateFormat: 'MMM DD',
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      denoms: {
        // "_id": "62700be629cee192f7723e41",
        updated: 1652607338086,
        // "address": "HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx",
        // "total": 381.7721771213124,
        // "aggregate": 339.9612269074931,
        spanInclusion: 100,
        inclusion: 100,
        discovered: 5,
        nominated: 30,
        rank: 5,
        // "unclaimed": 0,
        bonded: 50,
        faults: 5,
        offline: 2,
        location: 40,
        councilStake: 50
        // "democracy": 96,
        // "randomness": 1.1229874082822877,
        // "__v": 0
      }
    }
  },
  methods: {
    getScore (elem: number|null|undefined) {
      return elem ? elem.toFixed(2) : 0.00
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
    }
  },
  created () {
    // if(!this.candidate.score) {
    //     console.warn('candidate has no score', this.candidate)
    //     this.candidate.score = {
    //         spanInclusion: 0,
    //         inclusion: 0,
    //         discovered: 0,
    //         nominated: 0,
    //         rank: 0,
    //         bonded: 0,
    //         faults: 0,
    //         offline: 0,
    //         location: 0,
    //         councilStake: 0,
    //         democaracy: 0,
    //         unclaimed: 0,
    //         aggregate: 0,
    //         randomness: 0,
    //         total: 0,
    //     }
    // } else {
    //     console.info(this.candidate.score)
    // }
    // this.lcandidate = this.candidate
  },

  mounted () {
    // console.debug('vbe', vbe)
  }

})
</script>
