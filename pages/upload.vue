<template>
  <div class="upload">
    <h1 class="my-10">UPLOAD <div id="fileupload_count"></div></h1>
    <input type="file" @change="onFileSelected" multiple class="hidden" id="filesinput">
    <button @click="clickFilesInput" class="mr-10 bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"> Select files for upload <div v-if="selectedFiles.length>0">{{selectedFiles.length}} files selected</div></button>
    <button @click="onUpload" class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Upload</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  transition: 'slide-bottom',
  middleware: 'authenticated',
  data(){
    return {
      selectedFiles: []
    }
  },
  methods: {
    clickFilesInput(){
      document.getElementById('filesinput').click();
    },
    onFileSelected(event){
      this.selectedFiles = event.target.files;
    },
    onUpload(){
      if(!this.selectedFiles){
        console.log('stop no files selected');
        return;
      }
      let files = this.selectedFiles;
      let len = {
        init: 0,
        full: files.length,
        error: 0,
        duplicate: 0
      };
      let count = document.getElementById('fileupload_count');
      count.innerHTML = 'UPLOADING...';

      var imageUploadLoopCALL = true;
      var imageUploadLoop = setInterval(function(){
        console.log('loop');
        if(imageUploadLoopCALL){
          imageUploadLoopCALL = false;
          let lenWait = 0;
          var lenn = ((files.length-len.init) > 10? 10:(files.length-len.init));
          let this_now = len.init;
          for(var i = 0; i<lenn; i++){
            let file = files[this_now+i];
            const fd = new FormData();
            fd.append('image', file, file.name);
            fd.append('lastModified', file.lastModified);
            axios.post('/apis/upload', fd).then(res =>{
              if(res.data.indexOf('error') != -1){
                len.error++;
              }else if(res.data.indexOf('file already exists') != -1){
                len.duplicate++;
              }
              len.init++;
              lenWait++;
              count.innerHTML = 'Uploaded ' + len.init + ' out of ' + len.full + (len.error > 0? ' errors:' + len.error:'') + (len.duplicate > 0? ' duplicates:' + len.duplicate:'');
              if(lenWait >= lenn){
                console.log('did '+lenn+' : '+ len.init);
                imageUploadLoopCALL = true;
                if(len.init == len.full){
                  clearInterval(imageUploadLoop);
                  imageUploadLoop = null;
                }
              }
            }).catch(err=>{
              console.log(err);
              len.init++;
              lenWait++;
              len.error++;
              count.innerHTML = len.init + ' : ' + len.full + (len.error > 0? ' errors:' + len.error:'') + (len.duplicate > 0? ' duplicates:' + len.duplicate:'');
              if(lenWait >= lenn){
                console.log('did '+lenn+' : '+ len.init);
                imageUploadLoopCALL = true;
                if(len.init == len.full){
                  clearInterval(imageUploadLoop);
                  imageUploadLoop = null;
                }
              }
            });
          }
        }
      }, 500);
    }
  },
  head() {
    return {
      title: 'upload',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'file upload',
        },
      ],
    }
  },
}
</script>
<style>
.upload {
  text-align: center;
}
</style>
