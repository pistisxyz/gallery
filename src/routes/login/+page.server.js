import { fail } from '@sveltejs/kit';

import { PRIVATE_AUTH_LOGIN_URL } from '$env/static/private';

export const actions = {
    logout: async ({ cookies, request }) => {
        await cookies.delete('token', {path: '/'});
    },
    login: async ({ cookies, request }) => {

        const data = await request.formData();

        try {
            let result = await fetch(PRIVATE_AUTH_LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/json' },
                body: `{ "username": "${data.get("username")}", "password": "${data.get("password")}" }`
            })
            let text = await result.text();

            if(result.status == 200){
                cookies.set('token', text, {
                    httpOnly: false,
                    maxAge: 60 * 60 * 24 * 7
                });
                return { success: true };
            } else {
                console.log(result.statusText)
			    return fail(result.status, { message: text });
            };
        } catch (error) {
            console.log('Error:', error);
        }
    }
};