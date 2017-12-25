<template>
    <v-stepper v-model="e6" vertical>
        <v-stepper-step step="1" v-bind:complete="e6 > 1" editable>
            {{$t('selectDataset')}}
        </v-stepper-step>
        <v-stepper-content step="1">
            <v-card color="green lighten-1" class="ma-1">
                <dataset-table></dataset-table>
            </v-card>
            <v-btn class="ml-1" color="primary" @click.native="e6 = 2" :disabled="this.$store.state.Backtest.products.length<=0">{{$t('continue')}}</v-btn>
            <v-btn flat @click="closePanelA">{{$t('cancel')}}</v-btn>
        </v-stepper-content>
        <!-- <v-stepper-step step="2" v-bind:complete="e6 > 2" :editable="!this.$store.state.Backtest.products.length<=0">{{$t('selectStrategy')}}</v-stepper-step> -->
        <v-stepper-step step="2" v-bind:complete="e6 > 2" editable>{{$t('selectStrategy')}}</v-stepper-step>
        <v-stepper-content step="2">
            <!-- <v-card class="mb-5" height="200px"> -->
                <strategy-chips></strategy-chips>
            <!-- </v-card> -->
            <v-btn color="primary" @click.native="e6 = 3" :disabled="this.$store.state.Backtest.selectedStrategies.length<=0">{{$t('continue')}}</v-btn>
            <v-btn flat @click="closePanelA">{{$t('cancel')}}</v-btn>
        </v-stepper-content>
        <v-stepper-step step="3" v-bind:complete="e6 > 3" :editable="!this.$store.state.Backtest.products.length<=0&&!this.$store.state.Backtest.selectedStrategies.length<=0">{{$t('selectOutput')}}</v-stepper-step>
        <v-stepper-content step="3">
            <v-card class="mb-5" height="200px"></v-card>
            <v-btn color="primary"  @click.native="e6 = 1" @click="startBacktest">{{$t('start')}}</v-btn>
            <v-btn flat @click="closePanelA">{{$t('cancel')}}</v-btn>
        </v-stepper-content>
        <!-- <v-stepper-step step="4">View setup instructions</v-stepper-step>
        <v-stepper-content step="4">
            <v-card color="green lighten-1" class="mb-5" height="200px"></v-card>
            <v-btn color="primary" @click.native="e6 = 1">Continue</v-btn>
            <v-btn flat>Cancel</v-btn>
        </v-stepper-content> -->
    </v-stepper>
</template>

<script>
    import DatasetTable from './DatasetTable'
    import StrategyChips from './StrategyChips'

    export default {
        props: ['closePanelA','startBacktest'],
        components: {
            DatasetTable,
            StrategyChips
        },
        data() {
            return {
                e6: 1
            }
        },
        methods: {
        }
    }
</script>
