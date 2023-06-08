<script>
    // @ts-nocheck

    import { PUBLIC_GALLERY_BACKEND_URL } from '$env/static/public';

    import { addToast } from "$lib/stores/toastStore";
    import cookies from "$lib/cookies.js"

    let fileList = [];
    let fileInput = '';
    let tagInput = '';
    let uploading = false;

    let textbox = "Choose or Drop photos";

    $: tags = [];

    function add_tag(){
        let tag = tagInput.toLowerCase();
        if (tag.length > 2) {
            tags.unshift(tagInput.toLowerCase())
            tags = [...new Set(tags)]
        }
        tagInput = ''
    }

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
        if(uploading) return addToast({
            message: "you can't start 2 uploading streams at the same time!",
            type: "error",
            timeout: 2_000
        })


        clear_fileInput()
        uploading = true;

        let length = fileList.length;
        textbox = `0/${length}`;
        for(let  i = 0; i < length; i++){
            let data = new FormData()
            data.append("file", fileList[i]);
            data.append("tags", JSON.stringify(tags));
            try {
                console.log("uploading", i, length);
                let result = await fetch(PUBLIC_GALLERY_BACKEND_URL+"/upload", {
                    method: 'POST',
                    headers: {
                        'Authorization': "Bearer " + cookies.get("token"),
                        // 'Content-Type': 'multipart/form-data'
                    },
                    body: data
                })

                let text = await result.text();
                console.log(text)
            } catch (error) {
                addToast({
                    message: "one or more images had an error while uploading!",
                    type: "error",
                    dismissible: true,
                    timeout: 5_000
                })
                console.log('Error:', error);
            }

            textbox = `${i+1}/${length}`;

            // if(result.status != 200) {
            //     console.log("there was an error uploading file:", i);
            //     console.log(fileList[i]);
            //     i--;
            // };
        }

        addToast({
            message: `finished uploading ${length} files!`,
            timeout: 2_000
        })

        textbox = "Choose or Drop photos";
  
        uploading = false; 
        
    }

    function remove_tag(index) {
        tags.splice(index, 1)
        tags = [...new Set(tags)]
    }

</script>




<div class="items-center h-[calc(100vh-300px)]">
    <div id="container" class="mt-16 m-auto bg-netural-300 w-96 p-6 shadow-lg rounded-md border border-neutral-400 border-dashed hover:border-neutral-200 text-center">
        <label class="text-center block mb-2 text-base text-indigo-500 font-semibold" for="uploadarea">{textbox}</label>
        <input class="mt-2 w-full bg-white rounded-md" type="file" id="uploadarea" multiple accept="image/*,video/*" bind:this={fileInput} on:change={move_handle}/>
        
        <label class="text-left block mt-2 text-base text-indigo-500 font-semibold w-full" for="tags">TAGS</label>
        <input bind:value={tagInput} id="tags" class="float-left mt-2 mb-2 p-1 bg-white w-3/4 text-base text-indigo-500 font-semibold rounded-md hover:bg-neutral-200" type="text" on:keypress={(e)=>{ if (e.key == 'Enter') add_tag()}}>
        <button on:click={add_tag} class="mt-2 py-1 px-4 bg-white text-base text-indigo-500 font-semibold rounded-md hover:bg-neutral-200">ADD</button>
        {#each tags as tag, i}
        <div class="center relative inline-block select-none whitespace-nowrap rounded-md bg-purple-400 py-1 m-1 px-2.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
            <div class="flex mt-px">
                <div class="h-fit m-auto pl-1">
                    {tag} 
                </div>
                <div role="button" class="h-5 w-5 p-1" on:click={_=>remove_tag(i)} on:keypress>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                    </svg>
                </div>
            </div>
        </div>
        {/each}
        <input id="submitter" class="mt-2 p-1 bg-white w-full text-base text-indigo-500 font-semibold rounded-md hover:bg-neutral-200" value="Upload" type="submit" on:click={upload}>
    </div>  
</div>