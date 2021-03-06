<template>
  <v-container :loading="loading" fluid>

    <v-toolbar flat dense>
      <v-toolbar-title>Candidates</v-toolbar-title>
      <v-spacer></v-spacer>
        <!-- {{chain}} -->
        <v-btn text class="text-none">
          <span class="d-none d-sm-inline">Updated: </span>{{ timeAgo(updatedAt) }}
        </v-btn>
        <v-btn :loading="loading" icon @click="reload()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn class="d-block d-sm-none" :color="filterActive ? 'primary' : ''" icon @click="showFilterDialog=true">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <v-toolbar class="d-none d-sm-block" dense flat elevation="0" :loading="debouncing">
      <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
      <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
      <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
      <v-text-field v-model="xfilter.score" label="Score" class="mx-4"></v-text-field>
      <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
      <v-switch v-model="xfilter.active" label="Active"></v-switch>
      <v-progress-linear striped absolute
        bottom v-show="debouncing" :indeterminate="debouncing"></v-progress-linear>
    </v-toolbar>

    <v-dialog v-model="showFilterDialog" width="400">
      <v-toolbar dense :dark="!dark">
        <v-tabs v-model="tab">
          <v-tab>Filter</v-tab>
          <v-tab>Sort</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-btn icon @click="showFilterDialog=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item key="0">
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
        </v-tab-item>
        <v-tab-item key="1">
          <v-card>
            <!-- {{xfilter}} -->
            <v-card-title>Sort</v-card-title>
            <v-card-text>
              <v-select v-model="xfilter.sort" :items="sortItems" item-text="text" item-value="value" label="Sort"></v-select>
              <v-switch v-model="xfilter.sortDir" value="asc" label="Ascending"></v-switch>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-dialog>

    <!-- {{windowSize}} -->

    <CandidatesTable v-if="windowSize.x >= 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesTable>

    <CandidatesList v-if="windowSize.x < 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesList>

    <Loading :loading="loading"></Loading>

  </v-container>
</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState, mapGetters } from 'vuex'
// import * as d3 from 'd3'
// import CandidatesHisto from './CandidatesHisto.vue'
import CandidatesTable from './CandidatesTable.vue'
import CandidatesList from './CandidatesList.vue'
import Vue from 'vue'
import { ICandidate } from '../types/global'
import Loading from './Loading.vue'
import { debounce } from 'lodash'

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
}

interface IData {
  tab: number
  windowSize: IWindowSize
  debouncing: boolean
  filterActive: boolean
  showFilterDialog: boolean
  dateTimeFormat: string
  search: string
  sort: string
  sortDir: string
  sortItems: ISortItem[]
  xfilter: IFilter
}
interface IMethods {
  debouncedSearch (s: string): void
  debouncedFilter (f: IFilter): void
  // eslint-disable-next-line
  timeAgo (d: any): string
  // eslint-disable-next-line
  formatDate (d: any): string
  reload (): void
  // eslint-disable-next-line
  gotoCandidate (item: any): void
  checkFilterActive (): void
}

interface IComputed {
  chain: string
  loading: boolean
  dark: boolean
  // filteredList: ICandidate[]
  // eslint-disable-next-line
  updatedAt: any
  favourites: string[]
  // updated: string
}
// eslint-disable-next-line
interface IProps {
  // chain: string
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'Candidates',
  components: {
    // CandidatesHisto,
    CandidatesTable,
    CandidatesList,
    Loading
  },
  // props: {
  //   chain: {
  //     type: String,
  //     required: true
  //   }
  // },
  computed: {
    ...mapState('candidate', ['chain']),
    ...mapGetters('candidate', ['loading', 'updatedAt', 'favourites']),
    ...mapState(['dark'])
    // updated (): string { return moment(this.updatedAt as string).format(this.dateTimeFormat as string) }
  },
  data (): IData {
    return {
      tab: 0,
      windowSize: { x: 0, y: 0 },
      debouncing: false,
      filterActive: false,
      showFilterDialog: false,
      dateTimeFormat: 'YYYY/MM/DD hh:mm',
      search: '',
      sort: 'rank', // {text: 'Rank', value: 'rank'},
      sortDir: 'asc',
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
        favourite: false
      }
    }
  },
  watch: {
    search (newval: string) {
      this.debouncing = true
      this.debouncedSearch(newval)
    },
    xfilter: {
      deep: true,
      handler (newval) {
        this.debouncing = true
        this.debouncedFilter(newval)
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
    formatDate (d) {
      return moment(d).format(this.dateTimeFormat)
    },
    reload () {
      // console.debug('reload...')
      this.$store.dispatch('candidate/getList', { chain: this.chain })
    },
    gotoCandidate (item: ICandidate) {
      console.debug('gotoCandidate', this.chain, item)
      this.$store.dispatch('candidate/setCandidate', { chain: this.chain, stash: item.stash })
      this.$router.push(`/chain/${this.chain}/candidate/${item.stash}`)
    }
    // handleResize (evt: any) {
    //   console.debug('handleResize', evt)
    // }
  },
  async created () {
    console.debug('Candidates.vue: created()', this.chain)
    if (this.$route.params.chain !== this.chain) {
      await this.$store.dispatch('candidate/setChain', this.$route.params.chain)
    }
    this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    // this.options = this.$store.state.candidate.options // .pagination.page
    // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage

    this.debouncedSearch = debounce((newVal: string) => {
      this.checkFilterActive()
      this.$store.dispatch('candidate/setSearch', { chain: this.chain, search: newVal })
      this.debouncing = false
    }, 1000)

    this.debouncedFilter = debounce((newVal: IFilter) => {
      this.checkFilterActive()
      this.$store.dispatch('candidate/handleFilter', { chain: this.chain, filter: newVal })
      this.debouncing = false
    }, 1000)
  },
  mounted () {
    console.debug('Candidates.vue: mounted()', this.chain)
    const state = this.$store.state.candidate // [this.chain]
    console.debug('state', state)
    this.xfilter = state[this.chain].filter
    this.search = state[this.chain].search
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
