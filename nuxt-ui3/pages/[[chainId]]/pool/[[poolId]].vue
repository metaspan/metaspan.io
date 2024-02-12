<template>
  <Pool :id="poolId"></Pool>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'
import Pool from '@/components/Pool.vue'

export default defineComponent({
  components: {
    Pool
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const chainId = computed(() => store.chainId)
    const poolId = computed(() => route.params.poolId.toString())

    onBeforeMount(() => {
      console.debug('[[chainId]]/pool/[[id]].vue: onBeforeMount()', chainId.value, poolId.value)
      if (chainId.value !== route.params.chainId.toString()) {
        store.setChainId(route.params.chainId.toString())
      }
      if (!poolId.value || poolId.value === '') {
        console.debug(`..redirecting to /${chainId.value}/pool`)
        router.push({
          name: `chainId-pool`,
          params: { chainId: chainId.value }
        })
      }
    })

    return {
      chainId,
      poolId
    }
  }
})

</script>
