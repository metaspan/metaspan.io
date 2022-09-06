<template>
  <v-container fluid>
    <v-card-title>
      <span class="text-h6">Validity</span>
    </v-card-title>
    <v-row justify="center">
      <v-col class="cicon" align="center" v-for="item in candidate.validity" v-bind:key="item._id">
        {{getText(item.type)}}<br><v-icon :color="item.valid?'green':'red'">mdi-{{ item.valid?'check-circle':'close-circle' }}</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment-timezone'
import Vue from 'vue'
import { ICandidate } from '../types/global'

interface IProps {
  candidate: ICandidate
}

interface IData {
  dateTimeFormat: string
  // eslint-disable-next-line
  text: any
}

interface IMethods {
  // eslint-disable-next-line
  formatDate(v: any, format: string): string
  dateSpan(span: number, unit: string, format: string): string
  getText(t: string): string
}

// eslint-disable-next-line
interface IComputed {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  // name: 'CandidateValidity',
  computed: {},
  props: {
    candidate: {
      type: undefined
    }
  },
  data (): IData {
    return {
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      text: {
        ACCUMULATED_OFFLINE_TIME: 'On/Offline',
        BLOCKED: 'Blocked',
        CLIENT_UPGRADE: 'Upgrade',
        COMMISION: 'Commission',
        CONNECTION_TIME: 'Connection',
        IDENTITY: 'Identity',
        KUSAMA_RANK: 'Kusama Rank',
        ONLINE: 'Online',
        REWARD_DESTINATION: 'Reward Destination',
        SELF_STAKE: 'Self stake',
        UNCLAIMED_REWARDS: 'Unclaimed',
        VALIDATE_INTENTION: 'Intention'
      }
    }
  },
  methods: {
    // eslint-disable-next-line
    formatDate (v: any, format: string): string {
      // console.debug(v, this.dateTimeFormat)
      const f = format || this.dateTimeFormat
      return moment(v).format(f)
    },
    dateSpan (span = 5, unit = 'weeks', format = 'YY/MM/DD'): string {
      const start = moment().add(-span as moment.DurationInputArg1, unit as moment.DurationInputArg2).format(format)
      const end = moment().add(-1, 'days').format(format)
      return `${start} - ${end}`
    },
    getText (t: string): string {
      // console.debug('getText', t)
      // eslint-disable-next-line
      const text: any = this.text
      return text[t] || '**Undefined'
    }
  }
})
</script>

<style>
.cicon {
  font-size: 12px;
  margin: 1px;
  /* padding: 2px; */
  min-height: 50px;
  min-width: 90px;
  border: 1px solid lightgrey;
  border-radius: 5px;
}
</style>
