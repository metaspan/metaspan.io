<template>
  <v-container :loading="loading" fluid class="pa-0 ma-0">

    <v-toolbar>
      <v-toolbar-title>Candidates</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="text-none">
          <span class="d-none d-sm-inline">Updated: </span>{{ timeAgo(updatedAt) }}
        </v-btn>

        <v-btn :loading="loading" icon @click="reload++">
          <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-btn class="d-block" :color="filterActive ? 'primary' : ''" icon @click="showFilterDialog=true">
          <v-icon>mdi-filter</v-icon>
        </v-btn>

    </v-toolbar>

    <!-- <CirclesTest></CirclesTest> -->

    <!-- <v-toolbar class="d-none d-sm-block" flat elevation="0"> -->
    <v-container fluid class="d-none d-sm-block">
      <v-row align="center">
        <v-col cols="6">
          <v-text-field v-model="search" label="Search" :loading="searching" class="mx-4"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
        </v-col>
        <!-- <v-col cols="2">
          <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="xfilter.score" label="Score" class="mx-4"></v-text-field>
        </v-col> -->
        <v-col cols="2">
          <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="xfilter.active" label="Active"></v-switch>
        </v-col>
        <!-- <v-progress-linear striped absolute
          bottom v-show="debouncing" :indeterminate="debouncing"></v-progress-linear> -->
      </v-row>
    </v-container>
    <!-- </v-toolbar> -->

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
              <v-text-field v-model="xfilter.score" type="number" label="Score" class="mx-4"></v-text-field>
              <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
              <v-switch v-model="xfilter.active" label="Active"></v-switch>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item key="1">
          <v-card>
            <!-- {{xfilter}} -->
            <v-card-title>Sort</v-card-title>
            <v-card-text>
              <!-- <v-select v-model="xfilter.sort" :items="sortItems" item-text="text" item-value="value" label="Sort"></v-select> -->
              <v-select v-model="xfilter.sort" :items="['name', 'stash', 'score', 'rank']" label="Sort"></v-select>
              <v-switch v-model="xfilter.sortAsc" value="asc" label="Ascending"></v-switch>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-dialog>

    <!-- {{windowSize}} -->

    <!-- <CandidatesTable v-if="windowSize.x >= 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesTable> -->

    <CandidatesList 
      :filter="xfilter"
      :search="search"
      :reload="reload"
      @click-item="gotoCandidate"></CandidatesList>

    <Loading :loading="loading"></Loading>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
// import * as d3 from 'd3'
// import CandidatesHisto from './CandidatesHisto.vue'
import CandidatesTable from './CandidatesTable.vue'
import CandidatesList from './CandidatesList.vue'
import { ICandidate } from '../types/global'
import Loading from './Loading.vue'
import { debounce } from 'lodash'

// import WalletAddDialog from './WalletAddDialog.vue';
import CirclesTest from './identicon/CirclesTest.vue'

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
  score: number
  valid: boolean
  active: boolean
  favourite: boolean
  sort: string
  sortAsc: boolean
}

interface IData {
  reload: number
  tab: number
  windowSize: IWindowSize
  debouncing: boolean
  filterActive: boolean
  showFilterDialog: boolean
  dateTimeFormat: string
  search: string
  searching: boolean
  // sort: string
  // sortAsc: boolean
  sortItems: ISortItem[]
  xfilter: IFilter
}

export default defineComponent({
  name: 'Candidates',
  components: {
    // CandidatesHisto,
    CirclesTest,
    CandidatesTable,
    CandidatesList,
    Loading
  },
  setup () {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const dark = computed(() => store.state.dark)
    const apiConnected = computed(() => store.getters['candidate/apiConnected'])
    const loading = computed(() => store.getters['candidate/loading'])
    const updatedAt = computed(() => store.getters['candidate/updatedAt'])
    const favourites = computed(() => store.getters['candidate/favourites'])
    const savedSearch = computed(() => store.getters['candidate/search'])
    const search = ref('')
    search.value = savedSearch.value

    watch(() => chainId.value, (newVal) => {
      search.value = savedSearch.value
    })

    return {
      store,
      chainId,
      dark,
      apiConnected,
      search,
      loading,
      // list: result?.data?.Candidates || [],
      // result,
      // reload: refetch,
      updatedAt,
      favourites
    }
  },
  data: () => {
    return {
      reload: 0, // increment this to trigger reload in child
      tab: 0,
      windowSize: { x: 0, y: 0 },
      debouncing: false,
      filterActive: false,
      showFilterDialog: false,
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      searching: false,
      sortItems: [
        { text: 'Name', value: 'name' },
        { text: 'Rank', value: 'rank' },
        { text: 'Score', value: 'score' }
      ],
      xfilter: {
        rank: 0,
        score: 0,
        valid: false,
        active: false,
        favourite: false,
        sort: 'rank', // {text: 'Rank', value: 'rank'},
        sortAsc: false
      }
    }
  },
  watch: {
    chainId (val) {
      this.$router.push(`/${val}/candidate`)
      // set up the filter
      this.fetchFilter()
    },
    search (newval: string) {
      console.debug('Candidates.vue: watch.search', newval)
      this.debouncing = true
      this.searching = true
      this.debouncedSearch(newval)
    },
    xfilter: {
      deep: true,
      handler (newVal) {
        console.debug('watch.xfilter', newVal)
        this.debouncing = true
        this.debouncedFilter(newVal)
      }
    }
  },
  methods: {
    debouncedSearch (s: string) {
      console.debug(s)
    },
    debouncedFilter (f: IFilter) {
      console.debug(f)
    },
    fetchFilter () {
      console.debug('fetchFilter', this.store.state.candidate.chains[this.chainId])
      if (this.store.state.candidate.chains[this.chainId]) {
        this.xfilter = this.store.state.candidate.chains[this.chainId].filter
        this.search = this.store.state.candidate.chains[this.chainId].search
      }
    },
    checkFilterActive () {
      this.filterActive = this.xfilter.active ||
        this.xfilter.favourite ||
        this.xfilter.rank > 0 ||
        this.xfilter.score > 0 ||
        this.xfilter.valid ||
        this.search !== ''
    },
    // eslint-disable-next-line
    timeAgo (d: any) {
      return moment(d).fromNow()
    },
    formatDate (d: any) {
      return moment(d).format(this.dateTimeFormat)
    },
    // reload () {
    //   // console.debug('reload...')
    //   this.store.dispatch('candidate/getList')
    // },
    gotoCandidate (item: ICandidate) {
      console.debug('gotoCandidate', this.chainId, item)
      // this.store.dispatch('candidate/setCandidate', { chainId: this.chainId, stash: item.stash })
      this.$router.push(`/${this.chainId}/candidate/${item.stash}`)
    }
    // handleResize (evt: any) {
    //   console.debug('handleResize', evt)
    // }
  },
  async created () {
    console.debug('Candidates.vue: created()', this.chainId)
    // if (this.$route.params.chainId !== this.chainId) {
    //   await this.$store.dispatch('setChainId', this.$route.params.chainId)
    // }
    this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    // this.options = this.$store.state.candidate.options // .pagination.page
    // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage

    this.debouncedSearch = debounce((newVal: string) => {
      console.debug('debouncedSearch()', newVal)
      this.checkFilterActive()
      this.store.dispatch('candidate/setSearch', { chainId: this.chainId, search: newVal })
      this.debouncing = false
      this.searching = false
    }, 1000)

    this.debouncedFilter = debounce((newVal: IFilter) => {
      console.debug('debouncedFilter()', newVal)
      this.checkFilterActive()
      this.store.dispatch('candidate/handleFilter', { chainId: this.chainId, filter: {...newVal} })
      this.debouncing = false
      this.searching = false
    }, 1000)

    if (!this.chainId || this.chainId === undefined) {
      console.debug('setting chainId to', this.$route.params.chainId)
      await this.store.dispatch('setChainId', this.$route.params.chainId)
    }
  },
  async mounted () {
    console.debug('Candidates.vue: mounted()', this.chainId, this.$route.params)
    // const state = this.$store.state.candidate // [this.chain]
    // console.debug('state', state)
    this.fetchFilter()
  },
  async beforeDestroy () {
    console.debug('Candidates.vue: beforeDestroy()')
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
