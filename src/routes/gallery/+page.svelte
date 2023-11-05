<script>
    import { PUBLIC_GALLERY_BACKEND_URL } from "$env/static/public";
    import cookies from "$lib/cookies.js";
    import { onMount } from "svelte";
    import { addToast } from "$lib/stores/toastStore";
    import TagSearch from "$lib/components/TagSearch.svelte";

    //images
    let images = [];
    let allCount = 0;

    //pages
    let page = 1;
    let pageLimit = 25; // items per page
    let pageTabulationLimit = 10+1; // max tabulation +1 for the current page

    // tags
    let tags = [];

    async function get_images() {
        try {
            let result = await fetch(
                PUBLIC_GALLERY_BACKEND_URL +
                    `/images?page=${page}&limit=${pageLimit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + cookies.get("token"),
                    },
                }
            );

            let data = await result.json();
            allCount = data.Count;
            images = [];
            for (let img of data.Images) {
                let name = img.Path.split("/").pop().split(".").shift();
                images.push({
                    type: img.Type,
                    source: img.Path,
                    alt: "",
                    src: `${PUBLIC_GALLERY_BACKEND_URL}/compressed/${name}.webp`,
                });
            }

            images = images;
        } catch (error) {
            addToast({
                message:
                    "there was an error getting one or more of the images!",
                type: "error",
                dismissible: true,
                timeout: 2000,
            });
            console.log("Error:", error);
        }
    }

    async function search_images() {
        try {
            let form = new FormData();
            form.append("tags", JSON.stringify(tags));
            form.append("page", page);
            form.append("limit", pageLimit);
            let response = await fetch(PUBLIC_GALLERY_BACKEND_URL + "/search", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + cookies.get("token"),
                },
                body: form,
            });

            let data = await response.json();
            if (!data.Images) return (images = []);

            allCount = data.Count;
            images = [];
            for (let img of data.Images) {
                let name = img.Path.split("/").pop().split(".").shift();
                images.push({
                    type: img.Type,
                    source: img.Path,
                    alt: "",
                    src: `${PUBLIC_GALLERY_BACKEND_URL}/compressed/${name}.webp`,
                });
            }

            images = images;
        } catch (e) {
            addToast({
                message:
                    "there was an error getting one or more of the images!",
                type: "error",
                dismissible: true,
                timeout: 1_000, // n*second
            });
            console.log("Error:", e);
        }
    }

    onMount(async () => {
        get_images();
    });

    function showImage(img) {
        overlay_content = {
            type: img.type,
            source: `${PUBLIC_GALLERY_BACKEND_URL}/image/${img.source
                .split("/")
                .pop()}`,
        };
        overlay = true;
    }

    function hideImage() {
        overlay = false;
    }

    function update_tags({ detail: _tags }) {
        page = 1;
        tags = _tags;
        if (tags.length > 0) {
            search_images();
        } else {
            get_images();
        }
    }

    function to_page(p) {
        page = p;
        if (tags.length > 0) search_images();
        else {
            get_images();
        }
        topbox.scrollIntoView();
    }

    let overlay = false;
    let overlay_content = {};
    let topbox;

    function createNumberArray(startingNumber, length, maxNumber) {
        const halfLength = Math.floor(length / 2);
        const numberArray = [];

        for (let i = -halfLength; i <= halfLength; i++) {
            const num = startingNumber + i;
            if(num <= maxNumber && num > 0 ) numberArray.push(Math.min(maxNumber, num));
        }
        return numberArray;
    }

    $: pageTabulation = createNumberArray(page, pageTabulationLimit, Math.ceil(allCount / pageLimit));
</script>

<div class="bg-gray-900 select-none min-h-screen w-screen">
    <div bind:this={topbox} />
    {#if overlay}
        <button
            on:click={() => hideImage()}
            class="bigImage bg-gray-900/75"
        >
            <div
                class="text-neutral-700 dark:text-neutral-200 m-auto bg-gray-900/95 p-10 rounded-lg"
            >
                {#if overlay_content.type == "image"}
                    <img
                        src={overlay_content.source}
                        alt="big overview of selected item"
                        class="max-h-[80vh]"
                    />
                {:else if overlay_content.type == "video"}
                    <!-- svelte-ignore a11y-media-has-caption -->
                    <video
                        controls
                        src={overlay_content.source}
                        class="max-h-[80vh]"
                    />
                {/if}
            </div>
        </button>
    {/if}
    <TagSearch on:tag={update_tags} />
    <section class="overflow-hidden text-gray-700">
        <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
            <div class="flex flex-wrap -m-1 md:-m-2">
                {#if images.length == 0}
                    <div class="text-white m-auto w-fit">
                        No images found 💩
                    </div>
                {/if}
                {#each images as image}
                    <button
                        class="flex flex-wrap 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full"
                        on:click={(_) => showImage(image)}
                    >
                        <div class="w-full p-1 md:p-2">
                            <img
                                class="block object-cover object-center w-full h-full rounded-lg
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
            <div class="w-fit text-white my-4 m-auto flex">
                {#each pageTabulation as pageNumber}
                    <button
                        class="{pageNumber == page
                            ? 'bg-indigo-700'
                            : 'bg-indigo-500'} cursor-pointer text-white hover:bg-indigo-700 hover:text-white block px-4 py-2 mx-1 rounded-md text-base font-medium w-fit"
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
        width: 100%;
        height: 100%;
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
