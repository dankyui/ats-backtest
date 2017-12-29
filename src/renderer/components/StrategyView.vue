<template>
  <v-layout row wrap justify-center id="wrapper">
    <logo></logo>
    <v-flex xs10 class="mt-3">
      <v-card>
        <history-table></history-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import HistoryTable from './WelcomeView/HistoryTable'
  import Logo from './ShareView/Logo'

  export default {
    name: 'welcome',
    components: { HistoryTable,Logo },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>
