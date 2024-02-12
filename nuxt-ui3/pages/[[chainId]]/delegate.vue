<template>
  <OpenGovDelegation :chain-id="chainId"></OpenGovDelegation>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'

import OpenGovDelegation from '~/components/OpenGovDelegation.vue'

export default defineComponent({
  components: {
    OpenGovDelegation
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const chainId = computed(() => store.chainId)

    onBeforeMount(() => {
      console.debug('[[chainId]]/delegate.vue: onBeforeMount()', chainId.value)
    })

    return {
      chainId,
    }
  }
})
</script>
