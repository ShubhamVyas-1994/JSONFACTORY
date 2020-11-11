// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)

const opts = {
  theme: {
    themes: {
      lightGray: '#F1F1F2',
      light: {
        primary: '#0278ae',
        accent: '#B3E5FC',
        secondary: '#39311d',
        anchor: '#F1F1F2',
        teal: '#16a596',
        success: '#3CD154'
      },
      dark: {
        primary: '#0278ae',
        accent: '#B3E5FC',
        secondary: '#39311d',
        anchor: '#F1F1F2',
        teal: '#16a596',
        success: '#3CD154'
      }
    }
  }
}

export default new Vuetify(opts)
