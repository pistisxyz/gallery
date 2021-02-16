<template>
  <div class="w-screen min-h-screen bg-gray-900">
    <AppHeader title="testing" />
    <nuxt />
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'
export default {
  components: {
    AppHeader,
  },
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  color: white;
  overflow-x: hidden;
}

a {
  color: #666;
  text-decoration: none;
}

ul {
  list-style: none;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.slide-bottom-enter,
.slide-bottom-leave-to {
  opacity: 0;
  transform: translate3d(0, 15px, 0);
}
</style>
