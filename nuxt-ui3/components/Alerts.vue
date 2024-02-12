<template>

  <v-menu offset-y
    right
    :close-on-content-click="false">

    <template v-slot:activator="{ props }">
      <v-btn
        small icon
        v-bind="props"
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
        <template v-slot:prepend>
        <!-- <v-list-item-icon> -->
          <v-icon :color="item.type">mdi-alert</v-icon>
        <!-- </v-list-item-icon> -->
      </template>
        <!-- <v-list-item-content> -->
          <v-list-item-title>{{item.title}}</v-list-item-title>
          <v-list-item-subtitle>{{item.text}}</v-list-item-subtitle>
        <!-- </v-list-item-content> -->
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
import { defineComponent, ref, watch } from 'vue'
import moment from 'moment'

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  text: string
}

export default defineComponent({
  name: 'Alerts',
  setup () {
    const store = useStore()
    const alerts: any[] = store.alerts
    const snackbar = ref(false)
    const text = ref('')
    const timeout = ref(2000)
    // const test = (type: string) => {
    //   store.dispatch('addAlert', { id: moment().valueOf(), type: type, text: 'this is a test' })
    // }
    const delAlert = (item: IAlert) => {
      // store.dispatch('clearAlert', item)
      store.clearAlert(item)
    }
    watch(() => alerts, (newVal, oldVal) => {
      console.debug(newVal, oldVal)
        newVal.forEach((a: IAlert) => {
          if (!oldVal.find((f: IAlert) => f.id === a.id)) {
            console.debug('new', a)
            text.value = a.text
            snackbar.value = true
          }
        })
    })
    return {
      alerts,
      snackbar,
      text,
      timeout,
      // test,
      delAlert,
    }
  }
})
</script>
