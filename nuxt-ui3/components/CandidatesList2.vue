<template>

<v-container fluid class="ma-0 pa-0">

  <v-progress-linear height="1px" indeterminate v-show="loading"></v-progress-linear>
  <v-data-iterator
    :items="filteredList"
    :page="page"
    :items-per-page="itemsPerPage"
    >
    <template v-slot:default="{ items }">
      <v-list density="compact">
        <template v-for="item in items" :key="item.stash">
          <v-list-item @click="clickItem(item.raw)" style="cursor: pointer">

            <template v-slot:prepend>
              <v-avatar size="v-small">
                <Identicon :value="item.raw.stash" :size="24" theme="polkadot"></Identicon>
              </v-avatar>
            </template>

            <v-row>
              <v-col cols="6">
                <v-list-item-title>
                  {{item.raw.name}} {{item.raw.identity ? `/ ${item.raw.identity.name}` : ''}}
                </v-list-item-title>
                <v-list-item-subtitle>Score: {{ item.raw.total.toFixed(0) }}, Rank: {{item.raw.rank}}</v-list-item-subtitle>
              </v-col>
              <!-- <v-spacer></v-spacer> -->
              <v-col cols="6" align="right" justify="auto">
                <v-btn icon variant="flat" size="small" @click.stop="toggleFav(item.raw)" class="d-none d-sm-inline">
                  <v-icon :color="isFavourite(item.raw.stash)?'orange':'grey'">mdi-star</v-icon>
                </v-btn>

                <div class="d-none d-sm-inline">
                  <v-chip size="x-small" :color="item.raw.valid?'success':'red'">Valid&nbsp;<v-icon class="d-none d-sm-inline" size="x-small" dark>mdi-{{ item.raw.valid ? 'check-circle' : 'close-circle'}}</v-icon></v-chip>
                  &nbsp;<v-chip size="x-small" :color="item.raw.nominated_1kv?'green':'grey'">Nom. 1kv&nbsp;<v-icon class="d-none d-sm-inline" size="x-small" dark>mdi-{{ item.raw.nominated_1kv ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
                  &nbsp;<v-chip size="x-small" :color="item.raw.active?'green':'grey'">Active&nbsp;<v-icon class="d-none d-sm-inline" size="x-small" dark>mdi-{{ item.raw.active ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
                </div>
                <div class="d-inline d-sm-none">
                  <v-chip size="x-small" :color="item.raw.valid?'green':'red'">V&nbsp;<v-icon size="x-small" dark>mdi-{{ item.raw.valid ? 'check-circle' : 'close-circle'}}</v-icon></v-chip>
                  &nbsp;<v-chip size="x-small" :color="item.raw.nominated_1kv?'green':'grey'">N&nbsp;<v-icon size="x-small" dark>mdi-{{ item.raw.nominated_1kv ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
                  &nbsp;<v-chip size="x-small" :color="item.raw.active?'green':'grey'">A&nbsp;<v-icon size="x-small" dark>mdi-{{ item.raw.active ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
                </div>
              </v-col>
            </v-row>

            <!-- <template v-slot:append>
              <v-btn icon variant="flat" size="small" @click.stop="toggleFav(item)">
                <v-icon :color="isFavourite(item.raw.stash)?'orange':'grey'">mdi-star</v-icon>
              </v-btn>
              &nbsp;
              <v-btn icon size="x-small" @click="clickItem(item)">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </template> -->

            <v-divider></v-divider>
          </v-list-item>
        </template> <!-- item -->

      </v-list>

      <v-row dense density="compact">
        <v-col>
          <v-pagination
            v-model="page"
            :length="Math.ceil(filteredList?.length/itemsPerPage)"
            :total-visible="7"
            density="compact"
            >
          </v-pagination>
        </v-col>
        <v-col cols="3">
          <v-select density="compact" v-model="itemsPerPage" :items="[10,15,25,50]"></v-select>
        </v-col>
      </v-row>

    </template> <!-- // default: items -->
  
    </v-data-iterator>

</v-container>
</template>

<script lang="ts">
// import moment from 'moment'
import { defineComponent, ref, computed, watch, onBeforeMount } from 'vue'
import gql from 'graphql-tag'

// import Identicon from '@polkadot/vue-identicon'
import Identicon from './identicon/Identicon.vue'
import { type ICandidate, type ICandidateListFilter } from '../types/global'
import type { ApolloClient } from '@apollo/client'

const QUERY_CANDIDATES = gql`
query Candidates($chain: String!) {
  Candidates(chain: $chain) {
    chain
    active
    name
    rank
    stash
    total
    valid
    nominated_1kv
  }
}
`

const isServer = typeof window === 'undefined'

export default defineComponent({
  name: 'CandidatesList',
  components: {
    Identicon,
  },
  props: {
    reload: {
      type: Number,
      default: 0
    }
  },
  emits: ['clickItem'],
  setup (props, { emit }: any) {
    const store = useStore()
    const chainId = computed(() => store.chainId)

    const candidateStore = useCandidateStore()
    const list = computed<ICandidate[]>(() => candidateStore.list)
    const filter = computed<ICandidateListFilter>(() => candidateStore.filter)
    const filtering = computed(() => candidateStore.filtering)
    const favourites = computed<string[]>(() => candidateStore.favourites)
    
    const page = ref(1)
    const itemsPerPage = ref(15)
    const search = computed<String>(() => candidateStore.search)

    // // async query for SSR
    // var { data } = useAsyncQuery(
    //   QUERY_CANDIDATES,
    //   { chain: chainId.value },
    //   'default',
    //   {
    //     fetchPolicy: 'cache-first'
    //   }
    // )
    // watch(() => data, (newVal) => {
    //   console.debug('watch data', newVal)
    //   if (newVal && newVal.Candidates) items.value = newVal.Candidates
    // })

    // variables until SSR is completed
    var loading = ref(false)
    var refetch = (x: any) => {}
    
    onBeforeMount(() => {
      console.debug('CandidatesList: onBeforeMount()')
      const { result: cResult, refetch: cRefetch, loading: cLoading, error, onResult } = useQuery(QUERY_CANDIDATES, 
        { chain: chainId.value },
        { fetchPolicy: 'cache-and-network' }
      )
      refetch = cRefetch
      //loading.value = cLoading.value

      // cRefetch({ chain: chainId.value })
      onResult((event: any, context: any) => {
        console.debug('onResult', event)
        const { loading: cLoading, data, networkStatus } = event
        loading.value = cLoading
        if (data) {
          //items.value = data.Candidates
          candidateStore.setList(data.Candidates)
        }
      })
    })

    const onReload = async () => {
      console.debug('onReload()')
      loading.value = true
      // refetch will trigger onResult above
      // items.value = []
      refetch({ chain: chainId.value })
    }

    watch(() => props.reload, async (newVal) => {
      console.debug('watch reload', newVal)
      if (newVal !== 0) onReload()
    })

    watch(() => chainId.value, async (newVal) => {
      if (newVal !== undefined) onReload()
    })

    watch(() => itemsPerPage.value, () => {
      page.value = 1
    });

    const filteredList = computed(() => {
      return list.value.filter((c: ICandidate) => {
        let ret = true
        if (filter.value.favourite && !favourites.value.includes(c.stash)) ret = false
        if (filter.value.valid && !c.valid) ret = false
        if (filter.value.active && !c.active) ret = false
        if (filter.value.nominated && !c.nominated_1kv) ret = false
        if (search.value && search.value !== '') {
          if (!c.name.toLowerCase().includes(search.value.toLowerCase())) return false
        }
        return ret
      }).sort((a: any, b: any) => {
        // filter.value.sort
        const dir = filter.value.sortAsc ? 1 : -1
        if (a[filter.value.sort] > b[filter.value.sort]) return 1 * dir
        return -1 * dir
      })
    })

    const clickItem = (item: any) => {
      emit('clickItem', {...item})
    }

    const isFavourite = (stash: string) => {
      // console.debug('isFavourite', stash, favourites.value.includes(stash))
      return favourites.value.includes(stash)
    }

    const toggleFav = (item: any) => {
      console.debug('toggleFav', item.stash)
      // store.dispatch('candidate/toggleFav', { chain: chainId.value, stash: item.stash })
      candidateStore.toggleFav({ chain: chainId.value, stash: item.stash })
    }

    return {
      store,
      chainId,
      filteredList,
      filter,
      filtering,
      favourites,
      loading,
      refetch,
      page,
      itemsPerPage,
      clickItem,
      isFavourite,
      toggleFav,
    }
  }
})
</script>
