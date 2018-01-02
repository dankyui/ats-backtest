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
            }
        },
        computed: {
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
                let title={}
                const keyAry= key.split('-')
                title={
                    text:keyAry[keyAry.length-1]+' '+this.$store.state.Locale.file[key]
                }
                return {
                    credits: {
                        enabled: false
                    },
                    rangeSelector: {
                        selected: 1,
                        inputEnabled: false
                    },
                    title: title,
                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: this.$t('ohlc')
                        },
                        height: '60%',
                        lineWidth: 2,
                        resize: {
                            enabled: true
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: this.$t('volume')
                        },
                        top: '65%',
                        height: '35%',
                        offset: 0,
                        lineWidth: 2
                    }],

                    tooltip: {
                        // valueDecimals: 2
                    },

                    series: [{
                        type: 'candlestick',
                        name: title.text,
                        data: this.$store.state.Backtest.calSet[key+'_timeframe'].map((x=>[x[0],x[1],x[2],x[3],x[4]])),
                        turboThreshold: 0
                    },{
                        type: 'column',
                        name: this.$t('volume'),
                        data: this.$store.state.Backtest.calSet[key+'_timeframe'].map((x=>[x[0],x[5]])),
                                                yAxis: 1,

                        turboThreshold: 0,
                    }]
                }
            }
        }
    }
</script>
