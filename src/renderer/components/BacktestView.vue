<template>
    <v-layout row wrap justify-center>
        <logo></logo>
        <v-expansion-panel class="ml-5 mr-5" expand>
            <v-expansion-panel-content v-model="expandA">
                <h2 slot="header">{{$t('backtestPanelHeader')}}</h2>
                <v-divider></v-divider>
                <backtest-step :closePanelA="closePanelA" :startBacktest="startBacktest"></backtest-step>
            </v-expansion-panel-content>
            <v-expansion-panel-content v-model="expandB" v-if="this.$store.state.Backtest.startLoadData">
                <h2 slot="header">{{$t('datasetHeader')}}</h2>
                <v-divider></v-divider>
                <backtest-data></backtest-data>
            </v-expansion-panel-content>
            <v-expansion-panel-content v-model="expandC" v-if="this.$store.state.Backtest.startCalculate">
                <h2 slot="header">{{$t('calculationHeader')}}</h2>
                <v-divider></v-divider>
                <backtest-calculation></backtest-calculation>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-layout>
</template>

<script>
    import {
        mapActions
    } from 'vuex'
    import Logo from './ShareView/Logo'
    import HistoricalData from './BacktestView/HistoricalData'
    import BacktestStep from './BacktestView/BacktestStep'
    import BacktestData from './BacktestView/BacktestData'
    import BacktestCalculation from './BacktestView/BacktestCalculation'

    export default {
        name: 'backtest',
        components: {
            Logo,
            HistoricalData,
            BacktestStep,
            BacktestData,
            BacktestCalculation
        },
        data() {
            return {
                expandA: true,
                expandB: true,
                expandC: true,
                started: false
            }
        },
        mounted() {},
        beforeDestroy(){
            this.$root.backtestCharts=[]
        },
        methods: {
            ...mapActions([
                'runBacktest'
            ]),
            closePanelA() {
                setTimeout(() => {
                    this.expandA = false
                    this.$store.commit('CLEAR_BACKTEST')
                }, 100)
            },
            startBacktest() {
                store.commit('REFRESH_PROGRESS')
                store.commit('BACKTEST_RUNNING', true)
                // _.map(this.$root.backtestCharts,x=>{
                //     x.chart.destroy()
                //     console.log(x)}
                // )
                this.$root.backtestCharts=[]
                setTimeout(() => {

                    this.expandA = false
                    // this.expandB = true
                    this.started = true
                    this.runBacktest()
                }, 1000)
            }
        }
    }
</script>
