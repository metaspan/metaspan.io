<template>
  <v-container fluid>

    <v-toolbar flat>
      <v-toolbar-title>Docs</v-toolbar-title>
    </v-toolbar>

    <v-card>
      <v-card-text>
      <p>This is an experimental object browser for exploring the polkadot.js api object.</p>
      <p>The polkadot.js api documantation is available <a href="https://polkadot.js.org/docs/api/start/api.query/" target="_blank">here.</a></p>
      <p>Javascript Introspection is not complete, and won't ever be complete - it's not a goal of the language</p>
      </v-card-text>
    </v-card>

    <!-- <Main></Main> -->

    <!-- <v-btn text class="text-none" @click="deselect()">Polkadot</v-btn> -->

    <!-- {{level}} -->
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-btn small outlined class="text-none" v-if="item.level===0" @click="deselect()">{{ item.text }}</v-btn>
        <v-btn small outlined class="text-none" v-if="item.level!==0" @click="deselect(item)">{{ item.text }}</v-btn>
      </template>
    </v-breadcrumbs>

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Attributes:</v-list-item-title>
          <v-list-item-subtitle>
            <!-- {{ Object.keys(parsed.attributes) }} -->
            <v-row>
              <v-col v-for="(att, idx) in Object.keys(parsed.attributes)" v-bind:key="idx">
                <v-btn text class="text-none" outlined
                  @click="select(att)">{{ att }}</v-btn>
              </v-col>
            </v-row>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Methods:</v-list-item-title>
          <v-list-item-subtitle>
            <!-- {{ Object.keys(parsed.attributes) }} -->
            <v-col v-for="method in parsed.methods" v-bind:key="method.name">
              <span text class="text-none" outlined
                @click="selectMethod(method.name)">{{ method.name }}()<br>
                {{method.docs}}</span>
            </v-col>
        </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-row>
      <!-- Keys: {{ Object.keys(parsed) }} -->
    </v-row>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
// import Main from '../views/apidocs/Main.vue'

interface IBreadCrumb {
  disabled?: boolean
  text: string
  type: string
  level: number
}

interface IData {
  loading: boolean
  level: number
  // eslint-disable-next-line
  parsed: any
  breadcrumbs: IBreadCrumb[]
  // eslint-disable-next-line
  obj: any
}

interface IComputed {
  // eslint-disable-next-line
  object: any
  // methods: any[]
}

interface IMethods {
  // eslint-disable-next-line
  select (v: any, l: number): void
  // eslint-disable-next-line
  selectMethod (v: any, l: number): void
  // eslint-disable-next-line
  deselect (v: any): void
  // eslint-disable-next-line
  parseObj (v: any, className: string|boolean|null, depth: number|null): void
  parseBreadCrumbs (): void
  // eslint-disable-next-line
  getFunctionDocs (func: any): string[]
}
// eslint-disable-next-line
// interface IProps {}

interface IObj {
  class: string
  // constructor: {},
  // eslint-disable-next-line
  methods: Record<string, any>
  // eslint-disable-next-line
  attributes: Record<string, any>
  // eslint-disable-next-line
  children: Record<string, any>
}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'Docs',
  components: {
    // Main
  },
  computed: {
    object () {
      return this.obj
    }
    // methods () {
    //   return 'tbc'
    // }
  },
  data () {
    return {
      loading: false,
      breadcrumbs: [
        { text: 'Polkadot', disabled: true, type: 'object', level: 0 }
      ],
      obj: 'api',
      level: 1,
      parsed: {}
    }
  },
  watch: {
    obj (val) {
      this.loading = true
      this.parseObj(this.$polkadot.api[val], null, null)
      this.loading = false
    }
  },
  methods: {
    // eslint-disable-next-line
    select (att: any) {
      this.level += 1
      // console.debug(att, level, this.parsed[att])
      this.breadcrumbs.push({ text: att, type: 'attribute', level: this.level })
      var obj = this.$polkadot
      this.breadcrumbs.forEach((b: IBreadCrumb, idx: number) => {
        if (idx !== 0) obj = obj[b.text]
      })
      this.parsed = this.parseObj(obj, null, null)
    },
    // eslint-disable-next-line
    async selectMethod (att: any) {
      this.level += 1
      console.debug(att)
      var obj = this.$polkadot
      for (var i = 1; i < this.breadcrumbs.length; i++) {
        // console.debug('::', this.breadcrumbs[i].text)
        obj = obj[this.breadcrumbs[i].text]
      }
      // console.debug(obj[att].toString())
      // console.debug(JSON.stringify(obj[att]))
      const test = await obj[att]()
      console.debug('test:', test.toString())
      this.breadcrumbs.push({ text: att, type: 'method', level: this.level })
      this.parseBreadCrumbs()
    },
    // eslint-disable-next-line
    getFunctionDocs (func: any): string[] {
      interface IFuncMeta {
        // eslint-disable-next-line
        storage: any
        name: string
        modifier: string
        // eslint-disable-next-line
        type: any
        fallback: string
        docs: string[]
      }
      // const example = {
      //   "storage":{"method":"BlockHash","prefix":"System","section":"system"},
      //   "name":"BlockHash",
      //   "modifier":"Default",
      //   "type":{"map":{"hashers":["Twox64Concat"],"key":4,"value":9}},
      //   "fallback":"0x0000000000000000000000000000000000000000000000000000000000000000",
      //   "docs":[" Map of block numbers to block hashes."]
      // }
      var tmp = JSON.stringify(func)
      // console.debug('tmp', tmp)
      const meta: IFuncMeta = JSON.parse(tmp)
      // console.debug('meta', meta)
      return meta.docs
    },
    // eslint-disable-next-line
    deselect (evt: any) {
      console.debug(evt)
      if (!evt) {
        this.level = 1
        this.breadcrumbs = [{ text: 'Polkadot', disabled: true, type: 'object', level: 0 }]
        this.parsed = this.parseObj(this.$polkadot, false, 1)
      } else {
        console.debug(evt)
        this.level = evt.level
        for (var i = this.breadcrumbs.length; i > evt.level; i--) {
          this.breadcrumbs.pop()
        }
        this.parseBreadCrumbs()
      }
    },
    parseBreadCrumbs () {
      var obj = this.$polkadot
      for (var i = 1; i < this.breadcrumbs.length; i++) {
        console.debug('::', this.breadcrumbs[i].text)
        obj = obj[this.breadcrumbs[i].text]
      }
      // this.breadcrumbs.forEach ((b: IBreadCrumb) => {  })
      this.parsed = this.parseObj(obj, null, null)
    },
    // eslint-disable-next-line
    parseObj (obj: any, className = false, depth = 1) {
      var ret = {
        // parseType: type,
        class: className || obj.name,
        // constructor: {},
        methods: {},
        attributes: {},
        children: {}
      } as IObj
      Object.keys(obj).forEach((k: string) => {
        try {
          // console.log('key:', k, typeof obj[k])
          switch (typeof obj[k]) {
            case 'object': // [] or {}
              if (Array.isArray(obj[k])) {
                ret.children[k] = depth ? this.parseObj(obj[k], false, depth - 1) : 'Array'
              } else {
                ret.attributes[k] = depth ? this.parseObj(obj[k], false, depth - 1) : 'Object'
              }
              break
            case 'function':
              // console.debug(`${k}: is a function`)
              ret.methods[k] = { name: k, docs: this.getFunctionDocs(obj[k]) }
              break
            // case 'String':
            // case 'undefined':
            // case 'null':
            case 'string':
              ret.attributes[k] = 'string'
              break
            case 'number':
              ret.attributes[k] = 'number'
              break
            case 'boolean':
              ret.attributes[k] = 'boolean'
              break
            default:
              console.debug(`${k}: is default: ${typeof obj[k]}`)
              ret.attributes[k] = obj[k]
          }
        } catch (err) {
          // console.log('ERROR at ', k)
          ret.attributes[k] = 'undefined?'
        }
      })
      // console.debug('ret', ret)
      return ret
    }
  },
  mounted () {
    this.parsed = this.parseObj(this.$polkadot, false, 1)
  }
})
</script>
