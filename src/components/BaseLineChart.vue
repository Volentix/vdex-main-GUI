<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'BaseLineChart',
  extends: Line,
  mixins: [reactiveProp], // adds reactive prop chartData
  props: {
    options: {
      type: Object,
      required: false,
      default: () => ({
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        responsive: true,
        scales: {
          xAxes: [{
            display: false // this will remove all the x-axis grid lines
          }],
          yAxes: [{
            display: false // this will remove all the x-axis grid lines
          }]
        }
      })
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
    // Trying to set gradient bg for graph
    const gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 450)

    gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
    gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
  }
}
</script>

<style lang="scss">

</style>
