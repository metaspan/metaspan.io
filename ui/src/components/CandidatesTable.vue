<template>

  <v-data-table dense :loading="loading"
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

    <template v-slot:item.favourite="{item}">
      <v-btn small icon @click="toggleFav(item)">
      <v-icon small :color="item.favourite?'orange':'grey'">mdi-star</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.name="{item}">
      <div style="cursor:pointer" @click="clickItem(item)">
        <span class="identicon">
          <Identicon :value="item.stash" :size="16"></Identicon>
        </span> {{item.name}}
      </div>
    </template>

    <template v-slot:item.discoveredAt="{item}">
      {{timeAgo(item.discoveredAt) }}
    </template>

    <template v-slot:item.valid="{item}">
      <div align="center">
      <v-icon small :color="item.valid?'green':'red'">mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon>
      </div>
    </template>

    <template v-slot:item.active="{item}">
      <v-icon small :color="item.active?'green':'grey'">mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon>
    </template>

    <template v-slot:item.score="{item}">
      {{item.score ? item.score.toFixed(2) : 0.00 }}
    </template>

  </v-data-table>

</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
import Vue from 'vue'
import { ICandidate } from '../types/global'

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

interface IData {
  options: IOptions
  xfilter: IFilter
}

interface IMethods {
  isValid(validity: any): boolean
  timeAgo(d: any): string
  clickItem(i: any): void
  toggleFav (item: any): void
  handlePaginate (evt: any): void
  handlePage (evt: any): void
  handleItemsPerPage (evt: any): void
  handleOptions (evt: any): void
}

interface IComputed {
  loading: boolean
  filteredList: ICandidate[]
  updatedAt: any
  favourites: string[]
  headers: any[]
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
    ...mapState('candidate', ['loading', 'filteredList', 'updatedAt', 'favourites']),
    headers () {
      return [
        {
          text: 'Favourite',
          align: 'center',
          sortable: true,
          value: 'favourite',
          width: '5%',
          filter: (value: any) => {
            if (this.xfilter.favourite) return value
            else return true
          }
        },
        { text: 'Name', align: null, sortable: true, value: 'name', width: '25%' },
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
          discoveredAt: item.discoveredAt,
          valid: this.isValid(item.validity),
          active: item.active,
          rank: item.rank,
          score: item.score?.total
        }
      })
    }
  },
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
    isValid (items = []) {
      const invalid = items.find((i: any) => i.valid === false)
      return !invalid
    },
    timeAgo (d: any): string {
      return moment(d).fromNow()
    },
    clickItem (item: any) {
      this.$emit('click-item', item)
    },
    toggleFav (item: any) {
      this.$store.dispatch('candidate/toggleFav', item.stash)
    },
    handlePaginate (evt: any) {
      // console.debug(evt)
      this.$store.dispatch('candidate/paginate', evt)
    },
    handlePage (evt: any) {
      if (!evt) console.debug(evt)
    },
    handleItemsPerPage (evt: any) {
      console.debug(evt)
    },
    handleOptions (evt: any) {
      this.$store.dispatch('candidate/handleOptions', evt)
    }
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
