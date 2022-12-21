<template>

  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Pools ({{chainId}})</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <v-card-title>Pools</v-card-title> -->
    <v-card-text>
      <!-- <v-data-table
        :loading="loading"
        :items="list"
        :headers="headers"
        @click:row="gotoItem">

        <template v-slot:[`item.points`]="{ item }">
          {{ toCoin(item.points) }}
        </template>

      </v-data-table> -->
      <PoolTable class="d-none d-sm-block" :loading="loading" @clickRow="gotoItem" />
      <PoolList class="d-block d-sm-none" :loading="loading" @clickRow="gotoItem" />
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { hexToString } from '@polkadot/util'
import { IPool } from '../types/global'
import PoolTable from './PoolTable.vue'
import PoolList from './PoolList.vue'

type TF = ReturnType<typeof setInterval>

export default Vue.extend({
  name: 'Pools',
  components: {
    PoolTable,
    PoolList
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('pool', ['apiConnected']),
    ...mapGetters('pool', ['list']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo'])
  },
  data () {
    return {
      loading: false,
      interval: {} as TF
    }
  },
  watch: {
    chainId (val) {
      this.$store.dispatch('pool/setChainId', val)
      this.$ga.page(`/${val}/candidate`)
    }
  },
  methods: {
    async gotoItem (item: IPool, evt: any) {
      console.debug('gotoItem()', item, evt)
      await this.$store.dispatch('pool/setPool', item)
      this.$router.push(`/${this.chainId}/pool/${item.id}`)
    },
    async loadPools (): Promise<number> {
      console.debug('Pools.vue: searching for api', this.chainId)
      await this.$substrate[this.chainId].isReady
      if (!this.loading) {
        try {
          const api = this.$substrate[this.chainId]
          // console.debug('Pools.vue', api)
          let t: any
          const x: any = await api.query.nominationPools.lastPoolId()
          console.log('lastPool', x.toNumber())
          this.loading = true
          // let i = 1
          // while (i <= x.toNumber()) {
          //   t = await api.query.nominationPools.bondedPools(i)
          //   let j = t.toJSON()
          //   j.id = i
          //   console.log(`bondedPools(${i})`, j)
          //   await this.$store.dispatch('pool/addPool', j)
          //   i++
          // }
          let promises = [] as any[]
          for (let i = 1; i <= x.toNumber(); i++) { promises.push(api.query.nominationPools.bondedPools(i)) }
          let pools = await Promise.all(promises)
          console.debug(pools)

          promises = []
          let metas = [] as any[]
          pools = pools.map((p, idx) => {
            const t = p.toJSON() || { state: 'Closed', memberCounter: 0, roles: {} }
            // console.log('t', t)
            t.id = idx + 1
            t.name = t.roles?.depositor || 'unknown' // root
            // console.debug(idx, 'stash', t.roles.root)
            // TODO what is this for?
            // promises.push(api.query.identity.identityOf(t.roles.depositor))
            metas.push(api.query.nominationPools.metadata(t.id))
            return t
          })
          // await this.$store.dispatch('pool/setList', pools)
          // console.debug(pools)

          metas = await Promise.all(metas)
          // console.debug(metas)
          metas.forEach((m, idx) => {
            // console.debug(hexToString(m.toString()))
            // console.debug(m.toString())
            pools[idx].name = hexToString(m.toString())
          })

          await this.$store.dispatch('pool/setList', pools)
          console.debug('Pools.vue: clearing interval...')
          // clearInterval(this.interval)
          this.loading = false
        } catch (err) {
          console.debug(err)
          this.loading = false
        }
      }
      return 1
    },
    reload () {
      this.loadPools()
      // let h = 0
      // console.debug('Pools.vue: setting interval...')
      // // unset "loading" after 10 seconds...
      // this.interval = setInterval(async () => {
      //   console.log('intervalId', this.interval)
      //   h += 1
      //   // await this.loadPools()
      //   if (h > 10) {
      //     console.debug('Pools.vue: not API avail. after 10 seconds')
      //     this.loading = false
      //     // clearInterval(this.interval)
      //     this.clearAllIntervals()
      //   }
      // }, 1 * 1000)
    },
    clearAllIntervals () {
      const int = parseInt(this.interval.toString())
      for (let i = 0; i <= int; i++) {
        try {
          clearInterval(i)
        } catch (err) {
          console.debug('Interval ' + i + ' not valid')
        }
      }
    }
  },
  async created () {
    console.debug('Pools.vue created()', this.chainId, this.list?.length)
    if (!this.list || this.list.length === 0) {
      this.reload()
    }
  },
  async mounted () {
    this.$ga.page(`/${this.chainId}/pool`)
  },
  beforeDestroy () {
    if (this.interval) clearInterval(this.interval)
  }
})
</script>
