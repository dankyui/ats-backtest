<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs12 md4 offset-md1 class="text-xs-center centered">
      <img id="logo" class="logo" src="~@/assets/alpha-logo-black-rgb.svg" alt="alpha-ats-logo">
    </v-flex>
    <v-flex xs10 class="mt-3">
      <v-card>
        <v-card-title>
          <h2 class="pt-4" style="color:grey">
            <u>{{$t('numOfStock')}} {{numOfStock}}</u>
          </h2>
          <v-spacer></v-spacer>
          <div class="text-xs-right pt-2">
            <v-btn color="primary" @click.native="toggleHighlight" fab :flat="!highlight">
              <v-icon>format_color_fill</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-title>
          <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
        </v-card-title>
        <template>
          <v-data-table hide-actions v-model="selected" v-bind:headers="headers" v-bind:items="items" select-all v-bind:pagination.sync="pagination"
            v-bind:search="search" item-key="name" class="elevation-1">
            <template slot="headers" slot-scope="props">
              <tr>
                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)">
                  <v-icon>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td v-for="(value,key,index) in props.item" v-bind:style="{'background-color':changeColor(index,value)}" v-bind:class="{ 'text-xs-right': index!=0}">
                  {{ value.toLocaleString() }}
                </td>
              </tr>
            </template>
            <template slot="no-data">
              <v-alert :value="true" color="error" icon="warning">
                Sorry, nothing to display here :(
              </v-alert>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
          </div>
        </template>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {
    mapActions
  } from 'vuex'

  export default {
    name: 'stock',
    data() {
      return {
        search: '',
        selected: [],
        pagination: {
          rowsPerPage: 50,
          totalItems: -1
        },
        highlight: true
      }
    },
    mounted() {
      this.getStock()
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      ...mapActions([
        'getStock'
      ]),
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      changeColor(index, value) {
        const columns = this.$store.state.Stock.columns

        if (index != 0 && index != columns.length - 1 && this.highlight) {
          const max = this.$store.state.Stock.max[index]
          const min = this.$store.state.Stock.min[index]
          const ratio = Math.abs(value) / (Math.abs(min) + Math.abs(max))
          const percent = parseInt(ratio * 100)
          if (value >= 0)
            return this.$rgb.hsl_col_perc(percent / 5 + 80, 0, 120)
          else
            return this.$rgb.hsl_col_perc(percent / 5, 0, 120)
        } else {}
      },
      toggleHighlight() {
        this.highlight = !this.highlight
      }
    },
    computed: {
      numOfStock: {
        get() {
          if (this.pagination.totalItems >= 0)
            return this.pagination.totalItems
          else
            return this.$store.state.Stock.rows.length
        }
      },
      headers: {
        get() {
          let headers = []
          let columns = this.$store.state.Stock.columns
          columns.map((x) => {
            headers.push({
              text: x,
              value: x
            })
          })
          return headers
        },
        set() {}
      },
      items: {
        get() {
          const rows = this.$store.state.Stock.rows
          const columns = this.$store.state.Stock.columns
          let items = []
          rows.map((x) => {
            // if (x[1] == 0) return
            let item = {}
            for (let y in columns) {
              if (y == 0) {
                while (x[y].length < 5) x[y] = "0" + x[y]
                item[columns[y]] = x[y] + '.HK'
              } else if (y != columns.length - 1) {
                x[y] = String(x[y]).replace(/,/g, '')
                if (isNaN(x[y])) {
                  return
                }
                x[y] = parseFloat(x[y])
                item[columns[y]] = x[y]
              } else {
                item[columns[y]] = x[y]
              }
            }
            items.push(item)
          })
          return items
        },
        set() {}
      },
      pages() {
        return this.pagination.rowsPerPage ? Math.ceil(this.items.length / this.pagination.rowsPerPage) : 0
      }
    }
  }
</script>

<style scoped>
  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo {
    max-width: 100%;
  }

  .link-btn {
    width: 150px;
  }
</style>
