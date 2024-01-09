<script>
  import { PUBLIC_GALLERY_BACKEND_URL } from "$env/static/public";
  import cookies from "$lib/cookies.js";
  import { onMount } from "svelte";
  import { addToast } from "$lib/stores/toastStore";
  import TagSearch from "$lib/components/TagSearch.svelte";
  import { page as pageStore } from "$app/stores";
  import { goto } from "$app/navigation";

  import { clickOutside } from "$lib/clickOutside.js";
  import { browser } from "$app/environment";

  //images
  let images = [];
  let allCount = 0;

  //pages
  let page = 1;
  let pageLimit = 50; // items per page
  let pageTabulationLimit = 8 + 1; // max tabulation +1 for the current page

  // tags
  let tags = [];

  async function load_images() {
    try {
      let response;
      if (tags.length > 0) {
        let form = new FormData();
        form.append("tags", JSON.stringify(tags));
        form.append("page", page);
        form.append("limit", pageLimit);
        response = await fetch(PUBLIC_GALLERY_BACKEND_URL + "/search", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          body: form,
        });
      } else {
        response = await fetch(
          PUBLIC_GALLERY_BACKEND_URL +
            `/images?page=${page}&limit=${pageLimit}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          }
        );
      }

      let data = await response.json();
      if (!data.Images) return (images = []);

      allCount = data.Count;
      images = [];
      for (let img of data.Images) {
        let name = img.Path.split("/").pop().split(".").shift();
        // if(img.Metadata)console.log(img.Metadata)
        let nImg = {
          type: img.Type,
          source: img.Path,
          metadata: img.Metadata,
          alt: "",
          src: `${PUBLIC_GALLERY_BACKEND_URL}/compressed/${name}.webp`,
        };
        images.push(nImg);
      }

      images = images;
    } catch (e) {
      addToast({
        message: "there was an error getting one or more of the images!",
        type: "error",
        dismissible: true,
        timeout: 1_000, // n*second
      });
      console.log("Error:", e);
    }
  }

  onMount(async () => {
    if ($pageStore.url.searchParams.has("page"))
      page = $pageStore.url.searchParams.get("page");
    if ($pageStore.url.searchParams.has("searchTags"))
      tags = $pageStore.url.searchParams.get("searchTags").split(",");
    load_images();
  });

  function showImage(img) {
    overlay_content = {
      type: img.type,
      source: `${PUBLIC_GALLERY_BACKEND_URL}/file/${img.source
        .split("/")
        .pop()}`,
      metadata: img.metadata,
    };
    overlay = true;
  }

  function hideImage() {
    overlay = false;
    overlay_store = null;
    overlay_content = null;
  }

  function deleteImage() {
    overlay_store = overlay_content;
    overlay_content = {
      type: "confirmation",
      data: "you sure about that",
    };
  }

  async function deleteImageConfirm() {
    let response = await fetch(PUBLIC_GALLERY_BACKEND_URL + `/images`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
      body: "uploaded/" + overlay_store.source.split("/file/")[1],
    });

    if (response.ok) {
      addToast({
        message: "deleted one or more images",
        type: "success",
        dismissible: true,
        timeout: 5_000, // n*second
      });
    } else {
      let message = await response.text();
      addToast({
        message,
        type: "error",
        dismissible: true,
        timeout: 5_000, // n*second
      });
    }
    hideImage();
  }

  function update_tags({ detail: _tags }) {
    page = 1;
    tags = _tags;
    $pageStore.url.searchParams.set("searchTags", tags.join(","));
    goto(`?${$pageStore.url.searchParams.toString()}`);
    load_images();
  }

  function to_page(p) {
    page = p;

    $pageStore.url.searchParams.set("page", page);
    goto(`?${$pageStore.url.searchParams.toString()}`);

    load_images();
    topbox.scrollIntoView();
  }

  let overlay = false;
  let overlay_content = {};
  let overlay_store = null;
  let topbox;

  function createNumberArray(startingNumber, length, maxNumber) {
    const halfLength = Math.floor(length / 2);
    const numberArray = [1];
    if (allCount <= pageLimit) return numberArray;
    for (let i = -halfLength; i <= halfLength; i++) {
      const num = startingNumber + i;
      if (num < maxNumber && num > 1)
        numberArray.push(Math.min(maxNumber, num));
    }
    numberArray.push(maxNumber);
    return new Set(numberArray);
  }

  $: pageTabulation = createNumberArray(
    page,
    pageTabulationLimit,
    Math.ceil(allCount / pageLimit)
  );

  $: if (browser)
    document
      .getElementsByTagName("html")[0]
      .classList[overlay ? "add" : "remove"]("lock-scroll");
</script>

<div class="bg-gray-900 select-none min-h-screen w-screen">
  <div bind:this={topbox} />
  {#if overlay}
    <div class="bigImage bg-gray-900/75 h-screen w-screen">
      <div
        use:clickOutside
        on:click_outside={hideImage}
        class="text-neutral-700 dark:text-neutral-200 m-auto bg-gray-900/95 p-10 rounded-lg flex max-h-[95vh] pt-5"
      >
        <div class="max-h-full cursor-pointer m-auto">
          {#if overlay_content.metadata}
            <button
              on:click={(button) => {
                if (overlay_store) {
                  overlay_content = overlay_store;
                  overlay_store = null;
                } else {
                  overlay_store = overlay_content;
                  overlay_content = {
                    type: "metadata",
                    metadata: overlay_content.metadata,
                  };
                }

                button.target.textContent =
                  overlay_content.type == "metadata"
                    ? "View Image"
                    : "View Metadata";
              }}
              class="content-normal pb-5"
            >
              View Metadata
            </button>
          {/if}
          <div class="float-right">
            <button on:click={deleteImage} class="mr-5 px-2 py-1 bg-red-600">
              Delete
            </button>
            <button on:click={hideImage}> Close </button>
          </div>
          {#if overlay_content.type == "image"}
            <img
              src={overlay_content.source}
              alt="big overview of selected item"
              class="max-h-[75vh]"
            />
          {:else if overlay_content.type == "video"}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video controls src={overlay_content.source} class="max-h-[75vh]" />
          {:else if overlay_content.type == "metadata"}
            <div
              class="whitespace-pre-wrap text-left max-h-[75vh] overflow-scroll ml-5 w-fit"
            >
              {overlay_content.metadata}
            </div>
          {:else if overlay_content.type == "confirmation"}
            <div class="">
              {overlay_content.data}

              <button on:click={deleteImageConfirm}>Yes</button>
              <button on:click={hideImage}>No</button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  <TagSearch on:tag={update_tags} />
  <section class="text-gray-700">
    <div class="container px-10 py-2 mx-auto lg:pt-12 lg:px-32">
      <!-- tabulation for mobile -->
      <div class="w-fit text-white my-4 m-auto flex lg:hidden">
        {#each pageTabulation as pageNumber}
          <button
            class="{pageNumber == page
              ? 'bg-indigo-700'
              : 'bg-indigo-500'} cursor-pointer text-white hover:bg-indigo-700 hover:text-white block px-2 py-1 md:px-4 md:py-2 mx-1 rounded-md text-base font-medium w-fit"
            on:click={() => {
              to_page(pageNumber);
            }}
          >
            {pageNumber}
          </button>
        {/each}
      </div>
      <!-- images -->
      <div class="columns-1 lg:columns-4 md:columns-3 sm:columns-2 -m-1 md:-m-2">
        {#if images.length == 0}
          <div class="text-white m-auto w-fit">No images found 💩</div>
        {/if}
        {#each images as image}
          <button
            class="flex flex-wrap w-full"
            on:click={(_) => showImage(image)}
          >
            <div class="w-full p-1 md:p-2">
              <img
                class="block object-cover xl:object-contain object-center w-full h-full rounded-lg
                            hover:scale-110 transition duration-200 ease-in-out cursor-pointer unselectable select-none"
                loading="lazy"
                source={image.source}
                alt={image.alt}
                src={image.src}
              />
            </div>
          </button>
        {/each}
      </div>
      <!-- tabulation -->
      <div class="w-fit text-white my-4 m-auto flex">
        {#each pageTabulation as pageNumber}
          <button
            class="{pageNumber == page
              ? 'bg-indigo-700'
              : 'bg-indigo-500'} cursor-pointer text-white hover:bg-indigo-700 hover:text-white block px-2 py-1 md:px-4 md:py-2 mx-1 rounded-md text-base font-medium w-fit"
            on:click={() => {
              to_page(pageNumber);
            }}
          >
            {pageNumber}
          </button>
        {/each}
      </div>
    </div>
  </section>
</div>

<style>
  .bigImage {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 700;
  }
  .unselectable {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
</style>
