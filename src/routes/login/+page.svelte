<form class="max-w-md pt-8 m-auto mt-24">
    <h1 class="flex justify-center text-3xl mb-5 textmb-2 text-indigo-500 font-semibold">Login</h1>
    <hr class="opacity-50">
    <div>
        <label class="block mb-2 text-indigo-500 font-semibold" for="username">Username</label>
        <input  class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="text" name="username">
    </div>
    <div>
        <label class="block mb-2 text-indigo-500 font-semibold" for="password">Password</label>
        <input  class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="password" name="password">
    </div>
    <div class="flex justify-between items-center">
        <div class="mb-5">
            <input type="checkbox" class="">
            <lable class="text-indigo-500 font-semibold">Remember me?</lable>
        </div>
        <div class="mb-5">
            <!-- Добави forgot password page -->
            <a href="/" class="text-amber-100  font-semibold">Forgot Password</a>
        </div>
    </div>
    <div>          
        <input class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded" type="submit">
    </div>

</form>

