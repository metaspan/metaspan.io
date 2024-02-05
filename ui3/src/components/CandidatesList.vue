<template>

  <v-list lines="two" :loading="filtering">
    <v-progress-linear height="1px" indeterminate v-show="loading"></v-progress-linear>

    <template v-for="item in list" v-bind:key="item.stash">
      <v-list-item @click="clickItem(item)" style="cursor: pointer">

        <template v-slot:prepend>
          <v-avatar size="small">
            <Identicon :value="item.stash" :size="32" theme="polkadot"></Identicon>
          </v-avatar>
        </template>

        <v-row>
          <v-col cols="6">
            <v-list-item-title>
              {{item.name}} {{item.identity ? `/ ${item.identity.name}` : ''}}
            </v-list-item-title>
            <v-list-item-subtitle>Score: {{ item.total.toFixed(0) }}, Rank: {{item.rank}}</v-list-item-subtitle>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="6" align="right" justify="auto">
            <div class="d-none d-sm-inline">
              <v-chip size="x-small" :color="item.valid?'success':'red'">Valid&nbsp;<v-icon class="d-none d-sm-inline" x-small dark>mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon></v-chip>
              &nbsp;<v-chip size="x-small" :color="item.nominated_1kv?'green':'grey'">Nom. 1kv&nbsp;<v-icon class="d-none d-sm-inline" x-small dark>mdi-{{ item.nominated_1kv ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
              &nbsp;<v-chip size="x-small" :color="item.active?'green':'grey'">Active&nbsp;<v-icon class="d-none d-sm-inline" x-small dark>mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
            </div>
            <div class="d-inline d-sm-none">
              <v-chip size="x-small" :color="item.valid?'green':'red'">V&nbsp;<v-icon x-small dark>mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon></v-chip>
              &nbsp;<v-chip size="x-small" :color="item.nominated_1kv?'green':'grey'">N&nbsp;<v-icon x-small dark>mdi-{{ item.nominated_1kv ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
              &nbsp;<v-chip size="x-small" :color="item.active?'green':'grey'">A&nbsp;<v-icon x-small dark>mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
            </div>
          </v-col>
        </v-row>

        <template v-slot:append>
          <v-btn icon variant="flat" size="small" @click.stop="toggleFav(item)">
            <v-icon :color="isFavourite(item.stash)?'orange':'grey'">mdi-star</v-icon>
          </v-btn>
          &nbsp;
          <v-btn icon size="x-small" @click="clickItem(item)">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </template>

      </v-list-item>
      <v-divider></v-divider>
    </template>
  
    <v-list-item>
      <v-row>
        <v-col align="center">
          <v-btn @click="fetchNext()" :loading="loading">fetch more</v-btn>
        </v-col>
      </v-row>
    </v-list-item>

    <!-- <Loading :loading="loading" :absolute="true"></Loading> -->

  </v-list>

</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent, ref, computed, watch, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
// import Identicon from '@polkadot/vue-identicon'
import Identicon from './identicon/Identicon.vue'
import { ICandidate, ICandidateListFilter, ICandidateValidityItem } from '../types/global'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
// import Loading from '@/components/Loading.vue'

const QUERY_CANDIDATES = gql`
  query Data($chain: String!,
    $search: String,
    $stashes: [String],
    $active: Boolean, 
    $valid: Boolean,
    $nominated_1kv: Boolean,
    $rank: Int,
    $score: Int,
    $order: String,
    $orderDir: String,
    $cursor: String!,
    $limit: Int) {
    CandidatesFeed(
        chain: $chain,
        search: $search,
        stashes: $stashes,
        active: $active, 
        valid: $valid,
        nominated_1kv: $nominated_1kv,
        rank: $rank,
        score: $score,
        order: $order,
        orderDir: $orderDir,
        cursor: $cursor,
        limit: $limit
      ) {
      cursor
      Candidates {
        chain
        stash
        name
        active
        valid
        total
        rank
        location
        nominated_1kv
      }
    }
  }
`

export default defineComponent({
  name: 'CandidatesList',
  components: {
    Identicon,
    // Loading
  },
  props: {
    list: {
      type: Array
    },
    // search: String,
    reload: {
      type: Number
    }
  },
  // emits: ['click-item'],
  setup (props, { emit }: any) {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const filteredList = computed(() => store.getters['candidate/filteredList'])
    const filter = computed<ICandidateListFilter>(() => store.getters['candidate/filter'])
    console.debug('filter', filter.value)
    const filtering = computed(() => store.getters['candidate/filtering'])
    const favourites = computed<string[]>(() => store.getters['candidate/favourites'])
    
    const limit = ref(25)
    const offset = ref(0)
    // const search = ref(props.search)
    const search = computed<String>(() => store.getters['candidate/search'])
    const list = ref([] as any[])
    const cursor = ref('')

    const prepQuery = (fresh=false) => {
      const params = {
        chain: chainId.value,
        // search: search.value,
        // active: filter.value.active,
        // valid: filter.value.valid,
        // nominated_1kv: filter.value.nominated,
        // order: filter.value.sort,
        // orderDir: filter.value.sortAsc ? 'asc' : 'desc',
        // cursor: fresh ? '' : cursor.value,
        // limit: limit.value,
        // stashes: filter.value.favourite? favourites.value : null
      }
      // if (filter.value.rank) params.rank = parseInt(filter.value.rank)
      // if (filter.value.score) params.score = parseInt(filter.value.score)
      return params
    }
    const { query, result, loading, error, refetch, fetchMore, onResult } = useQuery(QUERY_CANDIDATES, prepQuery(true), {
      fetchPolicy: 'cache-first'
    })

    onResult((event: any) => {
      console.debug('onResult', event)
      console.debug('cursor', cursor.value)
      const { loading, data, networkStatus } = event
      if (cursor.value === data.CandidatesFeed?.cursor) {
        console.warn('we have a duplicate cursor...', cursor.value)
        return
      }
      if (cursor.value === '') {
        list.value = [...data.CandidatesFeed?.Candidates || []]
      } else {
        const newList = [...data.CandidatesFeed?.Candidates || []]
        list.value = list.value.concat(...newList)
      }
      // console.debug('newList', newList)
      cursor.value = data.CandidatesFeed?.cursor || cursor.value
    })

    const fetchNext = async () => {
      console.debug('fetchNext(): cursor', cursor.value)
      offset.value += limit.value
      await refetch(prepQuery(false))
    }

    const onReload = async () => {
      console.debug('onReload()', cursor.value)
      // refetch will trigger onResult above
      cursor.value = ''
      list.value = []
      await refetch(prepQuery(true))
    }

    watch(() => props.reload, async (newVal) => {
      console.debug('watch reload', newVal)
      // if (newVal !== undefined) onReload()
      cursor.value = ''
      list.value = []
      await refetch(prepQuery(true))
    })

    watch(() => chainId.value, async (newVal) => {
      if (newVal !== undefined) onReload()
    })

    watch(() => search.value, (newVal) => {
      console.debug('CandidatesList.vue: watch.search:', newVal)
      onReload()
    })

    watch(() => filter.value, (newVal) => {
      console.debug('CandidatesList.vue: watch.filter:', {...newVal})
      onReload()
    }, {
      deep: true
    })

    const clickItem = (item: any) => { emit('click-item', {...item}) }
    const isFavourite = (stash: string) => {
      // console.debug('isFavourite', stash, favourites.value.includes(stash))
      return favourites.value.includes(stash)
    }
    // eslint-disable-next-line
    const toggleFav = (item: any) => {
      // console.debug('toggleFav', item.stash)
      store.dispatch('candidate/toggleFav', { chain: chainId.value, stash: item.stash })
    }
    const timeAgo = (d: any) => {
      return moment(d).fromNow()
    }
    const getScore = (item: ICandidate) => {
      return (item.score && item.score.total) ? item.score.total.toFixed(2) : 0
    }
    const isValid = (items = []) => {
      const invalid = items.find((i: any) => i.valid === false)
      return !invalid
    }

    // const display = useDisplay()
    onMounted(() => {
      // console.log('CandidatesList.vue: onMounted() mobile', display) // false
      // refetch()
    })

    return {
      store,
      chainId,
      filteredList,
      filter,
      filtering,
      favourites,
      loading,
      refetch,
      fetchNext,
      list,
      clickItem,
      isFavourite,
      toggleFav,
      timeAgo,
      getScore,
      isValid,
      // mobile: display.mobile
    }
  },
  // mounted () {
  //   window.addEventListener('resize', () => {
  //     console.log('window resized')
  //   })
  // },
  // beforeUnmount () {
  //   window.removeEventListener('resize', ()=>{})
  // }
})
</script>

<!-- <style scoped>
.identicon {
  width: 16px;
  max-width: 16px;
  /* white-space:nowrap; */
  display: inline-block;
}
</style> -->
