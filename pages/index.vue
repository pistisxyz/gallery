<template>
  <div class="text-gray-400">
    <div class="py-20 mb-8" style="background: linear-gradient(90deg, #764ba2 0%, #667eea 100%)">
      <div class="container mx-auto px-6">
        <h2 class="text-5xl font-bold mb-2 text-white">
          De La Website
        </h2>
      </div>
    </div>
    <div class="py-20" style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%)">
      <div class="container mx-auto px-6">
        <h2 class="text-5xl font-bold mb-2 text-white">
          Предоставено до вас чрез
        </h2>
        <h3 class="text-3xl mb-8 text-gray-200">
          ПИКО НА ФИЛИЯ
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  transition: 'slide-bottom',
  head() {
    return {
      title: 'Home Page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Home Page',
        },
      ],
    }
  },
}
</script>

<script>
export default {
}
</script>

<style></style>
