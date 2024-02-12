<template>
  <Candidate />
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'

import Candidate from '@/components/Candidate.vue'

export default defineComponent({
  components: {
    Candidate
  },
  watchQuery: ['page'],
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const chainId = computed(() => store.chainId)
    const candidateStore = useCandidateStore()
    const stash = computed(() => route.params.stash.toString())

    onBeforeMount(async () => {
      console.debug('[[chainId]]/candidate/[[stash]].vue: onBeforeMount()', chainId.value, stash.value)
      if (!stash.value || stash.value === '') {
        // remove the trailing slash
        console.debug(`..redirecting to /${chainId.value}/candidate`)
        await router.isReady()
        router.push({
          // path: `/${chainId.value}/candidate`,
          name: `chainId-candidate`,
          params: { chainId: chainId.value }
        })
      // } else {
      //   console.debug('[[chainId]]/candidate/[[stash]].vue: onBeforeMount() stash:', `|${stash.value}|`)
      }
    })

    return {
      stash,
    }
  }
})
</script>
