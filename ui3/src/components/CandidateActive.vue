<template>
  <v-card height="100%" elevation="1" :loading="loading" class="pa-1 ma-1">
    <v-toolbar flat elevation="0" color="#FFFFFF00" density="compact">
      <v-toolbar-title>Active Era Points</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn size="small">
          Depth
        </v-btn>
        <v-select density="compact" v-model="depth" :items="[16,32,64]"></v-select>
        <v-btn icon size="small" @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <Bar
        :loading="loading"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
      <!-- {{ rewardPoints }} -->
      <Loading :loading="loading" :absolute="true" :size="75"></Loading>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject, watch, PropType, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
import { useStore } from 'vuex'
import { hexToString } from '@polkadot/util'
import { SubstrateAPI } from '@/plugins/substrate'
import { ICandidate, IIdentity } from '../types/global'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default defineComponent({
  name: 'CandidateActive',
  components: {
    Bar,
    Loading
  },
  props: {
    candidate: {
      type: Object as PropType<ICandidate>, 
      default: { identity: { judgements: [], info: {} } }
    }
  },
  setup (props) {
    const store = useStore()
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    const chainId = computed(() => store.state.chainId)
    // const candidate = computed(() => store.getters['candidate/candidate'])
    // const candidate = props.candidate
    const model = ref(props.candidate)
    // console.debug('CandidateActive.vue: model', model.value)
    const loading = ref(true)

    // const rewards = ref()
    const depth = ref(16)
    const rewardPoints = ref<Record<number, number>>({})

    const chartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          // onComplete: () => {},
          // delay: (context) => {
          //   console.debug('CandidateActive.vue: animation delay', context)
          // },
          duration: 300, // general animation time
        },
        // hide legend
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    })

    const chartData = computed(() => {
      const labels = Object.keys(rewardPoints.value).map((x) => x.toString())
      console.debug('CandidateActive.vue: labels', labels)
      const data = Object.values(rewardPoints.value)
      console.debug('CandidateActive.vue: data', data)

      return {
        labels: labels,
        datasets: [
          {
            label: 'Era Points',
            backgroundColor: 'green',
            data: data
          }
        ]
      }
    })

    const refresh = async () => {
      loading.value = true
      var activeEra = await substrate.api?.query.staking.activeEra();
      if (activeEra?.isEmpty) {
        console.log('No active era');
        return;
      }
      var activeEra2: any = activeEra?.toJSON() || {};
      console.log(`Active era: ${activeEra2.index}`);

      // look back 32 eras
      var points: Record<number, number> = {};
      for (let i = activeEra2.index; i > activeEra2.index - depth.value; i--) {
        var eraPoints = await substrate.api?.query.staking.erasRewardPoints(i);
        var eraPoints2: any = eraPoints?.toJSON();
        points[i] = eraPoints2.individual[props.candidate.stash] || 0;
        // console.debug(`Era ${i}:`, eraPoints?.toJSON());
      }
      rewardPoints.value = points;
      console.debug('CandidateActive.vue: rewardPoints', rewardPoints.value)
      // const rewards = await substrate.api?.query.staking.erasRewardPoints(activeEra2.index);
      // const rewards2 = rewards?.toJSON()
      // console.debug('CandidateActive.vue: rewards', rewards2)
      // for (const [id, points] of rewards.value.individual?.entries()) {
      //   console.debug('CandidateActive.vue: rewards', id.toString(), points)
      //   // if (id.toString() === validatorId) {
      //   //   return points;
      //   // }
      // }
      loading.value = false
    }

    watch(() => props.candidate, (newVal) => {
      console.debug('CandidateIdentity.vue: watch props.candidate', newVal)
      model.value = newVal
      refresh()
    }, { immediate: true })
    
    watch(() => depth.value, () => {
      refresh()
    })

    onMounted(() => {
      refresh()
    })

    refresh()

    return {
      substrate,
      chainId,
      model,
      depth,
      loading,
      refresh,
      rewardPoints,
      chartOptions,
      chartData
    }
  }
})
</script>
