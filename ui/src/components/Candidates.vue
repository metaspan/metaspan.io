<template>
  <v-container :loading="loading" fluid>

    <v-toolbar flat dense>
      <v-toolbar-title>Candidates</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn text class="text-none">
          <span class="d-none d-sm-inline">Updated: </span>{{ timeAgo(updatedAt) }}
        </v-btn>
        <v-btn :loading="loading" icon @click="reload()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn class="d-block d-sm-none" icon @click="showFilterDialog=true">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <v-toolbar class="d-none d-sm-block" dense flat elevation="0">
      <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
      <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
      <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
      <v-text-field v-model="xfilter.score" label="Score" class="mx-4"></v-text-field>
      <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
      <v-switch v-model="xfilter.active" label="Active"></v-switch>
    </v-toolbar>

    <v-dialog v-model="showFilterDialog">
      <v-card>
        <!-- {{xfilter}} -->
        <v-card-title>Sort</v-card-title>
        <v-card-text>
          <v-select v-model="xfilter.sort" :items="sortItems" item-text="text" item-value="value" label="Sort"></v-select>
          <v-switch v-model="xfilter.sortDir" value="asc" label="Ascending"></v-switch>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Filter</v-card-title>
        <v-card-text>
          <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
          <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
          <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
          <v-text-field v-model="xfilter.score" label="Score" class="mx-4"></v-text-field>
          <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
          <v-switch v-model="xfilter.active" label="Active"></v-switch>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- {{windowSize}} -->

    <CandidatesTable v-if="windowSize.x >= 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesTable>

    <CandidatesList  v-if="windowSize.x < 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesList>

  </v-container>
</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
// import * as d3 from 'd3'
// import CandidatesHisto from './CandidatesHisto.vue'
import CandidatesTable from './CandidatesTable.vue'
import CandidatesList from './CandidatesList.vue'
import Vue from 'vue'
import { ICandidate } from '../types/global'

interface IWindowSize {
  x: number
  y: number
}

interface ISortItem {
  text: string
  value: string
}

interface IFilter {
  rank: number | null
  score: number | null
  valid: boolean | null
  active: boolean | null
  favourite: boolean | null
}

interface IData {
  windowSize: IWindowSize
  showFilterDialog: boolean
  dateTimeFormat: string
  search: string
  sort: string
  sortDir: string
  sortItems: ISortItem[]
  xfilter: IFilter
  // options: any
}
interface IMethods {
  // eslint-disable-next-line
  timeAgo (d: any): string
  // eslint-disable-next-line
  formatDate (d: any): string
  reload (): void
  // eslint-disable-next-line
  gotoCandidate (item: any): void
}

interface IComputed {
  loading: boolean
  // eslint-disable-next-line
  filteredList: ICandidate[],
  // eslint-disable-next-line
  updatedAt: any
  favourites: string[]
  updated: string
}
// interface IProps {}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'Candidates',
  components: {
    // CandidatesHisto,
    CandidatesTable,
    CandidatesList
  },
  computed: {
    ...mapState('candidate', ['loading', 'filteredList', 'updatedAt', 'favourites']),
    updated (): string { return moment(this.updatedAt as string).format(this.dateTimeFormat as string) }
  },
  data (): IData {
    return {
      windowSize: { x: 0, y: 0 },
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
        rank: null,
        score: null,
        valid: null,
        active: null,
        favourite: false
      }
      // options: {}
    }
  },
  watch: {
    search (newval: string) {
      this.$store.dispatch('candidate/setSearch', newval)
    },
    xfilter: {
      deep: true,
      handler (newval, oldval) {
        if (oldval === false) console.debug(newval, oldval)
        this.$store.dispatch('candidate/handleFilter', newval)
      }
    }
  },
  methods: {
    // eslint-disable-next-line
    timeAgo (d: any) {
      return moment(d).fromNow()
    },
    formatDate (d) {
      return moment(d).format(this.dateTimeFormat)
    },
    reload () {
      // console.debug('reload...')
      this.$store.dispatch('candidate/getList')
    },
    gotoCandidate (item: ICandidate) {
      // console.debug('gotoCandidate', item)
      this.$store.dispatch('candidate/setCandidate', item.stash)
      this.$router.push('/kusama/candidate/' + item.stash)
    }
    // handleResize (evt: any) {
    //   console.debug('handleResize', evt)
    // }
  },
  created () {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    // this.options = this.$store.state.candidate.options // .pagination.page
    // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage
    this.xfilter = this.$store.state.candidate.filter
    this.search = this.$store.state.candidate.search
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
