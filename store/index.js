//state
export const state = () => ({
    authenticated: null,
    admin: false
})

//mutations
export const mutations = {
    authCheck(state, auth){
        state.authenticated = auth;
    },
    setAdmin(state, admin){
        state.admin = admin;
    },
}