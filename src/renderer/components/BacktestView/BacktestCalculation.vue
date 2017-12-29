<template>
    <v-card class="mb-5 pa-3">
        <div v-for="product in this.$store.state.Backtest.products">
            <highstock :options="getOptions(product.dataset)" style="height: 400px;" ref="highcharts"></highstock>
        </div>
    </v-card>
</template>

<script>
    export default {
        props: [],
        components: {},
        data() {
            return {
                e6: 1,
                hasResult: false
            }
        },
        computed: {
            options: {
                get() {
                    return this.$store.state.Backtest.ohlc
                }
            }
        },
        mounted() {
            this.$root.backtestCharts.push(...this.$refs.highcharts)

            // console.log('a:', this.$root)
            // setInterval(()=>{
            // console.log('b:', this.highcharts)
            // },3000
            // )
        },
        methods: {
            getOptions(key) {
                return {
                    credits: {
                        enabled: false
                    },
                    rangeSelector: {
                        selected: 1,
                        inputEnabled: false
                    },
                    title: {
                        text: key
                    },

                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'OHLC'
                        },
                        height: '100%',
                        lineWidth: 2,
                        resize: {
                            enabled: true
                        }
                    }],

                    tooltip: {
                        valueDecimals: 2
                    },

                    series: [{
                        name: 'MA',
                        data: this.$store.state.Backtest.temp,
                        turboThreshold: 0,
                    }]
                }
            }
        }
    }
</script>
