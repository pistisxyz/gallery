<script lang="ts">
    type Tag = { tag_name: string };

    import { PUBLIC_GALLERY_BACKEND_URL } from "$env/static/public";
    import cookies from "$lib/cookies.js";
    import { addToast } from "$lib/stores/toastStore";
    import { createEventDispatcher, onMount } from "svelte";
    import { browser } from "$app/environment";

    let emit = createEventDispatcher<{ tag: string[] }>();
    let input = "";
    let tags = [] as string[];
    let allTags = [] as string[];
    let matchingTags = [] as string[];
    let searchSugestions = false;

    onMount(async () => {
        if (browser) {
            try {
                let response = await fetch(
                    PUBLIC_GALLERY_BACKEND_URL + "/search",
                    {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer " + cookies.get("token"),
                        },
                    }
                );

                let data = (await response.json()) as Tag[];
                if (!data) return;
                allTags = data.map((v) => v.tag_name);
            } catch (e) {
                console.error(e);
            }
        }
    });

    const regex = /(image_name|user):\s*(?:"([^"]*)"|([^ ]+))/g;

    function add_tag({ key }: KeyboardEvent) {
        if (key == "Enter") {
            let tag = input.toLowerCase();
            let match = regex.exec(tag)
            if(match){ // TODO: MAKE BACKEND WORK
              let matches: Object[] = []
              function add_match(m: RegExpExecArray){
                const [, type, quotedValue, nonQuotedValue] = m;
                const value = quotedValue !== undefined ? quotedValue : nonQuotedValue;
                matches.push({ type, value });
              }
              add_match(match)
              while ((match = regex.exec(tag)) !== null) {
                add_match(match)
              }

              console.log(matches)
            } else if (tag.length > 2) {
                if (!allTags.includes(tag))
                    return addToast({
                        message: "no tag with that name!",
                        type: "error",
                        timeout: 1_000, // n*second
                    });
                // page = 1;
                tags.unshift(tag);
                tags = [...new Set(tags)];
                // search_images()
                emit("tag", tags);
            }
            input = "";
            matchingTags = [];
            searchSugestions = false;
        } else {
            if (input.length > 0) {
                matchingTags = allTags.filter((item) =>
                    item.toLowerCase().includes(input.toLowerCase())
                );
                searchSugestions = true;
            } else {
                matchingTags = [];
                searchSugestions = false;
            }
        }
    }

    function add_tag_sugestion(tag: string) {
        searchSugestions = false;
        matchingTags = [];
        input = "";
        // page = 1;
        tags.unshift(tag.toLowerCase());
        tags = [...new Set(tags)];
        // search_images();
        emit("tag", tags);
    }

    function remove_tag(index: number) {
        tags.splice(index, 1);
        tags = [...new Set(tags)];
        emit("tag", tags);
    }
</script>

<div>
    <div class="flex justify-center pt-4">
        <div class="mb-3 w-1/2">
            <div class="relative mb-4 flex w-full flex-wrap items-stretch">
                <input
                    autocomplete="off"
                    bind:value={input}
                    on:keyup={add_tag}
                    on:focus={() => {
                        searchSugestions = true;
                    }}
                    on:blur={() => {
                        setTimeout(() => (searchSugestions = false), 200);
                    }}
                    id="tags"
                    class="mt-2 mb-2 p-1 dark:bg-gray-700 bg-white w-full text-base text-indigo-500 font-semibold rounded-md outline-none dark:hover:bg-gray-800 hover:bg-neutral-200"
                    type="text"
                />
                {#if searchSugestions && matchingTags.length > 0}
                    <ul
                        class="absolute z-10 top-10 bg-gray-700 border border-gray-700 w-full mt-2 text-white"
                    >
                        {#each matchingTags as item}
                            <li
                                class="pl-8 pr-2 py-1 border-b-2 border-gray-700 relative cursor-pointer hover:bg-gray-600 hover:text-gray-900"
                            >
                                <button
                                    class="w-full h-full"
                                    on:mousedown={(_) => add_tag_sugestion(item)}
                                >
                                    <svg
                                        class="absolute w-4 h-4 left-2 top-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    {item}
                                </button>
                            </li>
                        {/each}
                    </ul>
                {/if}
                {#each tags as tag, i}
                    <div
                        class="center relative inline-block select-none whitespace-nowrap rounded-md bg-indigo-800 py-2 m-1 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white"
                    >
                        <div class="flex mt-px">
                            <div class="h-fit m-auto pl-1">{tag}</div>
                            <div
                                role="button"
                                tabindex="0"
                                class="h-5 w-5 p-1"
                                on:click={(_) => remove_tag(i)}
                                on:keypress
                            >
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
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
