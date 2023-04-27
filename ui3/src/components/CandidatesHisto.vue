<template>
  <v-container :loading="loading" fluid>
    <div id="histo"></div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import {mapState} from 'vuex'
// import * as d3 from 'd3'

export default defineComponent({
  name: 'Candidates',
  setup () {

  },
  computed: {
    ...mapState('candidate', ['loading','list', 'updatedAt','favourites']),
    items() {
      return this.list.map((item: any) => { return {
        // favourite: this.favourites.includes(item.stash),
        // stash: item.stash,
        // name: item.name,
        // discoveredAt: item.discoveredAt,
        // valid: this.isValid(item.validity),
        // active: item.active, 
        // rank: item.rank, 
        // score: item.score?.total
      }})
    },
    // updated() { return moment(this.updatedAt).format(this.dateTimeFormat) },
  },
  mounted() {
    // var margin = {top: 10, right: 30, bottom: 30, left: 40},
    //   width = window.innerWidth - margin.left - margin.right,
    //   height = 300 - margin.top - margin.bottom;

    // var svg = d3.select("#histo")
    //   .append('svg')
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append('g')
    //   .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // var data = this.$store.state.candidate.list.map(m => m.rank).sort(function(a,b) {return a-b})
    // // console.debug('length', data.length)
    // // var udata = [...new Set(data)]
    // // udata = udata.slice(udata.length*0.055, udata.length*0.854)
    // // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
    // // // console.debug('ranks', data)

    // // X axis: scale and draw:
    // var x = d3.scaleLinear()
    //   // .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    //   .domain([d3.min(data, (d: any)=>d), d3.max(data, (d: any)=>d )])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    //   .range([0, width]);

    // svg.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));
    
    // // var histogram = d3.histogram()
    // //   .value(function(d) { return d; })   // I need to give the vector of value
    // //   .domain(x.domain())  // then the domain of the graphic
    // //   .thresholds(x.ticks(70)); // then the numbers of bins
    // const numberOfBins = 25;
    // const thresholdArr = [...Array(numberOfBins)].map(
    //   (item, i) => (x.domain()[1] / numberOfBins) * i
    // );
    // var histogram = d3
    //   .bin()
    //   .value(d => d)
    //   .domain(x.domain())
    //   .thresholds(thresholdArr)
    //   // .thresholds(10)

    // var bins = histogram(data)
    // // console.debug('bins', bins)

    // // Y axis: scale and draw:
    // var y = d3.scaleLinear()
    //     .range([height, 0]);
    // y.domain([0, d3.max(bins, function(d: any) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // // append the bar rectangles to the svg element
    // svg.selectAll("rect")
    //     .data(bins)
    //     .enter()
    //     .append("rect")
    //       .attr("x", 1)
    //       .attr("transform", function(d: any) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    //       .attr("width", function(d: any) { return x(d.x1) - x(d.x0) -1 ; })
    //       .attr("height", function(d: any) { return height - y(d.length); })
    //       .style("fill", function(d: any){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})
    //       // .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})
  }
})
</script>
