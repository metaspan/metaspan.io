<template>
  <v-container :loading="loading" style="max-width: 900px" class="pt-0 mt-0">

    <v-toolbar color="#FFFFFF00">
      <v-toolbar-title>Candidates ({{ chainId }})</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn :loading="loading" icon @click="reload++">
          <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-btn class="d-block" :color="filterActive ? 'primary' : ''" icon @click="showFilterDialog=true">
          <v-icon>mdi-filter</v-icon>
        </v-btn>

    </v-toolbar>

    <v-container fluid class="d-none d-md-block">
      <v-row align="center">
        <v-col cols="7">
          <v-text-field v-model="search" label="Search" :loading="searching"></v-text-field>
        </v-col>
        <v-col cols="5" align="right">
          <v-input>
            <v-btn @click="xfilter.favourite = !xfilter.favourite"
              :variant="xfilter.favourite?'flat': 'tonal'"
              :color="xfilter.favourite ? 'primary': ''">Fav</v-btn>&nbsp;
            <v-btn @click="xfilter.valid = !xfilter.valid" :variant="xfilter.valid?'flat': 'tonal'"
              :color="xfilter.valid ? 'primary': ''">Valid</v-btn>&nbsp;
            <v-btn @click="xfilter.active = !xfilter.active" :variant="xfilter.active?'flat': 'tonal'"
              :color="xfilter.active ? 'primary': ''">Active</v-btn>&nbsp;
            <v-btn @click="xfilter.nominated = !xfilter.nominated" :variant="xfilter.nominated?'flat': 'tonal'"
              :color="xfilter.nominated ? 'primary': ''">Nom'd</v-btn>
          </v-input>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showFilterDialog" width="400">
      <v-toolbar dense :dark="!dark">
        <v-tabs v-model="tab">
          <v-tab>Filter</v-tab>
          <v-tab>Sort</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-btn icon @click="showFilterDialog=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-window v-model="tab">
        <v-window-item key="0">
          <v-card :loading="debouncing">
            <v-card-title>Filter</v-card-title>
            <v-card-text>
              <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
              <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
              <v-text-field v-model="xfilter.rank" type="number" label="Rank" class="mx-4"></v-text-field>
              <v-text-field v-model="xfilter.total" type="number" label="Total" class="mx-4"></v-text-field>
              <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
              <v-switch v-model="xfilter.active" label="Active"></v-switch>
              <v-switch v-model="xfilter.nominated" label="Nominated"></v-switch>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item key="1">
          <v-card>
            <!-- {{xfilter}} -->
            <v-card-title>Sort</v-card-title>
            <v-card-text>
              <!-- <v-select v-model="xfilter.sort" :items="sortItems" item-text="text" item-value="value" label="Sort"></v-select> -->
              <v-select v-model="xfilter.sort" :items="['name', 'stash', 'total', 'rank']" label="Sort"></v-select>
              <v-switch v-model="xfilter.sortAsc" value="asc" label="Ascending"></v-switch>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-dialog>

    <!-- <CandidatesTable v-if="windowSize.x >= 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesTable> -->

    <CandidatesList2 
      :filter="xfilter"
      :search="search"
      :reload="reload"
      @click-item="gotoCandidate"></CandidatesList2>

    <Loading :loading="loading"></Loading>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'

// import CandidatesTable from './CandidatesTable.vue'
import CandidatesList from './CandidatesList.vue'
import CandidatesList2 from './CandidatesList2.vue'
import { type ICandidate, type ICandidateListFilter } from '@/types/global'
import Loading from './Loading.vue'

// import { debounce } from 'lodash'
function debounce(func: Function, wait: number) {
  let timeout: number | undefined;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}
// import CirclesTest from './identicon/CirclesTest.vue'

interface IWindowSize {
  x: number
  y: number
}

interface ISortItem {
  text: string
  value: string
}

interface IFilter {
  rank: number
  total: number
  valid: boolean
  active: boolean
  favourite: boolean
  sort: string
  sortAsc: boolean
}

export default defineComponent({
  name: 'Candidates',
  components: {
    // CandidatesHisto,
    // CandidatesTable,
    CandidatesList2,
    Loading
  },
  setup () {
    const store = useStore()
    const candidateStore = useCandidateStore()
    const router = useRouter()
    const route = useRoute()
    const chainId = computed(() => store.chainId)
    const dark = computed(() => store.dark)
    const apiConnected = computed(() => candidateStore.apiConnected)
    const loading = computed(() => candidateStore.loading)
    const updatedAt = computed(() => candidateStore.updatedAt)
    const favourites = computed(() => candidateStore.favourites)
    const savedSearch = computed(() => candidateStore.search)
    const search = ref('')
    search.value = savedSearch.value

    watch(() => chainId.value, (newVal) => {
      search.value = savedSearch.value
    })

    const filter = computed(() => candidateStore.filter)
    const xfilter = ref<ICandidateListFilter>(filter.value)

    const reload = ref(0) // increment this to trigger reload in child
    const tab = ref(0)
    const windowSize = ref({ x: 0, y: 0 })
    const debouncing = ref(false)
    const showFilterDialog = ref(false)
    const dateTimeFormat = ref('YYYY/MM/DD hh:mm')
    const searching = ref(false)
    const sortItems = ref([
      { text: 'Name', value: 'name' },
      { text: 'Rank', value: 'rank' },
      { text: 'Score', value: 'total' }
    ])

    const filterActive = computed(() => 
      xfilter.value.active ||
      xfilter.value.favourite ||
      (xfilter.value.rank && xfilter.value.rank > 0) ||
      (xfilter.value.total && xfilter.value.total > 0) ||
      xfilter.value.active ||
      xfilter.value.valid ||
      xfilter.value.nominated ||
      search.value !== ''
    )

    const gotoCandidate = (item: ICandidate) => {
      console.debug('gotoCandidate', chainId.value, item)
      // this.store.dispatch('candidate/setCandidate', { chainId: this.chainId, stash: item.stash })
      router.push({
        // path: `/${chainId.value}/candidate/${item.stash}`,
        name: `chainId-candidate-stash`,
        params: { chainId: chainId.value, stash: item.stash }
      })
    }

    const debouncedSearch = debounce((newVal: string) => {
      console.debug('debouncedSearch()', newVal)
      //checkFilterActive()
      // store.dispatch('candidate/setSearch', { chainId: chainId.value, search: newVal })
      candidateStore.setSearch(newVal)
      debouncing.value = false
      searching.value = false
    }, 1000)

    const debouncedFilter = debounce((newVal: IFilter) => {
      console.debug('debouncedFilter()', newVal)
      //checkFilterActive()
      // store.dispatch('candidate/handleFilter', { chainId: chainId.value, filter: {...newVal} })
      candidateStore.handleFilter(newVal as ICandidateListFilter) // FIXME harmonize types
      debouncing.value = false
      searching.value = false
    }, 400)

    watch(() => chainId.value, (val) => {
      xfilter.value = candidateStore.filter
      router.push({
        name: `chainId-candidate`,
        params: { chainId: val }
      })
    })

    watch(() => search.value, (newval: string) => {
      console.debug('Candidates.vue: watch.search', newval)
      debouncing.value = true
      searching.value = true
      debouncedSearch(newval)
    })

    var filterWatch: any

    onBeforeUnmount(() => {
      console.debug('Candidates.vue: onBeforeUnmount()', filterWatch)
      // store.dispatch('candidate/setSearch', { chainId: chainId.value, search: '' })
      if(filterWatch) filterWatch()
    })

    onBeforeMount(async () => {
      console.debug('Candidates.vue: created()', chainId.value)
      xfilter.value = filter.value

      // if (this.$route.params.chainId !== this.chainId) {
      //   await this.$store.dispatch('setChainId', this.$route.params.chainId)
      // }
      windowSize.value = { x: window.innerWidth, y: window.innerHeight }
      // this.options = this.$store.state.candidate.options // .pagination.page
      // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage

      if (!chainId.value || chainId.value === undefined) {
        console.debug('setting chainId to', route.params.chainId)
        // await store.dispatch('setChainId', route.params.chainId)
        store.setChainId(route.params.chainId.toString())
      }

      nextTick(() => {
        filterWatch = watch(() => xfilter.value, (newVal) => {
          console.debug('watch.xfilter', newVal)
          debouncing.value = true
          debouncedFilter(newVal)
        }, {
          deep: true
        })
      })

      console.debug('Candidates.vue: mounted()', chainId.value, route.params)
    })

    return {
      store,
      chainId,
      dark,
      apiConnected,
      search,
      loading,
      updatedAt,
      favourites,
      xfilter,
      reload,
      tab,
      windowSize,
      debouncing,
      filterActive,
      showFilterDialog,
      dateTimeFormat,
      searching,
      sortItems,
      gotoCandidate,
    }
  }
})
</script>

<style scoped>
.identicon {
    width: 16px;
    max-width: 16px;
    /* white-space:nowrap; */
    display: inline-block;
}

.small-radio i {
  font-size: 19px;
}
.small-radio label {
  font-size: 14px;
  padding-left: 0px;
  margin-left: -4px;
}
.small-radio .v-radio {
  padding: 0px;
}
.small-radio [class*="__ripple"] {
  left: 0;
}
</style>
