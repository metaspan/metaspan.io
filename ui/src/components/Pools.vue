<template>

  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Pools {{chain}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- <v-btn small icon> -->
        <v-icon :color="apiConnected ? 'primary' : ''">mdi-api{{apiConnected ? '' : '-off'}}</v-icon>
        <!-- </v-btn> -->
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <v-card-title>Pools</v-card-title> -->
    <v-card-text>
      <v-data-table
        :loading="loading"
        :items="list"
        :headers="headers"
        @click:row="gotoItem">

        <template v-slot:[`item.points`]="{ item }">
          {{ toKSM(item.points) }}
        </template>

      </v-data-table>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { hexToString } from '@polkadot/util'
import { IPool } from '../types/global'

type TF = ReturnType<typeof setInterval>

export default Vue.extend({
  name: 'Pools',
  computed: {
    ...mapState(['chain']),
    ...mapState('pool', ['apiConnected']),
    ...mapGetters('pool', ['list'])
  },
  data () {
    return {
      loading: false,
      headers: [
        { text: 'id', value: 'id' },
        { text: 'name', value: 'name' },
        { text: 'state', value: 'state' },
        { text: 'memberCounter', value: 'memberCounter' },
        { text: 'points', value: 'points', align: 'right' }
      ],
      interval: {} as TF
    }
  },
  methods: {
    toKSM (v: number): number {
      return v / 1000000000000
    },
    async gotoItem (item: IPool, evt: any) {
      console.debug('gotoItem()', item, evt)
      await this.$store.dispatch('pool/setPool', item)
      this.$router.push(`/${this.chain}/pool/${item.id}`)
    },
    async loadPools (): Promise<number> {
      console.debug('Pools.vue: searching for api', this.chain)
      await this.$substrate[this.chain].isReady
      if (!this.loading) {
        try {
          const api = this.$substrate[this.chain]
          // console.debug('Pools.vue', api)
          var t: any, x: any
          x = await api.query.nominationPools.lastPoolId()
          console.log('lastPool', x.toNumber())
          this.loading = true
          // var i = 1
          // while (i <= x.toNumber()) {
          //   t = await api.query.nominationPools.bondedPools(i)
          //   var j = t.toJSON()
          //   j.id = i
          //   console.log(`bondedPools(${i})`, j)
          //   await this.$store.dispatch('pool/addPool', j)
          //   i++
          // }
          var promises = [] as any[]
          for (var i = 1; i <= x.toNumber(); i++) { promises.push(api.query.nominationPools.bondedPools(i)) }
          var pools = await Promise.all(promises)
          // console.debug(pools)

          promises = []
          var metas = [] as any[]
          pools = pools.map((p, idx) => {
            var t = p.toJSON()
            t.id = idx + 1
            t.name = t.roles.depositor // root
            // console.debug(idx, 'stash', t.roles.root)
            promises.push(api.query.identity.identityOf(t.roles.depositor))
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
          clearInterval(this.interval)
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
      var h = 0
      console.debug('Pools.vue: setting interval...')
      this.interval = setInterval(async () => {
        h += await this.loadPools()
        if (h > 10) {
          console.debug('Pools.vue: not API avail. after 10 seconds')
          this.loading = false
          clearInterval(this.interval)
        }
      }, 10 * 1000)
    }
  },
  async created () {
    console.debug('Pools.vue created()', this.chain, this.list?.length)
    if (!this.list || this.list.length === 0) {
      this.reload()
    }
  },
  beforeDestroy () {
    if (this.interval) clearInterval(this.interval)
  }
})
</script>
