<script>
    // @ts-nocheck

    import { PUBLIC_UPLOAD_URL } from '$env/static/public';

    let fileList = [];

    let fileInput;

    let uploading = false;
    
    function move_handle(){
        fileList = [];
        for(var i = 0; i < fileInput.files.length; i++){
            fileList.push(fileInput.files[i]);
        }
    }

    function clear_fileInput(){
        try{
            fileInput.value = '';
            if(fileInput.value){
                fileInput.type = "text";
                fileInput.type = "file";
            }
        }catch(e){}
    }

    async function upload(){
        if(uploading) return alert("you can't start 2 uploading streams at the same time!");

        clear_fileInput()
        uploading = true;

        for(let  i = 0; i < fileList.length; i++){
            let data = new FormData()
            data.append("file", fileList[i]);
            // data.append();
            console.log(i)
            let result = await fetch(PUBLIC_UPLOAD_URL, {
                method: 'POST',
                // headers: {
                //     // 'Authorization': "Bearer " + "$token",
                //     'Content-Type': 'multipart/form-data'
                // },
                body: data
            })
            // if(result.status != 200) {
            //     console.log("there was an error uploading file:", i);
            //     console.log(fileList[i]);
            //     i--;
            // };
        }

        uploading = false; 
        
    }
    

</script>


<div class=" flex justify-center m-auto items-center h-[calc(100vh-400px)]">
    <form id="container" class=" bg-netural-300 w-96 p-6 shadow-lg rounded-md border border-neutral-400 border-dashed hover:border-neutral-200 text-center" on:submit|preventDefault={upload}>
        <label class=" text-center block mb-2 text-base text-indigo-500 font-semibold" for="uploadarea">Choose or Drop photos</label>
        <hr class="mb-2">
        <input class="bg-white rounded-md" type="file" id="uploadarea" multiple accept="image/*"  bind:this={fileInput} on:change={move_handle}/>
        <hr class="mt-2 opacity-0">
        <input id="submitter" class="p-1 bg-white w-full text-base text-indigo-500 font-semibold rounded-md hover:bg-neutral-200" value="Upload" type="submit">
    </form>  
</div>

