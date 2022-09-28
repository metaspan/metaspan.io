<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title>Pool Members</v-toolbar-title>
    </v-toolbar>
    <PoolMemberTable class="d-none d-sm-block" :list="items" />
    <PoolMemberList class="d-block d-sm-none" :list="items" />

    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </div>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import Vue from 'vue'
// import { IChainInfo } from '../types/global'
// import ClickToCopy from './ClickToCopy.vue'
import Loading from './Loading.vue'
import PoolMemberTable from './PoolMemberTable.vue'
import PoolMemberList from './PoolMemberList.vue'
import { GET_POOL_MEMBERS } from '../graphql/queries/pools'
import { shortStash } from '../global/utils'

interface IData {
  loading: boolean
  headers: any[]
  items: any[]
}
interface IMethods {
  clickItem (accountId: string): void
  // shortStash (stash: string): string
  // toCoin(value: number): string
  getMembers (): void
}
interface IComputed {
  chainId: string
  chainInfo: any // IChainInfo
  decimals: Record<number, number>
  // mapItems: any[]
  // totalNominations: string
  tokenSymbol: string
}
interface IProps {
  poolId: number
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  props: {
    poolId: {
      type: Number,
      required: true
    }
  },
  components: {
    // ClickToCopy,
    PoolMemberTable,
    PoolMemberList,
    // AccountLink,
    Loading
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    // mapItems () {
    //   // return this.items
    //   return this.items.map(m => {
    //     m.shortStash = this.$utils.shortStash(m.accountId)
    //     m.balance = this.toCoin(m.account.data.free)
    //     return m
    //   })
    // },
    // totalNominations () {
    //   return this.toCoin(this.items.reduce((subtot: number, r: any) => {
    //     // console.debug('totalNominations', subtot, r)
    //     return subtot + (parseInt(r.account?.data?.free) || 0)
    //   }, 0))
    // },
    tokenSymbol () { return this.chainInfo.tokenSymbol }
  },
  data () {
    return {
      loading: false,
      items: [],
      headers: [
        { text: 'Member', value: 'accountId' },
        // { text: 'Id.', value: 'identity' },
        { text: 'Points', value: 'points', align: 'right' },
        // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
        { text: '#', value: 'menu', width: '15px', align: 'right' }
      ]
    }
  },
  methods: {
    clickItem (item: any) {
      // this.$router.push(`/${this.chainId}/nominator/${item.accountId}`)
    },
    // shortStash (stash): string { return shortStash(stash) },
    // shortStash: (stash) => shortStash(stash),
    async getMembers () {
      // this.$store.dispatch('candidate/getNominators', { chainId: this.chainId, stash: this.stash })
      this.loading = true
      const res = await this.$apollo.query({
        query: GET_POOL_MEMBERS,
        variables: {
          chain: this.chainId,
          // stash: this.stash,
          id: this.poolId
          // ids: chunk
        }
      })
      // console.log('data', res.data.Nominators.map(n => n.accountId))
      console.debug('data', res.data)
      this.items = res.data.Pool?.members || []
      this.loading = false
    }
  },
  async mounted () {
    console.debug('PoolMembers.vue: mounted()', this.chainId, this.poolId)
    this.getMembers()
  }
})
</script>
