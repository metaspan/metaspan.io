<template>
  <client-only>
  <v-card height="100%" elevation="1">
    <v-card-title>Identity</v-card-title>
    <v-card-text>
      <!-- [{{ info }}] -->
      <table width="100%">
        <!-- <tr><td>name</td><td class="text-right">{{model.identity.name}}</td></tr> -->
        <tr><td>display</td><td class="text-right">{{ info?.display }}</td></tr>
        <tr><td>Judgements</td><td class="text-right">({{ judgements?.join(', ') }})</td></tr>
        <tr v-show="info?.email"><td>email</td><td class="text-right">
          <a :href="`mailto:${info?.email}`">{{info?.email}}</a>
        </td></tr>
        <tr v-show="info?.legal"><td>legal</td><td class="text-right">{{info?.legal}}</td></tr>
        <tr v-show="info?.riot"><td>riot</td><td class="text-right">
          <a :href="`https://matrix.to/#/${info?.riot}`" target="_blank">{{info?.riot}}</a>
        </td></tr>
        <tr v-show="info?.twitter"><td>twitter</td><td class="text-right">
          <a :href="`https://twitter.com/${info?.twitter}`" target="_blank">{{info?.twitter}}</a>
        </td></tr>
        <tr v-show="info?.web"><td>web</td><td class="text-right">{{info?.web}}</td></tr>
      </table>
      <!-- {{info}} -->
    </v-card-text>
    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </v-card>
  </client-only>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, type PropType } from 'vue'
import Loading from '@/components/Loading.vue'
import { hexToString } from '@polkadot/util'
import { SubstrateAPI } from '@/plugins/substrate'
import { type ICandidate, type IIdentity } from '../types/global'

export default defineComponent({
  name: 'CandidateIdentity',
  components: {
    Loading
  },
  props: {
    // stash: {
    //   type: String
    // },
    candidate: {
      type: Object as PropType<ICandidate>, 
    }
  },
  setup (props) {
    const store = useStore()
    const nuxtApp = useNuxtApp()
    const substrate = nuxtApp.$substrate as SubstrateAPI
    const chainId = computed(() => store.chainId)
    //const model = ref(props.candidate)
    // const stash = computed(() => props.stash)
    const candidate = computed(() => props.candidate)
    const identity = computed(() => props.candidate?.identity)

    const loading = ref(true)
    const deposit = ref(0)
    const judgements = ref([] as any[])
    const info = ref({
      display: '',
      email: '',
      legal: '',
      riot: '',
      twitter: '',
      web: ''
    })
    
    const parseIdentity = async () => {
      console.debug('parseIdentity:', identity.value)
      // const id = await this.substrate.api?.query.identity.identityOf(this.model.stash)
      // console.debug('id', id)
      // const idj = id.toJSON()
      const id = identity.value || {} as IIdentity
      console.debug('id', id)
      if (!id) return
      if(!id.info) {
        if (id.parentIdentity?.info) {
          info.value = {...id.parentIdentity?.info}
          info.value.display = `${id.parentIdentity?.info.display}/${id.parentIdentity?.subId}`
          judgements.value = id.parentIdentity?.judgements || []
        } 
      } else {
        info.value = id.info
        judgements.value = id.judgements || []
      }
      console.debug('info.value', info.value)
      // if (id) {
      //   this.deposit = idj.deposit
      //   this.info = {
      //     // additional...
      //     display: idj.info.display.raw ? hexToString(idj.info.display.raw) : '',
      //     email: idj.info.email.raw ? hexToString(idj.info.email.raw) : '',
      //     // image...
      //     legal: idj.info.legal.raw ? hexToString(idj.info.legal.raw) : '',
      //     riot: idj.info.riot.raw ? hexToString(idj.info.riot.raw) : '',
      //     twitter: idj.info.twitter.raw ? hexToString(idj.info.twitter.raw) : '',
      //     web: idj.info.web.raw ? hexToString(idj.info.web.raw) : ''
      //   }
      //   this.judgements = idj.judgements
      // }
      // this.loading = false
    }

    watch(() => candidate.value, (newVal) => {
      console.debug('CandidateIdentity.vue: watch props.candidate', newVal)
      // model.value = newVal
      parseIdentity()
    }, {
      // immediate: true,
      deep: true
    })

    onBeforeMount(() => {
      console.debug('CandidateIdentity: onBeforeMount()', candidate.value)
      parseIdentity()
    })

    return {
      substrate,
      chainId,
      // model,
      loading,
      deposit,
      judgements,
      info
    }
  }
})
</script>
