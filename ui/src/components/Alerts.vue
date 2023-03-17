<template>

  <v-menu offset-y
    right
    :close-on-content-click="false">

    <template v-slot:activator="{ on, attrs }">
      <v-btn
        small icon
        v-bind="attrs"
        v-on="on"
        >
        <v-badge
          :content="alerts.length"
          :value="alerts.length"
          bordered
          overlap
        >
          <v-icon :color="alerts.length > 0 ? 'primary' : ''">mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-list>

      <v-list-item v-for="item in alerts" v-bind:key="item.id">
        <v-list-item-icon>
          <v-icon :color="item.type">mdi-alert</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{item.title}}</v-list-item-title>
          <v-list-item-subtitle>{{item.text}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn small icon @click="delAlert(item)"><v-icon>mdi-close</v-icon></v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-list-item v-show="alerts.length===0">
        No alerts
      </v-list-item>
      <!-- <v-list-item v-show="alerts.length===0">
        <v-btn @click="test('info')">Info</v-btn>
        <v-btn @click="test('warning')">Warn</v-btn>
        <v-btn @click="test('error')">Error</v-btn>
      </v-list-item> -->
    </v-list>

  </v-menu>

</template>

<script lang="ts">
import moment from 'moment'
import { mapState } from 'vuex'
import { defineComponent } from 'vue'

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  text: string
}

export default defineComponent({
  name: 'Alerts',
  computed: {
    ...mapState(['alerts'])
  },
  data () {
    return {
      snackbar: false,
      text: '',
      timeout: 2000
    }
  },
  watch: {
    alerts: {
      deep: true,
      handler (newval, oldval) {
        console.debug(newval, oldval)
        newval.forEach((a: IAlert) => {
          if (!oldval.find((f: IAlert) => f.id === a.id)) {
            console.debug('new', a)
            this.text = a.text
            this.snackbar = true
          }
        })
      }
    }
  },
  methods: {
    test (type: string) {
      this.$store.dispatch('addAlert', { id: moment().valueOf(), type: type, text: 'this is a test' })
    },
    delAlert (item: IAlert) {
      this.$store.dispatch('clearAlert', item)
    }
  }
})
</script>
