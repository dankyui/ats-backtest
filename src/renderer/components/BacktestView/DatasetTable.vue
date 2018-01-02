<template>
  <div>
    <v-data-table v-model="selected" v-bind:headers="headers" v-bind:items="savedProduct" select-all hide-actions v-bind:pagination.sync="pagination" :no-data-text="$t('noData')"
      item-key="id" class="elevation-1">
      <template slot="headers" slot-scope="props">
        <tr>
          <th>
            <v-checkbox primary hide-details @click.native="toggleAll" :input-value="props.all" :indeterminate="props.indeterminate"></v-checkbox>
          </th>
          <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" class="text-xs-right" @click="changeSort(header.value)">
            <v-icon>arrow_upward</v-icon>
            {{ $t(header.text) }}
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr :active="props.selected" @click="props.selected = !props.selected">
          <td>
            <v-checkbox primary hide-details :input-value="props.selected"></v-checkbox>
          </td>
          <td class="text-xs-right">{{ trans(props.item.dataset) }}</td>
          <td class="text-xs-right">{{ props.item.periodSelected }}</td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-layout row justify-center>
        <v-tooltip left>
          <v-btn slot="activator" fab small @click.native.stop="dialog = true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$t('insertDataset')}}</span>
        </v-tooltip>
        <v-tooltip right>
          <v-btn slot="activator" fab small @click.stop="removeDataset">
            <v-icon>remove</v-icon>
          </v-btn>
          <span>{{$t('remove')}}</span>
        </v-tooltip>
        <v-dialog v-model="dialog" max-width="550">
          <v-card style="height:420px">
            <v-card-title class="headline">
              <span>{{$t('availableDataset')}}</span>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">{{$t('cancel')}}</v-btn>
                <v-btn color="green darken-1" flat="flat" @click="submitDataset" :disabled="!productTypeV.length||!productExchangeV.length||!productCodeV.length||!datasetPeriod.length">{{$t('save')}}</v-btn>
              </v-card-actions>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-select :value="productTypeV" @change="productTypeC" combobox :label="$t('productType')" required :items="productType"></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-select :value="productExchangeV" @change="productExchangeC" combobox :label="$t('productExchange')" required :items="productExchangeI"
                      :disabled="!productTypeV.length"></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-select :value="productCodeV" @change="productCodeC" combobox :label="$t('productCode')" required :items="productCodeI" :disabled="!productExchangeV.length"></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <date-picker style="width:100%" type="datetime" :minute-step="1" v-model="datasetPeriod" :placeholder="$t('inputDate')" range :lang="this.$store.state.Locale.language" format="yyyy-MM-dd HH:mm"
                      :shortcuts="shortcuts" confirm></date-picker>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-layout>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker'
  import {
    mapActions
  } from 'vuex'

  export default {
    components: {
      DatePicker
    },
    data() {
      return {
        dialog: false,
        headers: [
          {
            text: 'dataset',
            value: 'dataset',
            align: 'left'
          },
          {
            text: 'periodSelected',
            value: 'periodSelected',
            align: 'left'
          },
        ],
        selected: [],
        pagination: {
          rowsPerPage:-1
        },
        items: [

        ],
        datasetPeriod: '',
        shortcuts: [
        //   {
        //   text: 'Today',
        //   start: new Date(),
        //   end: new Date()
        // }
        ],
        productType: [],
        productTypeV: '',
        productExchange: [],
        productExchangeI: [],
        productExchangeV: '',
        productCode: [],
        productCodeI: [],
        productCodeV: ''
      }
    },
    computed: {
      savedProduct: {
        get() {
          return this.$store.state.Backtest.products
        }
      }
    },
    mounted() {
      this.fetchDatasetList()
    },
    methods: {
      trans(v){
        return v.split('-')[2]+' '+this.$store.state.Locale.file[v]
      },
      ...mapActions([
        'saveProduct',
        'removeProduct'
      ]),
      productCodeC(v) {
        if (typeof v === 'object') return
        this.productCodeV = v
      },
      productExchangeC(v) {
        if (typeof v === 'object') return
        this.productExchangeV = v
        this.productCodeV = ''
        this.productCodeI = this._.filter(this.productCode, x => x.value.includes(v))
      },
      productTypeC(v) {
        if (typeof v === 'object') return
        this.productTypeV = v
        this.productExchangeV = ''
        this.productCodeV = ''
        this.productExchangeI = this._.filter(this.productExchange, x => x.value.includes(v))
      },
      submitDataset() {
        this.saveProduct({id:this.savedProduct.length,dataset:this.productCodeV, periodSelected: this._.map(this.datasetPeriod, x => new Date(x).toLocaleString()).join(' ~ ')})
        this.dialog = false
      },
      removeDataset() {
        const indexes = this._.map(this.selected, x => {
          return x.id
        }).sort()
        if (indexes.length == 0) return
        this.removeProduct(indexes)
        this.selected=[]
      },
      findUnique(array, index) {
        let newArray = this._.map(array, x => {
          return {
            text: this.$store.state.Locale.file[x[index]],
            value: x[index]
          }
        })

        newArray = this._.uniqBy(newArray, x => {
          return x.value
        })
        return newArray
      },
      fetchDatasetList() {
        this.$store.commit('SET_PAGE_LOADING', true)
        this.$http.get(rootUrl + '/backtest/product-list').then((res) => {
          const data = this._.map(res.data.data, (x) => {
            return x.splice(0, 3).reverse()
          })

          //product type
          let type = this.findUnique(data, 0)

          //product exchange
          let exchange = this._.map(data, x => {
            return {
              text: this.$store.state.Locale.file[x[1]],
              value: x.slice(0, 2).join('-')
            }
          })

          exchange = this._.uniqBy(exchange, x => {
            return x.value
          })

          let code = this._.map(data, x => {
            return {
              text: x[2]+' '+this.$store.state.Locale.file[x.join('-')],
              value: x.join('-')
            }
          })

          this.productType = type
          this.productExchange = exchange
          this.productCode = code
        }).finally(() => {
          this.$store.commit('SET_PAGE_LOADING', false)
        })
      },
      toggleAll() {
        if (this.selected.length) this.selected = []
        else this.selected = this.savedProduct.slice()
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    }
  }
</script>
