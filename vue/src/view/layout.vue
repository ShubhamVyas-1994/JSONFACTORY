<template>
  <v-app id="inspire">
    <v-app-bar app flat color="white" clipped-right>
      <v-toolbar-title class="toolbar__title">JSONFACTORY</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-btn light text :color="$route.name === 'Home' ? 'primary' : '#eee'" @click="$router.push({name: 'Home'})" class="mx-1 black--text font-weigth-bold buttons_to_hover">Home</v-btn>
        <v-btn light text :color="$route.name === 'Explore' ? 'primary' : '#eee'" @click="$router.push({name: 'Explore'})" class="mx-1 black--text font-weigth-bold buttons_to_hover">Explore</v-btn>
        <v-btn light text :color="$route.name === 'About' ? 'primary' : '#eee'" @click="$router.push({name: 'About'})" class="mx-1 black--text font-weigth-bold buttons_to_hover">About</v-btn>
        <v-btn light text :color="$route.name === 'Lgoin' ? 'primary' : '#eee'" class="mx-1 black--text font-weigth-bold buttons_to_hover">Login</v-btn>
      </div>
    </v-app-bar>
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
      debounceMethod: function () {}
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
