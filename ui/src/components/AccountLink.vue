<template>
  <span>
    <a :href="href" target="_blank">{{textStr}}</a> <sup><v-icon x-small>mdi-open-in-new</v-icon></sup>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { utilsPluginKey } from '../plugins/utils'
import { shortStash } from '../global/utils'

export default defineComponent({
  // inject: [utilsPluginKey.toString()],
  props: {
    accountId: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: false,
      default: 'account'
    },
    provider: {
      type: String,
      required: false,
      default: 'https://kusama.subscan.io/§role§/§accountId§'
    },
    text: {
      type: String,
      required: false
    }
  },
  computed: {
    href () { return (this.provider).replace('§role§', this.role).replace('§accountId§', this.accountId) },
    textStr () { return this.text ? this.text : shortStash(this.accountId) }
  },
  data: () => {
    return {}
  }

})
</script>
