<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
            <v-select
              :label="$t('labelMyStrategies')"
              v-bind:items="strategies"
              v-model="selectedStrategies"
              multiple
              chips
              :hint="$t('canPickMoreThanOne')"
              persistent-hint
            >
            <template slot="selection" slot-scope="data">
                <v-chip
                  close
                  @input="data.parent.selectItem(data.item)"
                  :selected="data.selected"
                  class="chip--select-multi"
                  :key="JSON.stringify(data.item)"
                  color="primary"
                  style="color:white"
                  dark
                >
                  {{ data.item }}
                </v-chip>
              </template>
            </v-select>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed:{
        strategies:{
            get(){
                return this.$store.state.Backtest.strategies
            },
            set(){}
        },
        selectedStrategies:{
            get(){
                return this.$store.state.Backtest.selectedStrategies
            },
            set(v){
                this.$store.commit('SET_SELECTED_STRATEGIES',v)
            }
        }
    }
  }
</script>
