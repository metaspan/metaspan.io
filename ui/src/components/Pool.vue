<template>

  <v-card>
    <v-card-title>
      <!-- <span class="nowrap"> -->
        <v-btn small icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn>
        &nbsp;
        <v-toolbar-title class="nowrap">Pool {{pool.id}}. {{pool.name}}</v-toolbar-title>
      <!-- </span> -->
    </v-card-title>
    <!-- <v-card-title>Pools</v-card-title> -->
    <v-card-text>

      <!-- {{pool}} -->
      <v-sheet>
      <table width="100%">
        <!-- <thead>
          <th>x</th><th>y</th>
        </thead> -->
        <tbody>
          <tr>
            <td width="20%">Points</td><td>{{toCoin(pool.points)}} {{chainInfo.tokenSymbol}}</td>
          </tr><tr>
            <td>State</td><td>{{pool.state}}</td>
          </tr>
          <!-- <tr>
            <td>Member count</td><td>{{pool.memberCounter}}</td>
          </tr> -->
          <tr>
            <td>Roles</td><td>
              <table width="100%">
                <tr>
                  <td width="30%">Root</td><td align="right">
                    <AccountLink :accountId="pool.roles.root" />
                  </td>
                </tr><tr>
                  <td>Nominator</td><td align="right">
                    <AccountLink :accountId="pool.roles.nominator" />
                  </td>
                </tr><tr>
                  <td>Depositor</td><td align="right">
                    <AccountLink :accountId="pool.roles.depositor" />
                  </td>
                </tr><tr>
                  <td>State Toggler</td><td align="right">
                    <AccountLink :accountId="pool.roles.stateToggler" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- <tr>
            <td>name</td><td>{{pool.name}}</td>
          </tr> -->
        </tbody>
      </table>
      </v-sheet>

      <PoolMembers :poolId="id"></PoolMembers>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { IPool } from '../types/global'
import AccountLink from './AccountLink.vue'
import PoolMembers from './PoolMembers.vue'

interface IData {
  loading: boolean
}
// eslint-disable-next-line
interface IMethods {
  // toCoin (val: number): string
}
interface IComputed {
  chainId: string
  chainInfo: any
  pool: IPool
  decimals: any
  // getStash: string
}
interface IProps {
  id: string
}

export default defineComponent({
  props: {
    id: {
      type: String,
      required: false
    }
  },
  components: {
    AccountLink,
    PoolMembers
  },
  computed: {
    ...mapState(['chainId']),
    ...mapGetters('pool', ['pool']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo'])
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    chainId (newVal: string) {
      this.$router.push(`/${newVal}/pool`)
    }
  },
  methods: {
    toCoin (v: any) {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    }
  },
  async created () {
    console.debug('Pool.vue created()', this.chainId, this.pool, this.$route.params)
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

<style scoped>
.nowrap {
  max-width: 425px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
