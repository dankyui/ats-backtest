<template>
<highstock :options="getOptions(dataset)" style="height: 400px;" ref="highcharts"></highstock>
<!-- <highstock style="height: 400px;" ref="highcharts"></highstock> -->
</template>

<script>
    export default {
        props: ['dataset'],
        mounted() {
           this.$root.backtestCharts.push(...this.$refs.highcharts)
        },
        methods:{
            getOptions(key) {
                let title={}
                const keyAry= key.split('-')
                title={
                    text:keyAry[keyAry.length-1]+' '+this.$store.state.Locale.file[key]
                }
                return {
                    chart: {},
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
                        split: true
                    },

                    series: [{
                        type: 'candlestick',
                        name: title.text,
                        data: _.map(this.$store.state.Backtest.rawData[key],x=>[x[0],x[1],x[2],x[3],x[4]]),
                        turboThreshold: 0
                    }, {
                        type: 'column',
                        name: this.$t('volume'),
                        data: _.map(this.$store.state.Backtest.rawData[key],x=>[x[0],x[5]]),
                        yAxis: 1,
                        turboThreshold: 0,
                    }]
                }
            }
        }
    }
</script>
