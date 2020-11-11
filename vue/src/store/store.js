import Vue from 'vue'
import Vuex from 'vuex'
// Importing getters
import getters from './getters'
import system from './modules/system'
import body from './modules/body'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    system,
    body
  },
  getters
})
