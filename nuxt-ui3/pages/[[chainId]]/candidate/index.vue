<template>
  <Candidates></Candidates>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'
import Candidates from '~/components/Candidates.vue';

export default defineComponent({
  components: {
    Candidates
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const chainId = computed(() => store.chainId)

    onBeforeMount(() => {
      console.debug('[[chainId]]/candidate/index.vue: onBeforeMount()', chainId.value)
      if (chainId.value !== route.params.chainId?.toString()) {
        store.setChainId(route.params.chainId?.toString())
        router.push({ path: `/${chainId.value}/candidate` })
      }
    })

    return {
      chainId,
    }
  }
})
</script>
