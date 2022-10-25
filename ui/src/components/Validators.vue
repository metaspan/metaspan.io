<template>
  <v-container :loading="loading" fluid>
    <v-toolbar flat dense>
      <v-toolbar-title>Validators</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn text>
        Updated: {{timeAgo(updatedAt)}}
        </v-btn>
        <v-btn :loading="loading" icon @click="getList()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <!-- {{xfilter}} -->
    <v-toolbar dense flat elevation="0">
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-toolbar-items> -->
        <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
        <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
        <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
        <v-text-field v-model="xfilter.score" label="Score" class="mx-4"></v-text-field>
        <!-- <v-btn rounded> -->
          <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
          <!-- <v-radio-group class='small-radio' v-model="xfilter.valid" label="Valid" row>
            <v-radio small label="All" value="0"></v-radio>
            <v-radio small label="Y" value="1"></v-radio>
            <v-radio small label="N" value="2"></v-radio>
          </v-radio-group> -->
        <!-- </v-btn> -->
        <!-- <v-btn rounded> -->
          <v-switch v-model="xfilter.active" label="Active"></v-switch>
          <!-- <v-radio-group v-model="xfilter.active" label="Active" row>
            <v-radio label="All" value="0"></v-radio>
            <v-radio label="Y" value="1"></v-radio>
            <v-radio label="N" value="2"></v-radio>
          </v-radio-group> -->
        <!-- </v-btn> -->
      <!-- </v-toolbar-items> -->
    </v-toolbar>

    <v-data-table dense :loading="loading"
      :headers="headers"
      :items="items"
      :page="options.page"
      :items-per-page="options.itemsPerPage"
      :sort-by="options.sortBy"
      :sort-desc="options.sortDesc"
      item-key="stash"
      :search="search"
      @pagination="handlePaginate"
      @update:options="handleOptions"
      @update:page="handlePage"
      @update:items-per-page="handleItemsPerPage">

      <!-- <template v-slot:top>
        <v-row>
          <v-col>
            <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
          </v-col>
          <v-col>
            <v-radio-group style="border: 1px dotted grey" v-model="xfilter.valid" label="Valid" row>
              <v-radio label="All" value="0"></v-radio>
              <v-radio label="Y" value="1"></v-radio>
              <v-radio label="N" value="2"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col>
            <v-radio-group v-model="xfilter.active" label="Active" row>
              <v-radio label="All" value="0"></v-radio>
              <v-radio label="Y" value="1"></v-radio>
              <v-radio label="N" value="2"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </template> -->

      <template v-slot:[`item.favourite`]="{item}">
        <v-btn small icon @click="toggleFav(item)">
          <v-icon small :color="item.favourite?'orange':'grey'">mdi-star</v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.name`]="{item}">
        <div style="cursor:pointer" @click="gotoValidator(item)">
          <Identicon class="identicon" :value="item.stash" :size="16"></Identicon> &nbsp;&nbsp;
          <v-btn text class="text-none">{{item.name}}</v-btn>
        </div>
      </template>

      <template v-slot:[`item.discoveredAt`]="{item}">
        <!-- <div align="center"> -->
        {{timeAgo(item.discoveredAt) }}
        <!-- </div> -->
      </template>

      <template v-slot:[`item.valid`]="{item}">
        <div align="center">
          <v-icon small :color="item.valid?'green':'red'">mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon>
        </div>
      </template>

      <template v-slot:[`item.active`]="{item}">
          <v-icon small :color="item.active?'green':'grey'">mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon>
      </template>

      <template v-slot:[`item.totalScore`]="{ item }">
        {{item.score ? item.score.toFixed(2) : 0.00 }}
      </template>

    </v-data-table>

  </v-container>
</template>

<script lang="ts">
import moment from 'moment'
import { mapState } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
import Vue from 'vue'
import { IValidator } from '../types/global'

interface ITableItem {
  favourite: boolean
  stash: string
  name: string
  discoveredAt: number | Date
  // valid: boolean
  // active: boolean
  rank: number
  totalScore: number
}

// eslint-disable-next-line
interface IOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: string[]
}

interface IFilter {
  favourite: boolean
  valid: boolean
  active: boolean
  score: number | null
  rank: number | null
}

interface IData {
  dateTimeFormat: string
  options: IOptions
  xfilter: IFilter
  search: string
}

// type TVueTableHeaderFilter = function(): boolean

interface IVueTableHeader {
  text: string
  align?: string | null
  sortable?: boolean
  value: string
  width?: string
  // eslint-disable-next-line
  filter?: Function
}

interface IComputed {
  loading: boolean
  list: IValidator[]
  updatedAt: number|Date
  favourites: string[]
  headers: IVueTableHeader[]
  items: ITableItem[]
  updated: string
}

interface IMethods {
  // isValid(v: ICandidateValidityItem[]): boolean
  getList(): void
  formatDate(d: string|number, f: string): string
  timeAgo(d: string|number): string
  toggleFav(item: ITableItem): void
// eslint-disable-next-line
  handlePaginate(evt: any): void
// eslint-disable-next-line
  handlePage(evt: any): void
  handleItemsPerPage(evt: Event): void
  handleOptions(evt: IOptions): void
  gotoValidator(item: ITableItem): void
}

interface IProps {
  chain: string
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'Validators',
  components: {
    // ValidatorsHisto,
    Identicon
  },
  props: {
    chain: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('validator', ['loading', 'list', 'updatedAt', 'favourites']),
    headers (): IVueTableHeader[] {
      return [
        {
          text: 'Favourite',
          align: 'center',
          sortable: true,
          value: 'favourite',
          width: '5%',
          filter: (value: boolean) => {
            if (this.xfilter.favourite) return value
            else return true
          }
        },
        { text: 'Name', align: null, sortable: true, value: 'name', width: '25%' },
        { text: 'Discovered', align: null, sortable: true, value: 'discoveredAt', width: '10%' },
        // {
        //   text: 'Valid',
        //   align: 'center',
        //   sortable: true,
        //   value: 'valid',
        //   width: '5%',
        //   filter: (value: boolean) => {
        //     // console.debug(this.xfilter, value)
        //     return (this.xfilter.valid) ? value === true : true
        //   }
        // },
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
            return value >= parseInt(this.xfilter.rank.toString())
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
            return value >= parseInt(this.xfilter.score.toString())
          }
        }
      ]
    },
    items (): ITableItem[] {
      return this.list.map((item: IValidator) => {
        return {
          favourite: this.favourites.includes(item.stash),
          stash: item.stash,
          name: item.StorageKey.toString(), // item.name,
          discoveredAt: item.discoveredAt,
          // valid: this.isValid(item.validity || [{ valid: false }]),
          // active: item.active,
          rank: item.rank,
          totalScore: item.score?.total
        }
      })
    },
    updated () { return moment(this.updatedAt).format(this.dateTimeFormat) }
  },
  data: () => ({
    dateTimeFormat: 'YYYY/MM/DD hh:mm',
    search: '',
    options: {
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: []
    } as IOptions,
    xfilter: {
      favourite: false,
      rank: null,
      score: null,
      valid: false,
      active: false
    } as IFilter
  }),
  watch: {
    search (newval) {
      this.$store.dispatch('validator/setSearch', newval)
    },
    xfilter: {
      deep: true,
      handler (newval, oldval) {
        if (oldval === false) console.debug(newval, oldval)
        this.$store.dispatch('validator/handleFilter', newval)
      }
    }
  },
  methods: {
    // isValid (items: ICandidateValidityItem[]): boolean {
    //   const invalid = items.find((i: ICandidateValidityItem) => i.valid === false)
    //   return !invalid
    // },
    formatDate (d: string|number): string {
      return moment(d).format(this.dateTimeFormat)
    },
    timeAgo (d: string|number): string {
      return moment(d).fromNow()
    },
    async getList () {
      console.debug('getList')
      await this.$store.dispatch('validator/loading', true)
      const era = await this.$substrate.polkadot.api.query.staking.activeEra()
      console.debug('era', era)
      // let vals = await this.$substrate.polkadot.api.query.staking.erasValidatorPrefs.entries(era.value.index)
      // let vals = await this.$substrate.polkadot.api.query.staking.validators(account_hash_stash)
      // let vals = await this.$substrate.polkadot.api.query.session.validators()
      // const vals = await this.$substrate.polkadot.api.query.staking.validators.entries()
      // const vals = await this.$substrate.polkadot.api.query.staking.validators.at(era)
      const countForVals = await this.$substrate.polkadot.api.query.staking.counterForValidators()
      const countForNoms = await this.$substrate.polkadot.api.query.staking.counterForNominators()
      console.debug('vals', countForVals.toNumber(), countForNoms.toNumber())

      const vals = await this.$substrate.polkadot.api.query.session.validators()
      console.debug('vals', vals)

      // await this.$store.dispatch('validator/setList', vals)
      await this.$store.dispatch('validator/loading', false)
    },
    toggleFav (item: ITableItem) {
      this.$store.dispatch('validator/toggleFav', item.stash)
    },
    // eslint-disable-next-line
    handlePaginate (evt: any) {
      // console.debug(evt)
      this.$store.dispatch('validator/paginate', evt)
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
      this.$store.dispatch('validator/handleOptions', evt)
    },
    gotoValidator (item: ITableItem) {
      // console.debug('gotoValidator', item)
      this.$store.dispatch('validator/setValidator', item.stash)
      this.$router.push('/validator/' + item.stash)
    }
  },
  created () {
    console.debug('Validators.vue: chain: ' + this.chain)
    this.options = this.$store.state.validator.options
    // this.itemsPerPage = this.$store.state.validator.pagination.itemsPerPage
    this.xfilter = this.$store.state.validator.filter
    this.search = this.$store.state.validator.search
  },
  async mounted () {
    if (!this.updatedAt || moment(this.updatedAt).diff(moment(), 'seconds') > 15) {
      this.getList()
    // } else {
    //   await this.$store.dispatch('validator/loading', false)
    //   this.$substrate.polkadot.api.query.validators()
    }
    // console.debug("List mounted")
    // this.$store.dispatch("init")
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
