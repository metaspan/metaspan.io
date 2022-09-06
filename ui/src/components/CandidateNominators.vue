<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title>Nominators ({{chain}})</v-toolbar-title>
    </v-toolbar>
    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
// import { ICandidate } from '../types/global'
import Loading from './Loading.vue'

export default Vue.extend({
  props: {
    stash: {
      type: String,
      required: true
    }
  },
  components: {
    Loading
  },
  computed: {
    ...mapState(['chain'])
  },
  data () {
    return {
      loading: false
    }
  },
  async mounted () {
    console.debug('CandidateNominators.vue: mounted()')
    // this.loading = true
    // api.query.staking.nominators
    // const stash = 'Ew5NJucSyE17T4QYBhjbm1WYrGk2oULTHyjiJacLbCNfc4Q'
    var i = 0
    const interval = setInterval(async () => {
      i++
      try {
        if (this.$substrate[this.chain]) {
          const stash = '12WPkGHWYhL7Vdtwqbjo7ugbaoajr8KLMChnE3puX4Q5Cxsf'
          const noms = await this.$substrate[this.chain].query.staking.nominators(stash)
          const vals = await this.$substrate[this.chain].query.staking.validators(stash)

          console.debug('noms', noms.toJSON(), 'vals', vals.toJSON())
          clearInterval(interval)
        }
      } catch (err) {
        console.warn(err)
        // attempt reconnect
        await this.$substrate[this.chain].connect()
      }

      if (i > 10) {
        console.warn('CandidateNominators.vue: no API found')
        clearInterval(interval)
      }
    }, 1000)
  }
})
</script>
