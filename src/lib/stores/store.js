// @ts-nocheck
import storage from '$lib/storage.js'


const stores = {
    auth: storage("auth", false)
}


function set(name, value) {
    stores[name].set(value)
    return stores[name];
}


function get(name){
    return stores[name]
}


export default {
    get, set
}