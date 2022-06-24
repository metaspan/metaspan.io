<template>

  <div class="d-block d-sm-none">
    <v-card tile elevation="1" width="100%">
      <v-card-title>
        <span class="text-h5">Score: {{candidate.score.total.toFixed(3)}}</span>
      </v-card-title>
    </v-card>

    <v-list>
      <v-list-item>
        <!-- Headers...? -->
        <v-progress-linear :value="candidate.score.total/ranges.score.max*100"></v-progress-linear>

      </v-list-item>

      <v-list-item v-for="item in Object.keys(fields)" v-bind:key="item">
        <v-list-item-content>
          <v-list-item-title>
            <v-row>
              <v-col>{{fields[item].title}}</v-col>
              <v-col class="text-right">{{getScore(candidate.score[item])}} <small v-show="denoms[item]">/{{denoms[item]}}</small></v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </div>

</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
// import * as vbe from 'github:w3f/1k-validators-be'
// const {vbe} = require('../../node_modules/1k-validators-be/src/score.ts')
import Vue from 'vue'
import { ICandidate } from '@/types/global'

interface IField {
  title: string
}

// eslint-disable-next-line
interface IData {
  dateFormat: string
  dateTimeFormat: string
  fields: Record<string, IField>
  denoms: Record<string, number>
}
// eslint-disable-next-line
interface IMethods {}

interface IComputed {
  candidate: ICandidate
  // eslint-disable-next-line
  ranges: any[]
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'CandidateScoreList',
  // props: ['candidate'],
  computed: {
    ...mapState('candidate', ['candidate', 'ranges'])
  },
  data () {
    return {
      dateFormat: 'MMM DD',
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      fields: {
        inclusion: { title: 'Inclusion' },
        spanInclusion: { title: 'Span Inclusion' },
        discovered: { title: 'Discovered' },
        nominated: { title: 'Nominated' },
        rank: { title: 'Rank' },
        bonded: { title: 'Self bonded' },
        faults: { title: 'Faults' },
        offline: { title: 'Offline' },
        location: { title: 'Location' },
        councilStake: { title: 'Council Stake' },
        democracy: { title: 'Democracy' },
        unclaimed: { title: 'Unclaimed Eras' },
        aggregate: { title: 'Aggregate' },
        randomness: { title: 'Randomness' },
        total: { title: 'Total' }
      },
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
    getTitle (key: string) {
      return this.fields[key].title
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
  }
})
</script>
