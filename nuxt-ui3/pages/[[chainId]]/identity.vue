<template>
  <Identities :chain-id="chainId"></Identities>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'
import Identities from '~/components/Identities.vue'

export default defineComponent({
  components: {
    Identities
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const chainId = computed(() => store.chainId)

    onBeforeMount(() => {
      console.debug('[[chainId]]/identity.vue: onBeforeMount()', chainId.value)
    })

    return {
      chainId,
    }
  }
})

</script>