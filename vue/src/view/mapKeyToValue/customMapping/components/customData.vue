<template>
  <v-card>
    <v-card-title class="pa-2 card_title">
      Enter your custom data
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="pa-2">
          <p>Use ' , ' to separate</p>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="dataToAdd" outlined label="data"></v-textarea>
        </v-col>
        <v-col cols="12" class="py-2">
          <v-chip outlined class="ma-1" color="primary" dark close v-for="(data, index) in addedDataArray" :key="index" @click:close="removeAddedData(index)">
            {{data}}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" rounded depressed @click="closeCustomDialog">Discard</v-btn>
      <v-btn rounded depressed @click="saveCustomSelection" color="primary">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ['dataToCustomize', 'cardTitle'],
  data () {
    return {
      dataToAdd: '',
      addedDataArray: []
    }
  },
  mounted () {
    if (this.dataToCustomize.getDataFrom !== undefined) {
      this.addedDataArray = [...this.dataToCustomize.getDataFrom]
      this.dataToAdd = this.addedDataArray.join(',')
    }
  },
  methods: {
    removeAddedData (index) {
      this.addedDataArray.splice(index, 1)
      this.dataToAdd = this.addedDataArray.join(',')
    },
    closeCustomDialog (data) {
      this.$emit('closeCustomEditDialog', data)
    },
    saveCustomSelection () {
      this.dataToCustomize.getDataFrom = this.addedDataArray
      this.dataToCustomize.mapTo = 'custom'
      this.dataToCustomize.extractFrom = ''
      this.closeCustomDialog(true)
    }
  },
  watch: {
    dataToAdd: {
      handler () {
        this.addedDataArray = this.dataToAdd.split(',')
      }
    }
  }
}
</script>
<style scoped>
.card_title {
  font-family: 'Montserrat-Regular' !important;
  font-size: large;
}
</style>
