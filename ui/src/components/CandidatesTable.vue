<template>

  <v-data-table dense
    :loading="loading || filtering"
    :headers="headers"
    :items="items"
    :page="options.page"
    :items-per-page="options.itemsPerPage"
    :sort-by="options.sortBy"
    :sort-desc="options.sortDesc"
    item-key="stash"

    @pagination="handlePaginate"
    @update:options="handleOptions"
    @update:page="handlePage"
    @update:items-per-page="handleItemsPerPage">

    <template v-slot:[`item.favourite`]="{item}">
      <v-btn small icon @click="toggleFav(item)">
      <v-icon small :color="item.favourite?'orange':'grey'">mdi-star</v-icon>
      </v-btn>
    </template>

    <template v-slot:[`item.name`]="{item}">
      <div style="cursor:pointer" @click="clickItem(item)">
        <span class="identicon">
          <Identicon :value="item.stash" :size="16"></Identicon>
        </span> {{item.name}}
      </div>
    </template>

    <template v-slot:[`item.identity_name`]="{item}">
      <div style="cursor:pointer" @click="clickItem(item)">
        {{item.identity_name}}
      </div>
    </template>

    <template v-slot:[`item.discoveredAt`]="{item}">
      {{timeAgo(item.discoveredAt) }}
    </template>

    <template v-slot:[`item.valid`]="{item}">
      <div align="center">
      <v-icon small :color="item.valid?'green':'red'">mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon>
      </div>
    </template>

    <template v-slot:[`item.active`]="{item}">
      <v-icon small :color="item.active?'green':'grey'">mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon>
    </template>

    <template v-slot:[`item.score`]="{item}">
      {{item.score ? item.score.toFixed(2) : 0.00 }}
    </template>

  </v-data-table>

</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
import Vue from 'vue'
import { ICandidate, ICandidateValidityItem } from '../types/global'

interface IOptions {
  page: number
  itemsPerPage: number
  sortBy: string[],
  sortDesc: string[]
}

interface IFilter {
  favourite: boolean
  rank: string
  score: number
  valid: boolean
  active: boolean
}

// eslint-disable-next-line
interface IPaginate {}

interface IFilteredListItem {
  favourite: boolean
  stash: string
  name: string
  discoveredAt: string | number | Date
  valid: boolean
  active: boolean
  rank: number | undefined
  score: number | undefined
}

interface IData {
  options: IOptions
  xfilter: IFilter
}

interface IMethods {
  isValid(validity: ICandidateValidityItem[]): boolean
  timeAgo(d: string): string
  clickItem(item: IFilteredListItem): void
  toggleFav (item: IFilteredListItem): void
  handlePaginate (evt: IPaginate): void
  // eslint-disable-next-line
  handlePage (evt: any): void
  // eslint-disable-next-line
  handleItemsPerPage (evt: any): void
  handleOptions (evt: IOptions): void
}

interface IComputed {
  loading: boolean
  filtering: boolean
  filteredList: ICandidate[]
  // eslint-disable-next-line
  updatedAt: any
  favourites: string[]
  // eslint-disable-next-line
  headers: any[]
  // eslint-disable-next-line
  items: any[]
}

interface IProps {
  search: string
  filter: IFilter
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  props: {
    search: { type: String },
    // 'list': {type: Array},
    filter: { type: Object }
    // loading: {type: Boolean},
  },
  components: {
    Identicon
  },
  computed: {
    ...mapState('candidate', ['loading', 'filtering', 'filteredList', 'updatedAt', 'favourites']),
    headers () {
      return [
        {
          text: 'Favourite',
          align: 'center',
          sortable: true,
          value: 'favourite',
          width: '5%',
          // eslint-disable-next-line
          filter: (value: any) => {
            if (this.xfilter.favourite) return value
            else return true
          }
        },
        { text: 'Name', align: null, sortable: true, value: 'name', width: '15%' },
        { text: 'Identity', align: null, sortable: true, value: 'identity_name', width: '15%' },
        { text: 'Discovered', align: null, sortable: true, value: 'discoveredAt', width: '10%' },
        {
          text: 'Valid',
          align: 'center',
          sortable: true,
          value: 'valid',
          width: '5%',
          filter: (value: boolean) => {
            // console.debug(this.xfilter, value)
            return (this.xfilter.valid) ? value === true : true
          }
        },
        {
          text: 'Active',
          align: 'center',
          sortable: true,
          value: 'active',
          width: '5%',
          filter: (value: boolean) => {
            // console.debug(this.xfilter, value)
            return (this.xfilter.active) ? value === true : true
          }
        },
        {
          text: 'Rank',
          align: 'center',
          sortable: true,
          value: 'rank',
          width: '5%',
          filter: (value: number) => {
            if (!this.xfilter.rank) return true
            return value >= parseInt(this.xfilter.rank)
          }
        },
        {
          text: 'Score',
          align: 'center',
          sortable: true,
          value: 'score',
          width: '5%',
          filter: (value: number) => {
            if (!this.xfilter.score) return true
            // return value >= parseInt(this.xfilter.score)
            return value >= this.xfilter.score
          }
        }
      ]
    },
    items () {
      const list = this.filteredList as ICandidate[]
      return list.map((item: ICandidate) => {
        return {
          favourite: this.favourites.includes(item.stash),
          stash: item.stash,
          name: item.name,
          identity_name: item.identity.name,
          discoveredAt: item.discoveredAt,
          valid: item.valid,
          active: item.active,
          rank: item.rank,
          score: item.score?.total
        } as IFilteredListItem
      })
    }
  },
  // eslint-disable-next-line
  data (): any {
    return {
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: []
      },
      xfilter: {
        favourite: false,
        rank: '',
        score: 0,
        valid: false,
        active: false
      }
    }
  },
  methods: {
    isValid (items: ICandidateValidityItem[]) {
      const invalid = items.find((i: ICandidateValidityItem) => i.valid === false)
      return !invalid
    },
    timeAgo (d: string): string {
      return moment(d).fromNow()
    },
    clickItem (item: IFilteredListItem) {
      this.$emit('click-item', item)
    },
    toggleFav (item: IFilteredListItem) {
      this.$store.dispatch('candidate/toggleFav', item.stash)
    },
    handlePaginate (evt: IPaginate) {
      // console.debug(evt)
      this.$store.dispatch('candidate/paginate', evt)
    },
    // eslint-disable-next-line
    handlePage (evt: any) {
      if (!evt) console.debug(evt)
    },
    // eslint-disable-next-line
    handleItemsPerPage (evt: any) {
      console.debug(evt)
    },
    handleOptions (evt: IOptions) {
      this.$store.dispatch('candidate/handleOptions', evt)
    }
  },
  created () {
    this.options = this.$store.state.candidate.options
  }
})
</script>

<style scoped>
.identicon {
    width: 18px;
    max-width: 18px;
    height: 18px;
    max-height: 18px;
    /* white-space:nowrap; */
    display: inline-block;
}
</style>
