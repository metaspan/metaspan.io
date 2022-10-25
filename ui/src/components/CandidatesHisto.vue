<template>
  <v-container :loading="loading" fluid>
    <div id="histo"></div>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Candidates',
  computed: {
    ...mapState('candidate', ['loading','list', 'updatedAt','favourites']),
    // headers() { return [
    //   { text: 'Favourite', align:'center', sortable: true, value: "favourite", width:"5%",
    //     filter: value => {
    //       if(this.xfilter.favourite) return value
    //       else return true
    //     }
    //   },
    //   { text: 'Name', align:null, sortable: true, value: "name", width:"25%" },
    //   { text: 'Discovered', align:null, sortable: true, value: "discoveredAt", width:"10%" },
    //   { text: 'Valid', align:'center', sortable: true, value: "valid", width:"5%", 
    //     filter: value => {
    //       // console.debug(this.xfilter, value)
    //       if(this.xfilter.valid=="0") return true
    //       if(this.xfilter.valid=="1" && value) return true
    //       if(this.xfilter.valid=="2" && !value) return true
    //       return false
    //     }
    //   },
    //   { text: 'Active', align:'center', sortable: true, value: "active", width:"5%",
    //     filter: value => {
    //       // console.debug(this.xfilter, value)
    //       if(this.xfilter.active=="0") return true
    //       if(this.xfilter.active=="1" && value) return true
    //       if(this.xfilter.active=="2" && !value) return true
    //       return false
    //     }
    //   },
    //   { text: 'Rank', align:'center', sortable: true, value: "rank", width:"5%", filter: value => {
    //       if (!this.xfilter.rank) return true
    //       return value >= parseInt(this.xfilter.rank)
    //     },
    //   },
    //   { text: 'Score', align:'center', sortable: true, value: "score", width:"5%" },
    // ]},
    items() {
      return this.list.map(item => { return {
        favourite: this.favourites.includes(item.stash),
        stash: item.stash,
        name: item.name,
        discoveredAt: item.discoveredAt,
        valid: this.isValid(item.validity),
        active: item.active, 
        rank: item.rank, 
        score: item.score?.total
      }})
    },
    // updated() { return moment(this.updatedAt).format(this.dateTimeFormat) },
  },
  data: () => ({
    // dateTimeFormat: 'YYYY/MM/DD hh:mm',
    // search: '',
    // options: {
    //   page: 1,
    //   itemsPerPage: 10,
    //   sortBy: [],
    //   sortDesc: [],
    // },
    // xfilter: {
    //   favourite: false,
    //   rank: '',
    //   valid: "0",
    //   active: "0",
    // },
  }),
  watch: {
    // xfilter: {
    //   deep: true,
    //   handler(newval, oldval) {
    //     if(oldval == false) console.debug(newval, oldval)
    //     this.$store.dispatch('candidate/handleFilter', newval)
    //   },
    // },
  },
  methods: {
    // isValid(items=[]) {
    //   let invalid = items.find(i => i.valid == false)
    //   return !invalid
    // },
    // formatDate(d) {
    //   return moment(d).format(this.dateTimeFormat)
    // },
    // timeAgo(d) {
    //   return moment(d).fromNow()
    // },
    // reload() {
    //   this.$store.dispatch("candidate/init")
    // },
    // customFilter(value, search, item) {
    //   // console.debug(value, search, item)
    //   if((this.xfilter.valid == 2 && item.valid) || (this.xfilter.valid == 1 && !item.valid)) return false
    //   if((this.xfilter.active == 2 && item.active) || (this.xfilter.active == 1 && !item.active)) return false
    //   if(this.search != "") if(item.name.toLocaleUpperCase().includes(this.search.toLocaleUpperCase())) return true
    //   else return true
    //   return false
    // },
    // filterOnlyCapsText (value, search, item) {
    //   console.debug(value, search, item)
    //   return value != null &&
    //     search != null &&
    //     typeof value === 'string' &&
    //     value.toString().toLocaleUpperCase().indexOf(search) !== -1
    // },
    // toggleFav(item) {
    //   this.$store.dispatch('candidate/toggleFav', item.stash)
    // },
    // handlePaginate(evt) {
    //     console.debug(evt)
    //     this.$store.dispatch('candidate/paginate', evt)
    // },
    // handlePage(evt) {
    //     console.debug(evt)
    // },
    // handleItemsPerPage(evt) {
    //     console.debug(evt)
    // },
    // handleOptions(evt) {
    //     this.$store.dispatch('candidate/handleOptions', evt)
    // },
    // gotoCandidate(item) {
    //   // console.debug('gotoCandidate', item)
    //   this.$store.dispatch('candidate/setCandidate', item.stash)
    //   this.$router.push("/candidate/"+item.stash)
    // },
  },
  created() {
    // this.options = this.$store.state.candidate.options //.pagination.page
    // // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage
    // this.xfilter = this.$store.state.candidate.filter
  },
  mounted() {
    // console.debug("List mounted")
    // this.$store.dispatch("init")

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = window.innerWidth - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#histo")
      .append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    var data = this.$store.state.candidate.list.map(m => m.rank).sort(function(a,b) {return a-b})
    // console.debug('length', data.length)
    // var udata = [...new Set(data)]
    // udata = udata.slice(udata.length*0.055, udata.length*0.854)
    // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
    // // console.debug('ranks', data)

    // X axis: scale and draw:
    var x = d3.scaleLinear()
      // .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .domain([d3.min(data, d=>d), d3.max(data, d=>d )])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    // var histogram = d3.histogram()
    //   .value(function(d) { return d; })   // I need to give the vector of value
    //   .domain(x.domain())  // then the domain of the graphic
    //   .thresholds(x.ticks(70)); // then the numbers of bins
    const numberOfBins = 25;
    const thresholdArr = [...Array(numberOfBins)].map(
      (item, i) => (x.domain()[1] / numberOfBins) * i
    );
    var histogram = d3
      .bin()
      .value(d => d)
      .domain(x.domain())
      .thresholds(thresholdArr)
      // .thresholds(10)

    var bins = histogram(data)
    // console.debug('bins', bins)

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})
          // .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})

    // Append a vertical line to highlight the separation
    // svg
    //   .append("line")
    //     .attr("x1", x(140) )
    //     .attr("x2", x(140) )
    //     .attr("y1", y(0))
    //     .attr("y2", y(1600))
    //     .attr("stroke", "grey")
    //     .attr("stroke-dasharray", "4")
    // svg
    //   .append("text")
    //   .attr("x", x(190))
    //   .attr("y", y(1400))
    //   .text("threshold: 140")
    //   .style("font-size", "15px")
  },
  mounted() {
        // console.debug("List mounted")
    // this.$store.dispatch("init")

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
    //   .domain([d3.min(data, d=>d), d3.max(data, d=>d )])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
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
    // console.debug('bins', bins)

    // // Y axis: scale and draw:
    // var y = d3.scaleLinear()
    //     .range([height, 0]);
    // y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // // append the bar rectangles to the svg element
    // svg.selectAll("rect")
    //     .data(bins)
    //     .enter()
    //     .append("rect")
    //       .attr("x", 1)
    //       .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    //       .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    //       .attr("height", function(d) { return height - y(d.length); })
    //       .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})
    //       // .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})

    // // Append a vertical line to highlight the separation
    // // svg
    // //   .append("line")
    // //     .attr("x1", x(140) )
    // //     .attr("x2", x(140) )
    // //     .attr("y1", y(0))
    // //     .attr("y2", y(1600))
    // //     .attr("stroke", "grey")
    // //     .attr("stroke-dasharray", "4")
    // // svg
    // //   .append("text")
    // //   .attr("x", x(190))
    // //   .attr("y", y(1400))
    // //   .text("threshold: 140")
    // //   .style("font-size", "15px")

  }
}
</script>
