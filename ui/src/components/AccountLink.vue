<template>
  <span>
    <a :href="href" target="_blank">{{textStr}}</a> <sup><v-icon x-small>mdi-open-in-new</v-icon></sup>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
    textStr () { return this.text ? this.text : this.$utils.shortStash(this.accountId) }
  }

})
</script>
