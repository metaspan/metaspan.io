<template>
  <v-card height="100%" elevation="1">
    <v-card-title>Identity</v-card-title>
    <v-card-text>
      <!-- [{{ info }}] -->
      <table width="100%">
        <!-- <tr><td>name</td><td class="text-right">{{model.identity.name}}</td></tr> -->
        <tr><td>display</td><td class="text-right">{{info?.display}}</td></tr>
        <tr><td>verified</td><td class="text-right">{{model.identity?.verified}} ({{judgements?.join(', ')}})</td></tr>
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
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject, watch, PropType } from 'vue'
import Loading from '@/components/Loading.vue'
import { useStore } from 'vuex'
import { hexToString } from '@polkadot/util'
import { SubstrateAPI } from '@/plugins/substrate'
import { ICandidate, IIdentity } from '../types/global'

export default defineComponent({
  name: 'CandidateIdentity',
  components: {
    Loading
  },
  props: {
    candidate: {
      type: Object as PropType<ICandidate>, 
      default: { identity: { judgements: [], info: {} } }
    }
  },
  setup (props) {
    const store = useStore()
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    const chainId = computed(() => store.state.chainId)
    // const candidate = computed(() => store.getters['candidate/candidate'])
    // const candidate = props.candidate
    const model = ref(props.candidate)
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
      console.debug('parseIdentity:', model.value)
      if (!model.value) return false
      // const id = await this.substrate.api?.query.identity.identityOf(this.model.stash)
      // console.debug('id', id)
      // const idj = id.toJSON()
      const id = model.value.identity || {} as IIdentity
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

    watch(() => props.candidate, (newVal) => {
      console.debug('CandidateIdentity.vue: watch props.candidate', newVal)
      model.value = newVal
      parseIdentity()
    }, { immediate: true })

    return {
      substrate,
      chainId,
      model,
      loading,
      deposit,
      judgements,
      info
    }
  },
  // async created () {
  //   console.debug(`CandidateIdentity.vue created(): chain=${this.chainId}`)
  //   if (!this.substrate.api) {
  //     await this.substrate.connect(this.chainId)
  //   }
  //   await this.substrate.api?.isReady
  //   let count = 0
  //   const int = setInterval(async () => {
  //     count++
  //     if (this.substrate.api) {
  //       // console.debug('CandidateIdentity', this.$store.state.model.model.identity)
  //       // const superOf = await this.$substrate.polkadot.api.query.identity.superOf(this.model.stash)
  //       // console.debug('superOf', superOf)
  //       // const subsOf = await this.$substrate.polkadot.api.query.identity.subsOf(this.model.stash)
  //       // console.debug('subsOf', subsOf)

  //       // const ex = {
  //       //   "judgements":[[0,{"reasonable":null}]],
  //       //   "deposit":33333333000,
  //       //   "info":{
  //       //     "additional":[],
  //       //     "display":{"raw":"0x6d6574617370616e2d6b736d"},
  //       //     "legal":{"none":null},
  //       //     "web":{"none":null},
  //       //     "riot":{"none":null},
  //       //     "email":{"raw":"0x646572656b406d6574617370616e2e636f6d"},
  //       //     "pgpFingerprint":null,
  //       //     "image":{"none":null},
  //       //     "twitter":{"raw":"0x406d6574617370616e5f696f"}
  //       //   }
  //       // }
  //       if (await this.getIdentity()) clearInterval(int)
  //     } else {
  //       console.debug('not connected?', this.chainId)
  //     }
  //     if (count > 10) {
  //       console.debug('CandidateIdentity.vue: no api found, clearing interval...')
  //       this.loading = false
  //       clearInterval(int)
  //     }
  //   }, 1000)
  // }
})
</script>
