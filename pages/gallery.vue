<template>
  <div class="gallery pt-10">
    <div placeholder="Loading..." class="grid-container">
      <figure v-for="image in images" :key="image.path" @click="openImageView(image.path)">
        <img :src="'/apis/getimage/'+image.path" :alt="image.name" loading="lazy">
        <figcaption>{{formatDate(image.LM)}}</figcaption>
      </figure>
    </div>
    <div class="image_loadmore bg-gray-800" @click="loadmore">{{loadmore_text}}</div>
    <div class="image_overlay" @click="closeImageOverlay">
      <div></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  transition: 'slide-bottom',
  middleware: 'authenticated',
  methods: {
    async loadmore(){
      if(this.loadmore_text == 'LOAD MORE'){
        this.page++;
        this.fetch();
      }
    },
    formatDate(date){
      var dates = 'err';
      try{
        dates = new Intl.DateTimeFormat("en" , {
          timeStyle: "medium",
          dateStyle: "short"
        }).format(new Date(parseInt(date)));
      }catch(err){
        console.log(err);
      }
      return dates;
    },
    closeImageOverlay(){
      document.querySelector('.image_overlay').style.display = 'none';
    },
    openImageView(test){
      let overlay = document.querySelector('.image_overlay');
      let img = document.createElement('img');
      img.src = '/apis/getfullimage/'+test;
      let innerdiv = overlay.querySelector('div');
      innerdiv.innerHTML = '';
      innerdiv.appendChild(img);
      overlay.style.display = 'block';
    },
    async fetch() {
      let images = await axios.get(`/apis/gallery/${this.page}`);
      if(images.data == 'no more images'){
        this.loadmore_text = 'no more images';
      }else{
        this.images.push(...images.data);
      }
    }
  },
  mounted() {
    this.fetch()
  },
  data () {
    return {
      loadmore_text: 'LOAD MORE',
      images: [],
      page: 1
    }
  },
  head() {
    return {
      title: 'Gallery',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Gallery',
        },
      ],
    }
  },
}
</script>
<style>
.gallery .grid-container{
  width: 98%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1em;
  
  @media (min-width: 52em) {
    grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  }
}

.gallery .grid-container figure{
  cursor: pointer;
  background: rgba(0,0,0,0.20);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3px;
}

.gallery .grid-container figure img{
  height: auto;
  -webkit-filter: brightness(100%);
  width:100%;
  max-height: 600px;
}

.gallery .grid-container figure img:hover{
  -webkit-filter: brightness(80%);
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  -ms-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

.gallery .image_loadmore {
  margin-top: 20px;
  display: inline-block;
  padding: 25px;
  cursor: pointer;
  text-align: center;
  width: 100%;
}

.gallery .image_overlay{
  align-content: center;
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

.gallery .image_overlay div {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 100%;
}

.gallery .image_overlay img{
  margin-left: auto;
  margin-right: auto;
}
</style>
