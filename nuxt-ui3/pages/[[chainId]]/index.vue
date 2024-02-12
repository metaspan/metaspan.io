<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Chain root for {{ chainId }}</v-toolbar-title>
    </v-toolbar>
    <nuxt-page></nuxt-page>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'

export default defineComponent({
  setup () {
    const store = useStore()
    const route = useRoute()
    const chainId = computed(() => store.chainId)
    const router = useRouter()

    onBeforeMount(() => {
      console.debug('[[chainId]]/index.vue: onBeforeMount()')
      if (chainId.value !== route.params.chainId.toString()) {
        store.setChainId(route.params.chainId.toString())
      }
      router.push({ path: `/${chainId.value}/candidate` })
    })
    
    return {
      chainId,
    }
  }
})
</script>
