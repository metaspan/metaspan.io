<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title>Pool Members</v-toolbar-title>
    </v-toolbar>
    <!-- <PoolMemberTable class="d-none d-sm-block" :list="items" /> -->
    <PoolMemberList :list="list" />

    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, ref, computed, watch, PropType } from 'vue'
// import { useQuery } from '@vue/apollo-composable'
// import gql from 'graphql-tag'

// import { IChainInfo } from '../types/global'
// import ClickToCopy from './ClickToCopy.vue'
import Loading from './Loading.vue'
import PoolMemberTable from './PoolMemberTable.vue'
import PoolMemberList from './PoolMemberList.vue'
// import { GET_POOL_MEMBERS } from '../graphql/queries/pools'
import { shortStash } from '../global/utils'
import { IPoolMember } from '../types/global'

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
  poolId: string
}

export default defineComponent({
  props: {
    // poolId: {
    //   type: String,
    //   required: true
    // },
    members: {
      type: Array as PropType<IPoolMember[]>,
      required: true
    }
  },
  components: {
    // ClickToCopy,
    // PoolMemberTable,
    PoolMemberList,
    // AccountLink,
    Loading
  },
  setup (props) {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const decimals = computed(() => store.state['substrate/decimals'])
    const chainInfo = computed(() => store.state['substrate/chainInfo'])
    const list = ref<IPoolMember[]>([] as IPoolMember[])
    watch(() => props.members, (newVal: IPoolMember[]) => {
      if (newVal !== undefined) list.value = newVal
    })
    return {
      store,
      chainId,
      decimals,
      chainInfo,
      list
    }

  },
  computed: {
    tokenSymbol (): string { return this.chainInfo.tokenSymbol }
  },
  data () {
    return {
      loading: false,
      headers: [
        { text: 'Member', value: 'accountId' },
        // { text: 'Id.', value: 'identity' },
        { text: 'Points', value: 'points', align: 'right' },
        // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
        { text: '#', value: 'menu', width: '15px', align: 'right' }
      ]
    }
  },
  // methods: {
  //   clickItem (item: any) {
  //     // this.$router.push(`/${this.chainId}/nominator/${item.accountId}`)
  //   },
  //   // shortStash (stash): string { return shortStash(stash) },
  //   // shortStash: (stash) => shortStash(stash),
  //   async getMembers () {
  //     // this.$store.dispatch('candidate/getNominators', { chainId: this.chainId, stash: this.stash })
  //     this.loading = true
  //     const id = parseInt(this.poolId)
  //     const res = await this.$apollo.query({
  //       query: GET_POOL_MEMBERS,
  //       variables: {
  //         chain: this.chainId,
  //         // stash: this.stash,
  //         id
  //         // ids: chunk
  //       }
  //     })
  //     // console.log('data', res.data.Nominators.map(n => n.accountId))
  //     console.debug('data', res)
  //     this.items = res.data.Pool?.members || []
  //     this.loading = false
  //   }
  // },
  // async mounted () {
  //   console.debug('PoolMembers.vue: mounted()', this.chainId, this.poolId)
  //   this.getMembers()
  // }
})
</script>
