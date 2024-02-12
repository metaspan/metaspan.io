<template>
  <v-container fluid>
    <v-card-title>
    <v-toolbar title="Validity" color="transparent" density="compact">
      <v-spacer></v-spacer>
      <v-btn @click="showJson()">
        <v-icon>mdi-code-json</v-icon>&nbsp;Live data
      </v-btn>
    </v-toolbar>
    </v-card-title>
    <v-row justify="center">
      <!-- <v-col class="cicon" align="center" v-for="item in candidate?.validity" v-bind:key="item._id">
        {{getText(item.type)}}<br><v-icon :color="item.valid?'green':'red'">mdi-{{ item.valid?'check-circle':'close-circle' }}</v-icon>
      </v-col> -->
      <v-btn variant="outlined" v-for="item in candidate?.validity" v-bind:key="item._id" :color="item.valid?'success':'error'">
        {{getText(item.type)}}<br><v-icon :color="item.valid?'green':'red'">mdi-{{ item.valid?'check-circle':'close-circle' }}</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed, ref } from 'vue'
import moment from 'moment'
import { type ICandidate } from '../types/global'

export default defineComponent({
  // name: 'CandidateValidity',
  props: {
    candidate: {
      // type: undefined
      type: Object as PropType<ICandidate>, 
    }
  },
  setup(props) {
    const store = useStore()
    const chainId = computed(() => store.chainId)
    const dateTimeFormat = ref('YYYY/MM/DD hh:mm')
    const texts = ref<Record<string, string>>( {
      ACCUMULATED_OFFLINE_TIME: 'On/Offline',
      BEEFY: 'Beefy',
      BLOCKED: 'Blocked',
      CLIENT_UPGRADE: 'Upgrade',
      COMMISION: 'Commission',
      CONNECTION_TIME: 'Connection',
      IDENTITY: 'Identity',
      KUSAMA_RANK: 'Kusama Rank',
      ONLINE: 'Online',
      PROVIDER: 'Provider',
      REWARD_DESTINATION: 'Reward Destination',
      SELF_STAKE: 'Self stake',
      UNCLAIMED_REWARDS: 'Unclaimed',
      VALIDATE_INTENTION: 'Intention'
    })

    const formatDate = (v: any, format: string): string => {
      // console.debug(v, this.dateTimeFormat)
      const f = format || dateTimeFormat.value
      return moment(v).format(f)
    }
    const dateSpan = (span = 5, unit = 'weeks', format = 'YY/MM/DD'): string => {
      const start = moment().add(-span as moment.DurationInputArg1, unit as moment.DurationInputArg2).format(format)
      const end = moment().add(-1, 'days').format(format)
      return `${start} - ${end}`
    }
    const getText = (t: string): string => {
      // console.debug('getText', t)
      // eslint-disable-next-line
      const text: any = texts.value
      return texts.value[t] || '**Undefined'
    }
    const showJson = () => {
      const url = `https://${chainId.value}.w3f.community/candidate/${props.candidate?.stash}`
      console.debug('URL', url)
      window.open(url)?.focus()
    }

    return {
      texts,
      formatDate,
      dateSpan,
      getText,
      showJson
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
