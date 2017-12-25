<template>
    <v-layout row wrap justify-center id="wrapper">
        <logo></logo>
        <v-expansion-panel class="ml-5 mr-5">
            <v-expansion-panel-content v-model="expandA">
                <div slot="header">{{$t('labelBacktestPanel')}}</div>
                <v-divider></v-divider>
                <backtest-step :closePanelA="closePanelA" :startBacktest="startBacktest"></backtest-step>
            </v-expansion-panel-content>
            <v-expansion-panel-content v-model="expandB" v-if="hasResult">
                <div slot="header">{{$t('labelResultPanel')}}</div>
                <v-divider></v-divider>
                <backtest-result></backtest-result>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-layout>
</template>

<script>
    import Logo from './ShareView/Logo'
    import HistoricalData from './BacktestView/HistoricalData'
    import BacktestStep from './BacktestView/BacktestStep'
    import BacktestResult from './BacktestView/BacktestResult'

    export default {
        name: 'welcome',
        components: {
            Logo,
            HistoricalData,
            BacktestStep,
            BacktestResult
        },
        data() {
            return {
                expandA: true,
                expandB: false,
                hasResult:false
            }
        },
        mounted() {},
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            closePanelA() {
                setTimeout(() => {
                    this.expandA = false
                }, 100)
            },
            startBacktest() {
                setTimeout(() => {
                    this.expandA = false
                    this.expandB = true
                    this.hasResult=true
                }, 500)
            }
        }
    }
</script>
