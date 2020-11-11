<template>
  <v-card class="pa-1" color="grey lighten-2">
    <div class="datepicker_card">
        <v-date-picker color="secondary" class="ma-2" @input="emitSelectedValues" :max="max" :min="min" v-model="datepickervalue"></v-date-picker>
      <v-time-picker format="24hr" color="secondary" class="ma-2" v-model="timepickervalue" @click:minute="emitSelectedValues"></v-time-picker>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="closeMenu">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ['value', 'minDate', 'maxDate'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      datepickervalue: '',
      timepickervalue: '',
      min: '',
      max: ''
    }
  },
  mounted () {
    if (this.minDate !== '' && this.minDate !== undefined) {
      this.min = new Date(this.minDate).toISOString().substr(0, 10)
    }
    if (this.maxDate !== '') {
      this.max = new Date(this.maxDate).toISOString().substr(0, 10)
    }
    if (this.value !== '') {
      this.datepickervalue = new Date(this.value).toISOString().substr(0, 10)
      this.timepickervalue = new Date(this.value).toISOString().substr(10, 18)
    }
  },
  methods: {
    emitSelectedValues () {
      let x = this.datepickervalue + ' ' + this.timepickervalue
      this.$emit('input', new Date(x.trim()).toUTCString())
    },
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}
</script>
<style scoped>
.datepicker_card {
  display: flex;
}
</style>
