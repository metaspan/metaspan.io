<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-item>
        <!-- <v-btn @click="refresh()">Refresh</v-btn> -->
      </v-toolbar-item>
    </v-toolbar>
    <!-- {{ list }} -->
    <!-- <div id="sigma-container"></div> -->
    <canvas></canvas>
    <!-- {{ validators }} -->
  </v-container>
</template>

<script lang="ts">
// import { defineComponent } from 'vue'
// import gql from 'graphql-tag'
// import { mapState } from 'vuex'

// import Graph from 'graphology'
// import Sigma from 'sigma'
// import chroma from 'chroma-js'
// import { v4 as uuid } from 'uuid'

// // import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image'
// // import NodeProgramBorder from './node.border'

// import ForceSupervisor from 'graphology-layout-force/worker'

// // import Chart from 'chart.js'
// // import {  } from 'vue-chartjs'
// import { Chart as ChartJS, LinearScale, PointElement } from 'chart.js'
// import { ForceDirectedGraphController, EdgeLine } from 'chartjs-chart-graph'
// ChartJS.register(ForceDirectedGraphController, EdgeLine, LinearScale, PointElement)

// const container = document.getElementById('sigma-container') as HTMLElement
// const graph = new Graph()
// const RED = '#FA4F40'
// const BLUE = '#727EE0'
// const GREEN = '#5DB346'

// const query = gql(`query getIdentities($chain: String!, $offset: Int, $limit: Int)  {
//   Nominators(chain: $chain, offset: $offset, limit: $limit) {
//     accountId
//     targets {
//       stash
//       updatedAt
//     }
//   }
// }`)

// export default defineComponent({
//   name: '',
//   computed: {
//     ...mapState(['chainId'])
//   },
//   data () {
//     return {
//       list: [] as any[],
//       nominators: new Map(), // [] as any[],
//       validators: new Map(), // [] as any[],
//       edges: [] as any[]
//     }
//   },
//   methods: {
//     async refresh () {
//       await this.getData()
//       await this.getBalances()
//       this.render()
//     },
//     async getData () {
//       this.list = []
//       this.nominators.clear() //  = []
//       this.validators.clear() //  = []
//       this.edges = []
//       console.debug('getData()')
//       // this.$apolloProvider.defaultClient.query(query)
//       // query the api in batches of 100
//       let hasMore = true
//       let offset = 0
//       while (hasMore === true) {
//         const res = await this.$apollo.query({
//           query: query,
//           variables: {
//             chain: this.chainId,
//             offset: offset,
//             limit: 100
//             // stash: this.stash
//             // ids: chunk
//           }
//         })
//         // this.list = list as any[]
//         // console.debug(res.data)
//         if (res.data?.Nominators) {
//           this.list.push(...res.data.Nominators)
//           if (res.data.Nominators?.length < 100) {
//             hasMore = false
//           } else {
//             offset += 100
//           }
//         } else {
//           hasMore = false
//         }
//       }

//       // collect validators
//       for (let i = 0; i < this.list.length; i++) {
//         const nom = this.list[i]
//         if (!this.nominators.has(nom.accountId)) this.nominators.set(nom.accountId, nom)
//         for (let j = 0; j < nom.targets.length; j++) {
//           const val = nom.targets[j]
//           // console.debug(`${nom.accountId} : ${val.stash}`)
//           if (!this.validators.has(val.stash)) this.validators.set(val.stash, val)
//           const edge = [nom.accountId, val.stash]
//           if (!this.edges.includes(edge)) this.edges.push(edge)
//         }
//       }
//     },
//     async getBalances () {
//       this.nominators.forEach(async (nom: any, accountId: string) => {
//         const account = await this.$substrate[this.chainId].query.balances.account(accountId)
//         console.debug(accountId, account.toJSON())
//       })
//     },
//     render () {
//       console.debug('render()')
//       const container = document.getElementById('sigma-container') as HTMLElement

//       // Create a sample graph
//       const graph = new Graph()
//       // graph.addNode('n1', { x: 0, y: 0, size: 10, color: chroma.random().hex() })
//       // graph.addNode('n2', { x: -5, y: 5, size: 10, color: chroma.random().hex() })
//       // graph.addNode('n3', { x: 5, y: 5, size: 10, color: chroma.random().hex() })
//       // graph.addNode('n4', { x: 0, y: 10, size: 10, color: chroma.random().hex() })
//       this.nominators.forEach((nom: any) => {
//         console.debug(nom)
//         graph.addNode(nom, { x: 0, y: 10, size: 5, color: chroma.random().hex() })
//       })
//       this.validators.forEach((val: any) => {
//         graph.addNode(val, { x: 0, y: 10, size: 10, color: chroma.random().hex() })
//       })
//       // graph.addEdge('n1', 'n2')
//       // graph.addEdge('n2', 'n4')
//       // graph.addEdge('n4', 'n3')
//       // graph.addEdge('n3', 'n1')
//       this.edges.forEach((edge: any) => {
//         console.debug(edge)
//         graph.addEdge(edge[0], edge[1])
//       })

//       // Create the spring layout and start it
//       const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted })
//       layout.start()

//       // Create the sigma
//       const renderer = new Sigma(graph, container)

//       // Drag'n'drop feature
//       // ~~~~~~~~~~~~~~~~~~~

//       // State for drag'n'drop
//       let draggedNode: string | null = null
//       let isDragging = false

//       // On mouse down on a node
//       //  - we enable the drag mode
//       //  - save in the dragged node in the state
//       //  - highlight the node
//       //  - disable the camera so its state is not updated
//       renderer.on('downNode', (e) => {
//         isDragging = true
//         draggedNode = e.node
//         graph.setNodeAttribute(draggedNode, 'highlighted', true)
//       })

//       // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
//       renderer.getMouseCaptor().on('mousemovebody', (e) => {
//         if (!isDragging || !draggedNode) return
//         // Get new position of node
//         const pos = renderer.viewportToGraph(e)
//         graph.setNodeAttribute(draggedNode, 'x', pos.x)
//         graph.setNodeAttribute(draggedNode, 'y', pos.y)
//         // Prevent sigma to move camera:
//         e.preventSigmaDefault()
//         e.original.preventDefault()
//         e.original.stopPropagation()
//       })

//       // On mouse up, we reset the autoscale and the dragging mode
//       renderer.getMouseCaptor().on('mouseup', () => {
//         if (draggedNode) {
//           graph.removeNodeAttribute(draggedNode, 'highlighted')
//         }
//         isDragging = false
//         draggedNode = null
//       })

//       // Disable the autoscale at the first down interaction
//       renderer.getMouseCaptor().on('mousedown', () => {
//         if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox())
//       })

//       //
//       // Create node (and edge) by click
//       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//       // When clicking on the stage, we add a new node and connect it to the closest node
//       renderer.on('clickStage', ({ event }: { event: { x: number, y: number } }) => {
//         // Sigma (ie. graph) and screen (viewport) coordinates are not the same.
//         // So we need to translate the screen x & y coordinates to the graph one by calling the sigma helper `viewportToGraph`
//         const coordForGraph = renderer.viewportToGraph({ x: event.x, y: event.y })
//         // We create a new node
//         const node = {
//           ...coordForGraph,
//           size: 10,
//           color: chroma.random().hex()
//         }

//         // Searching the two closest nodes to auto-create an edge to it
//         const closestNodes = graph
//           .nodes()
//           .map((nodeId) => {
//             const attrs = graph.getNodeAttributes(nodeId)
//             const distance = Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2)
//             return { nodeId, distance }
//           })
//           .sort((a, b) => a.distance - b.distance)
//           .slice(0, 2)
//         // We register the new node into graphology instance
//         const id = uuid()
//         graph.addNode(id, node)
//         // We create the edges
//         closestNodes.forEach((e) => graph.addEdge(id, e.nodeId))
//       })
//     }
//   },
//   async mounted () {
//     console.debug('Network.vue: mounted')
//     // this.getData()
//     // // this.render()
//     // const data = `https://raw.githubusercontent.com/sgratzl/chartjs-chart-graph/master/samples/miserables.json`
//     // //fetch(data).then((r) => r.json()).then((data) => {
//     // const ctx = document.querySelector("canvas")?.getContext("2d") || new HTMLElement() as ChartItem
//     // new ChartJS(ctx, {
//     //   type: 'forceDirectedGraph',
//     //   data: {
//     //     labels: data.nodes.map((d) => d.id),
//     //     datasets: [{
//     //       pointBackgroundColor: 'steelblue',
//     //       pointRadius: 5,
//     //       data: data.nodes,
//     //       edges: data.links
//     //     }]
//     //   },
//     //   options: {
//     //     legend: {
//     //       display: false
//     //     }
//     //   }
//     // })
//     // //});
//   }
// })
</script>

<style scoped>
canvas {
  width: 100vw;
}

#sigma-container {
  height: 600px;
  width: 100vw; /*800px;*/
  background: white;
}
</style>
