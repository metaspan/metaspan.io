<template>

  <v-card>
    <v-toolbar flat>
      <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-toolbar-title>Pool</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <v-card-title>Pools</v-card-title> -->
    <v-card-text>
      {{pool}}
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IPool } from '../types/global'

export default Vue.extend({
  props: {
    // chain: {
    //   type: String,
    //   required: false
    // },
    id: {
      type: Number,
      required: false
    }
  },
  computed: {
    ...mapState(['chain']),
    ...mapState('pool', ['pool'])
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    toKSM (v: number): number {
      return v / 1000000000000
    },
    reload () {
      this.loading = true
      this.loadPools()
    },
    async loadPools () {
      var h = 0
      const int = setInterval(async () => {
        h++
        try {
          const api = this.$substrate.kusama
          var t: any, x: any
          x = await api.query.nominationPools.lastPoolId()
          // console.log('lastPool', x.toNumber())
          var i = 1
          while (i <= x.toNumber()) {
            t = await api.query.nominationPools.bondedPools(i)
            var j = t.toJSON()
            j.id = i
            // console.log(`bondedPools(${i})`, j)
            console.log('roles', Object.keys(j.roles))
            await this.$store.dispatch('pool/addPool', j)
            i++
          }
          // const metadata = await this.$substrate.kusama.query.nominationPools.metadata(50)
          // console.log('metadata', metadata.toString())

          // t = await api.query.nominationPools.counterForBondedPools()
          // console.log('counterForBondedPools', t.toJSON())
          clearInterval(int)
          console.debug('loading done...')
          this.loading = false
        } catch (err) {
          console.debug(err)
          this.loading = false
        }

        if (h > 10) {
          console.debug('not API avail. after 10 seconds')
          this.loading = false
          clearInterval(int)
        }
      }, 20 * 1000) // 20 seconds
    }
  },
  async created () {
    console.debug('Pool.vue created()', this.chain, this.pool, this.$route.params)
    if (!this.pool || this.pool.id !== parseInt(this.$route.params.id)) {
      console.debug('ID not same, loading id')
      console.debug('params.id', typeof parseInt(this.$route.params.id))
      console.debug('pool.id', typeof this.pool?.id)
      this.$store.dispatch('pool/setPool', { id: parseInt(this.$route.params.id) })
    }
    // // get identities
    // var ids = await Promise.all(promises)
    // console.debug(ids)
    // ids = ids.map((m, idx) => {
    //   const pool = pools[idx]
    //   const idj = m.toJSON()
    //   console.debug(idx, 'idj', idj)
    //   if (idj) {
    //     pool.identity = idj
    //     pool.name = idj.info.display.raw ? hexToString(idj.info.display.raw) : ''
    //   }
    //   console.debug(pool)
    //   return pool
    // })
    // await this.$store.dispatch('pool/setIds', ids)
  }
})
</script>
