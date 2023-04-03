<template>

  <div class="d-block d-sm-none">
    <v-card tile elevation="1" width="100%">
      <v-card-title>
        <span class="text-h5">Score: {{model.score?.total?.toFixed(3) | 0.00}}</span>
      </v-card-title>
    </v-card>

    <v-list>
      <v-list-item>
        <!-- Headers...? -->
        <v-progress-linear :value="(model.score?.total | 0)/ranges.score.max*100"></v-progress-linear>

      </v-list-item>

      <v-list-item v-for="item in Object.keys(fields)" v-bind:key="item">
        <!-- <v-list-item-content> -->
          <v-list-item-title>
            <v-row>
              <v-col>{{fields[item].title}}</v-col>
              <v-col class="text-right">{{getScore(item)}} <small v-show="denoms[item]">/{{denoms[item]}}</small></v-col>
            </v-row>
          </v-list-item-title>
        <!-- </v-list-item-content> -->
      </v-list-item>
    </v-list>

  </div>

</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import moment from 'moment'
import { useStore } from 'vuex'
// import * as vbe from 'github:w3f/1k-validators-be'
// const {vbe} = require('../../node_modules/1k-validators-be/src/score.ts')
import { ICandidate } from '@/types/global'

export default defineComponent({
  name: 'CandidateScoreList',
  props: ['candidate'],
  setup (props) {
    const store = useStore()
    const ranges = computed(() => store.getters['candidate/ranges'])
    const model = ref(props.candidate)
    watch(() => props.candidate, (newVal) => {
      model.value = newVal
    })
    return {
      ranges,
      model
    }
  },
  data () {
    return {
      dateFormat: 'MMM DD',
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      fields: {
        spanInclusion: { title: 'Span Inclusion' },
        inclusion: { title: 'Inclusion' },
        discovered: { title: 'Discovered' },
        nominated: { title: 'Nominated' },
        rank: { title: 'Rank' },
        unclaimed: { title: 'Unclaimed Eras' },
        bonded: { title: 'Self bonded' },
        faults: { title: 'Faults' },
        offline: { title: 'Offline' },
        location: { title: 'Location' },
        region: { title: 'Region' },
        country: { title: 'Country' },
        provider: { title: 'Provider' },
        councilStake: { title: 'Council Stake' },
        democracy: { title: 'Democracy' },
        nominatorStake: { title: 'Nominator Stake' },
        delegations: { title: 'Delegations' },
        openGov: { title: 'OpenGov' },
        openGovDelegations: { title: 'OpenGov Delegations' },
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
    getScore (key: string) {
      if (this.candidate.score && this.candidate.score[key]) {
        return this.candidate.score[key].toFixed(2)
      } else {
        return 0.00
      }
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
