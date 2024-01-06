<script>
  import cookies from "$lib/cookies";
  import { PUBLIC_GALLERY_BACKEND_URL } from "$env/static/public";
  import { onMount } from "svelte";
  import { addToast } from "$lib/stores/toastStore"

  let Items = [  ]

  async function get() {
    try {
      let result = await fetch(PUBLIC_GALLERY_BACKEND_URL+'/notes', {
        headers: {
          'Authorization': "Bearer " + cookies.get("token"),
        }
      })

      if (result.ok) {
        Items = await result.json();
        console.log(Items);
      }
    } catch (e) {
      addToast({
        message: "there was an error getting Notes",
        type: "error",
        dismissible: true,
        timeout: 20*1000 // n*second
      })
      console.log('Error:', e);
    }
  }

  onMount(()=>{
    get();
  })

</script>

<div class="bg-gray-900 select-none min-h-screen w-screen text-white">
    <div class="max-w-2xl mx-auto pt-10">
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
      <div class="relative">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input placeholder="Search Notes" type="search" id="default-search" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
        <button type="submit" class="text-white absolute right-24 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        <a href="/notes/post" class="text-white absolute right-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Create</a>
      </div>
    </div>
  <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32 pb-10">
      <table class="table text-gray-400 border-separate space-y-6 text-sm w-full">
				<thead class=" bg-gray-800 text-gray-500">
					<tr>
						<th class="p-3">user</th>
						<th class="p-3 text-left">text</th>
						<th class="p-3 text-left">date</th>
					</tr>
				</thead>
				<tbody>
          {#each Items as memo }
            <tr class="bg-gray-800">
              <td class="p-3 w-1/6">
                <div class="flex align-items-center">
                  <img class="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image">
                  <div class="ml-3 flex flex-col justify-center">
                    <div class="">{memo.Username}</div>
                  </div>
                </div>
              </td>
              <td class="p-3 whitespace-pre-line">
                <div class="font-extrabold text-lg pl-2">{memo.NoteName}</div>
                {memo.Note}
              </td>
              <td class="p-3 w-[10%] font-bold">
                {memo.CreatedOn}
              </td>
            </tr>
          {/each}
				</tbody>
			</table>
  </div>
</div>