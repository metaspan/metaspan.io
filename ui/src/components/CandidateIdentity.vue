<template>
  <v-card height="100%" elevation="1" :loading="loading">
    <v-card-title>Identity</v-card-title>
    <v-card-text>
      <table width="100%">
        <!-- <tr><td>name</td><td class="text-right">{{candidate.identity.name}}</td></tr> -->
        <tr><td>display</td><td class="text-right">{{candidate.identity.name}}</td></tr>
        <tr><td>verified</td><td class="text-right">{{candidate.identity.verified}} ({{judgements.length}})</td></tr>
        <tr v-show="info.email"><td>email</td><td class="text-right">
          <a :href="`mailto:${info.email}`">{{info.email}}</a>
        </td></tr>
        <tr v-show="info.legal"><td>legal</td><td class="text-right">{{info.legal}}</td></tr>
        <tr v-show="info.riot"><td>riot</td><td class="text-right">
          <a :href="`https://matrix.to/#/${info.riot}`" target="_blank">{{info.riot}}</a>
        </td></tr>
        <tr v-show="info.twitter"><td>twitter</td><td class="text-right">
          <a :href="`https://twitter.com/${info.twitter}`" target="_blank">{{info.twitter}}</a>
        </td></tr>
        <tr v-show="info.web"><td>web</td><td class="text-right">{{info.web}}</td></tr>
      </table>
      <!-- {{info}} -->
    </v-card-text>
    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Loading from '@/components/Loading.vue'
import { mapState, mapGetters } from 'vuex'
import { hexToString } from '@polkadot/util'

export default Vue.extend({
  name: 'CandidateIdentity',
  components: {
    Loading
  },
  // props: {
  //   chain: {
  //     type: String,
  //     required: true
  //   }
  // },
  computed: {
    ...mapState(['chain']),
    ...mapGetters('candidate', ['candidate'])
  },
  data () {
    return {
      loading: true,
      deposit: 0,
      judgements: [],
      info: {
        display: '',
        email: '',
        legal: '',
        riot: '',
        twitter: '',
        web: ''
      }
    }
  },
  async created () {
    console.debug(`CandidateIdentity.vue created(): chain=${this.chain}`)
    if (!this.$substrate[this.chain]) {
      await this.$substrate.connect(this.chain)
    }
    await this.$substrate[this.chain].isReady
    let count = 0
    const int = setInterval(async () => {
      count++
      if (this.$substrate[this.chain]) {
        // console.debug('CandidateIdentity', this.$store.state.candidate.candidate.identity)
        // const superOf = await this.$substrate.polkadot.api.query.identity.superOf(this.candidate.stash)
        // console.debug('superOf', superOf)
        // const subsOf = await this.$substrate.polkadot.api.query.identity.subsOf(this.candidate.stash)
        // console.debug('subsOf', subsOf)

        // const ex = {
        //   "judgements":[[0,{"reasonable":null}]],
        //   "deposit":33333333000,
        //   "info":{
        //     "additional":[],
        //     "display":{"raw":"0x6d6574617370616e2d6b736d"},
        //     "legal":{"none":null},
        //     "web":{"none":null},
        //     "riot":{"none":null},
        //     "email":{"raw":"0x646572656b406d6574617370616e2e636f6d"},
        //     "pgpFingerprint":null,
        //     "image":{"none":null},
        //     "twitter":{"raw":"0x406d6574617370616e5f696f"}
        //   }
        // }
        try {
          const id = await this.$substrate[this.chain].query.identity.identityOf(this.candidate.stash)
          console.debug('id', id)
          const idj = id.toJSON()
          console.debug('idj', idj)
          if (idj) {
            this.deposit = idj.deposit
            this.info = {
              // additional...
              display: idj.info.display.raw ? hexToString(idj.info.display.raw) : '',
              email: idj.info.email.raw ? hexToString(idj.info.email.raw) : '',
              // image...
              legal: idj.info.legal.raw ? hexToString(idj.info.legal.raw) : '',
              riot: idj.info.riot.raw ? hexToString(idj.info.riot.raw) : '',
              twitter: idj.info.twitter.raw ? hexToString(idj.info.twitter.raw) : '',
              web: idj.info.web.raw ? hexToString(idj.info.web.raw) : ''
            }
            this.judgements = idj.judgements
          }
          this.loading = false
          clearInterval(int)
        } catch (err) {
          console.debug('CandidnateIdentity.vue: OOPs')
          console.error(err)
        }
      } else {
        console.debug('not connected?', this.chain)
      }
      if (count > 10) {
        console.debug('CandidateIdentity.vue: no api found, clearing interval...')
        this.loading = false
        clearInterval(int)
      }
    }, 1000)
  }
})
</script>
