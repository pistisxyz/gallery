<template>
<nav class="bg-gray-800 w-screen">
  <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="relative flex items-center justify-between h-16">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <!-- Mobile menu button-->
        <button class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
          <svg v-if="user.sideMenu" @click="user.sideMenu = !user.sideMenu" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else @click="user.sideMenu = !user.sideMenu" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex-shrink-0 flex items-center">
          <img class="block lg:hidden h-8 w-auto logo" src="~/assets/pikologo.svg" alt="piko">
          <img class="hidden lg:block h-8 w-auto logo" src="~/assets/pikologo.svg" alt="piko">
        </div>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex space-x-4">
            <nuxt-link to="/" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</nuxt-link>
            <nuxt-link to="/login" v-if="!loggedin" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign In</nuxt-link>
            <nuxt-link v-if="loggedin" to="/gallery" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gallery</nuxt-link>
            <nuxt-link v-if="loggedin" to="/upload" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Upload</nuxt-link>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span class="sr-only">View notifications</span>
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div class="ml-3 relative">
          <div>
            <button v-if="loggedin" @click="user.openUserSettingMenu = !user.openUserSettingMenu" class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" src="~/assets/profile.jpg" alt="">
            </button>
          </div>
          <div v-if="user.openUserSettingMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
            <nuxt-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</nuxt-link>
            <a href="#logout" @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <transition name="slide-fade">
    <div v-if="!user.sideMenu" @click="user.sideMenu = !user.sideMenu" class="sm:hidden ease-linear">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <nuxt-link to="/" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</nuxt-link>
        <nuxt-link to="/login" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign In</nuxt-link>
        <nuxt-link v-if="loggedin" to="/gallery" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Gallery</nuxt-link>
        <nuxt-link v-if="loggedin" to="/upload" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Upload</nuxt-link>
      </div>
    </div>
  </transition>
  <notifications group="foo" />
</nav>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AppHeader',
  computed: {
    loggedin(){
      if(this.$store.state.authenticated === null){
        axios.post('/apis/checklogin').then(res=>{
          if(typeof res.data != 'Boolean'){
            this.$store.commit('authCheck', res.data.split(':')[0])
            this.$store.commit('setAdmin', true)
          }else{
            this.$store.commit('authCheck', res.data)
          }
        });
      }
      return this.$store.state.authenticated
    }
  },
  methods: {
    logout() {
      axios.post('/apis/logout').then(res => {
        this.$store.commit('authCheck', false)
        this.user.openUserSettingMenu = false;
        this.$router.push('/');
      });
    }
  },
  data(){
    return {
      user:{
        sideMenu: true,
        openUserSettingMenu: false
      }
    }
  }
}
</script>

<style>
.logo{
  filter: brightness(0) invert(1);
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
