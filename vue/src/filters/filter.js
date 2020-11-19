import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatTimeInToday', (date) => {
  if (date === '' || date === undefined || date === null) return ''
  return moment(String(new Date(date))).calendar(null, {
    sameDay: '[Today], hh:mm A',
    nextDay: '[Tomorrow], hh:mm A',
    lastDay: '[Yesterday], hh:mm A',
    nextWeek: 'ddd, DD/MM/YY hh:mm A',
    lastWeek: 'ddd, DD/MM/YY hh:mm A',
    sameElse: 'ddd, DD/MM/YY hh:mm A'
  })
})
