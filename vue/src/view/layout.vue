<template>
  <v-app id="inspire">
    <v-app-bar app flat color="white" clipped-right>
      <v-toolbar-title class="toolbar__title">JSONFACTORY</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="$store.getters.resolutionOfScreenInCurrentState.width > 864">
        <v-btn light text :color="$route.name === 'Home' ? 'primary' : '#eee'" @click="$router.push({name: 'Home'})" class="mx-1 black--text font-weigth-bold buttons_to_hover">Home</v-btn>
        <!-- <v-btn light text :color="$route.name === 'Help' ? 'primary' : '#eee'" @click="$router.push({name: 'Help'})" class="mx-1 black--text font-weigth-bold buttons_to_hover">Help</v-btn> -->
        <v-btn light text :color="$route.name === 'About' ? 'primary' : '#eee'" @click="$router.push({name: 'About'})" class="mx-1 black--text font-weigth-bold buttons_to_hover">About</v-btn>
        <!-- <v-btn @click="$router.push({name: 'Login'})" light text :color="$route.name === 'Login' ? 'primary' : '#eee'" class="mx-1 black--text font-weigth-bold buttons_to_hover">Login</v-btn> -->
        <v-btn @click="$router.push({name: 'Feedback'})" light text :color="$route.name === 'Review' ? 'primary' : '#eee'" class="mx-1 black--text font-weigth-bold buttons_to_hover">Feedback</v-btn>
      </div>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-else></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
    >
      <v-list
        nav
      >
        <v-list-item-group
          v-model="group"
          active-class="primary lighten-5"
        >
          <v-list-item @click="$router.push({name: 'Home'})">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push({name: 'About'})">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push({name: 'Feedback'})">
            <v-list-item-title>Feedback</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main v-resize="resizeWindowHandler" class="main_container">
      <section style="overflow:hidden">
        <transition name="slide" mode="out-in">
          <router-view/>
      </transition>
      </section>
    </v-main>
  </v-app>
</template>
<script>
import deboucneMixin from '@/mixins/debounce.js'
export default {
  mixins: [deboucneMixin],
  data () {
    return {
      debounceMethod: function () {},
      group: 0,
      drawer: false
    }
  },
  mounted () {
    this.debounceMethod = this.debounce(function () {
      this.$store.dispatch('SetResolutionOfScreen', {width: window.innerWidth, height: window.innerHeight})
    }, 200)
  },
  methods: {
    resizeWindowHandler () {
      this.debounceMethod()
    }
  }
}
</script>
<style scoped>
.toolbar__title {
  font-size: large !important;
  font-family: 'Montserrat-Regular';
  font-weight: bolder;
}
.navigation-drawer__border {
  background: none !important;
  background-color: white !important;
}
.slide-leave-active,
.slide-enter-active {
  transition: 0.15s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
.main_container {
  background: #eee;
}
</style>
