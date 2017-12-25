<template>
  <v-layout column>
    <v-flex>
      <v-toolbar color="green" dark>
        <v-toolbar-title>{{$t('labelHistoricalData')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>search</v-icon>
        </v-btn>
      </v-toolbar>

         <v-data-table v-model="selected" v-bind:headers="headers" v-bind:items="items" select-all v-bind:pagination.sync="pagination"
            item-key="name" class="elevation-1">
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
                <tr :active="props.selected" @click="props.selected = !props.selected">

                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-right">{{ props.item.calories }}</td>
                    <td class="text-xs-right">{{ props.item.fat }}</td>
                    <td class="text-xs-right">{{ props.item.carbs }}</td>
                    <td class="text-xs-right">{{ props.item.protein }}</td>
                    <td class="text-xs-right">{{ props.item.sodium }}</td>
                    <td class="text-xs-right">{{ props.item.calcium }}</td>
                    <td class="text-xs-right">{{ props.item.iron }}</td>
                </tr>
            </template>
        </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
    export default {
        data() {
            return {
                pagination: {
                    sortBy: 'name'
                },
                selected: [],
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        value: 'name'
                    },
                    {
                        text: 'Calories',
                        value: 'calories'
                    },
                    {
                        text: 'Fat (g)',
                        value: 'fat'
                    },
                    {
                        text: 'Carbs (g)',
                        value: 'carbs'
                    },
                    {
                        text: 'Protein (g)',
                        value: 'protein'
                    },
                    {
                        text: 'Sodium (mg)',
                        value: 'sodium'
                    },
                    {
                        text: 'Calcium (%)',
                        value: 'calcium'
                    },
                    {
                        text: 'Iron (%)',
                        value: 'iron'
                    }
                ],
                items: []
            }
        },
        methods: {
            toggleAll() {
                if (this.selected.length) this.selected = []
                else this.selected = this.items.slice()
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
