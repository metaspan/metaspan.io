<template>
  <v-container :loading="loading" fluid>

    <v-toolbar flat dense>
      <v-toolbar-title>Nominators</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn class="text-none">
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

    <v-list>
      <v-list-item v-for="item,idx in nominators" v-bind:key="idx">
        <v-list-item-title>
          {{item}}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- <CandidatesList  v-if="windowSize.x < 600" :filter="xfilter" :search="search"
      @click-item="gotoCandidate"></CandidatesList> -->

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import moment from 'moment'
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
  sort: string
  sortDir: string
}

export default defineComponent({
  name: 'Nominators',
  components: {
    // CandidatesHisto,
    // CandidatesTable,
    // CandidatesList
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const loading = computed(() => store.state['polkadot/loading'])
    const updatedAt = computed(() => store.state['polkadot/updatedAt'])
    const nominators = computed(() => store.state['polkadot/nominators'])
    const updated = computed((): string => { return moment(updatedAt.value as string).format(dateTimeFormat.value as string) })
    const windowSize = ref({ x: 0, y: 0 })
    const showFilterDialog = ref(false)
    const dateTimeFormat = ref('YYYY/MM/DD hh:mm')
    const search = ref('')
    const sort = ref('rank') // {text: 'Rank', value: 'rank'},
    const sortDir = ref('asc')
    const sortItems = ref([
        { text: 'Name', value: 'name' },
        { text: 'Rank', value: 'rank' },
        { text: 'Score', value: 'score' }
      ])
    const xfilter = ref({
        rank: null,
        score: null,
        valid: null,
        active: null,
        favourite: false,
        sort: 'name',
        sortDir: 'asc'
      })

    const reload = () => {
      // console.debug('reload...')
      store.dispatch('polkadot/nominators')
    }
    const gotoCandidate = (item: ICandidate) => {
      // console.debug('gotoCandidate', item)
      store.dispatch('candidate/setCandidate', item.stash)
      router.push('/candidate/' + item.stash)
    }

    watch(() => search.value, newVal => {
      store.dispatch('candidate/setSearch', newVal)
    })
    watch(() => xfilter.value, newVal => {
      // if (oldval === false) console.debug(newval, oldval)
      store.dispatch('candidate/handleFilter', newVal)
    })

    onBeforeMount(() => {
      windowSize.value = { x: window.innerWidth, y: window.innerHeight }
      // this.options = this.$store.state.candidate.options // .pagination.page
      // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage
      xfilter.value = store.state.candidate.filter
      search.value = store.state.candidate.search
    })

    return {
      loading,
      updatedAt,
      nominators,
      updated,
      windowSize,
      showFilterDialog,
      dateTimeFormat,
      search,
      sort,
      sortDir,
      sortItems,
      xfilter,
      reload,
      gotoCandidate
    }
  },
  methods: {
    // eslint-disable-next-line
    timeAgo (d: any) {
      return moment(d).fromNow()
    },
    formatDate (d: any) {
      return moment(d).format(this.dateTimeFormat)
    },
    // handleResize (evt: any) {
    //   console.debug('handleResize', evt)
    // }
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
