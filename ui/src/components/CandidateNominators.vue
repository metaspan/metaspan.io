<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title>Nominators ({{totalNominations}} {{chainId}})</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="mapItems">

      <template v-slot:[`item.shortStash`]="{item}">
        <div style="cursor:pointer" @click="clickItem(item)">
          <!-- <span class="identicon">
            <Identicon :value="item.accountId" :size="16" theme="polkadot"></Identicon>
          </span> {{item.shortStash}} -->
          <ClickToCopy :display="item.shortStash" :text="item.accountId" />
        </div>
      </template>

      <template v-slot:[`item.is1kv`]="{item}">
        <v-menu>
          {{item.is1kv ? 'Yes' : 'No'}}
        </v-menu>
      </template>

      <template v-slot:[`item.menu`]="{item}">
        <!-- <v-menu>
          {{item.menu}}
        </v-menu> -->
        <a :href="`https://${chainId}.subscan.io/account/${item.accountId}`" target="_blank">[link]</a>
      </template>

    </v-data-table>
    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </div>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import Vue from 'vue'
// import { IChainInfo } from '../types/global'
import ClickToCopy from './ClickToCopy.vue'
import Loading from './Loading.vue'
import { GET_VALIDATOR_NOMINATORS } from '../graphql/queries/validators'
import { shortStash } from '../global/utils'

interface IData {
  loading: boolean
  headers: any[]
  items: any[]
}
interface IMethods {
  clickItem (accountId: string): void
  shortStash (stash: string): string
  toCoin(value: number): string
  getNominators (): void
  getNominatorsFromApi (): void
}
interface IComputed {
  chainId: string
  chainInfo: any // IChainInfo
  decimals: Record<number, number>
  mapItems: any[]
  totalNominations: string
}
interface IProps {
  stash: string
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  props: {
    stash: {
      type: String,
      required: true
    }
  },
  components: {
    ClickToCopy,
    Loading
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    mapItems () {
      // return this.items
      return this.items.map(m => {
        m.shortStash = this.shortStash(m.accountId)
        m.balance = this.toCoin(m.account.data.free)
        return m
      })
    },
    totalNominations () {
      return this.toCoin(this.items.reduce((subtot: number, r: any) => {
        // console.debug('totalNominations', subtot, r)
        return subtot + (parseInt(r.account?.data?.free) || 0)
      }, 0))
    }
  },
  data () {
    return {
      loading: false,
      items: [],
      headers: [
        { text: 'Nom.', value: 'shortStash' },
        // { text: 'Id.', value: 'identity' },
        { text: 'Bal.', value: 'balance', align: 'right' },
        { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
        { text: '#', value: 'menu', width: '15px', align: 'right' }
      ]
    }
  },
  methods: {
    clickItem (item: any) {
      // this.$router.push(`/${this.chainId}/nominator/${item.accountId}`)
    },
    // shortStash (stash): string { return shortStash(stash) },
    shortStash: (stash) => shortStash(stash),
    toCoin (v) {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    },
    async getNominators () {
      // this.$store.dispatch('candidate/getNominators', { chainId: this.chainId, stash: this.stash })
      this.loading = true
      const res = await this.$apollo.query({
        query: GET_VALIDATOR_NOMINATORS,
        variables: {
          chain: this.chainId,
          stash: this.stash
          // ids: chunk
        }
      })
      // console.log('data', res.data.Nominators.map(n => n.accountId))
      console.debug('data', res.data)
      this.items = res.data.Validator?.nominators || []
      this.loading = false
    },
    getNominatorsFromApi () {
      // this.loading = true
      // api.query.staking.nominators
      // const stash = 'Ew5NJucSyE17T4QYBhjbm1WYrGk2oULTHyjiJacLbCNfc4Q'
      let i = 0
      const interval = setInterval(async () => {
        i++
        try {
          if (this.$substrate[this.chainId]) {
            let stash = '12WPkGHWYhL7Vdtwqbjo7ugbaoajr8KLMChnE3puX4Q5Cxsf'
            stash = this.stash
            // const noms = await this.$substrate[this.chainId].query.staking.nominators.entries(stash)
            // noms.forEach(([key, nominator]) => {
            //   console.log('nkey', key.toString(), nominator.toString())
            // })
            const nominators = await this.$substrate[this.chainId].query.staking.nominators.entries()
            console.debug(`got ${nominators.length} entries !!`)
            const nominatorAddresses = nominators.map(([address]) => '' + address.toHuman()[0])

            const vals = await this.$substrate[this.chainId].query.staking.validators.entries(stash)
            vals.forEach(([key, validator]) => {
              console.log('vkey', key.toString(), validator.toString())
            })

            // console.debug('noms', noms.toString(), 'vals', vals.toJSON())
            clearInterval(interval)
          }
        } catch (err) {
          console.warn(err)
          // attempt reconnect
          await this.$substrate[this.chainId].connect()
        }

        if (i > 10) {
          console.warn('CandidateNominators.vue: no API found')
          clearInterval(interval)
        }
      }, 1000)
    }
  },
  async mounted () {
    console.debug('CandidateNominators.vue: mounted()', this.chainId, this.stash)
    this.getNominators()
  }
})
</script>
