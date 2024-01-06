<script>
  import { addToast } from "$lib/stores/toastStore";
  import cookies from "$lib/cookies";
  import { PUBLIC_GALLERY_BACKEND_URL } from "$env/static/public"
  import { goto } from "$app/navigation";

  let max_char = 16_000;

  let max_char_counter;
  let note_body;
  let note_title;

  async function post(){
    try {
      let data = new FormData()
      data.append("note_name", note_title);
      data.append("note", note_body);

      let result = await fetch(PUBLIC_GALLERY_BACKEND_URL+`/notes`, {
        method: 'POST',
        headers: {
          'Authorization': "Bearer " + cookies.get("token"),
        },
        body: data
      })

      if(result.ok){
        addToast({
          message: "created new note",
          type: "success",
          dismissible: true,
          timeout: 1*5000 // n*second
        })
        goto("/notes");
      }

    } catch (error) {
      addToast({
        message: "there was an error getting your profile information!",
        type: "error",
        dismissible: true,
        timeout: 1*2000 // n*second
      })
      console.log('Error:', error);
    }
  }

  $: max_char_counter = `${note_body? note_body.length: 0}/${max_char}`

</script>

<div class="bg-gray-900 select-none h-screen w-screen text-white pt-10">
    <div class="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
      <input bind:value={note_title} class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none" spellcheck="false" placeholder="Title" type="text">
      <textarea bind:value={note_body} maxlength={max_char} spellcheck="true" placeholder="Describe everything about this post here" 
       class="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none min-h-[60px]"></textarea>
      
      <!-- icons -->
      <div class="icons flex text-gray-500 m-2">
        <!-- <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg> -->
        <div class="count ml-auto text-gray-400 text-xs font-semibold">{max_char_counter}</div>
      </div>
      <!-- buttons -->
      <div class="buttons flex">
        <a href="/notes" class="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto">Cancel</a>
        <button on:click={post} class="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500">Post</button>
      </div>
    </div>
</div>