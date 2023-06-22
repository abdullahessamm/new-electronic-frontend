import { defineStore } from "pinia"
import axios from "../../axios"

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {
            id: null,
            f_name: null,
            l_name: null,
            username: null,
            email: null,
            abilities: [],
        }
    }), // end of state

    getters: {
        isAdmin: (state) => state.user.abilities.indexOf('*') !== -1,
        isLoggedIn: (state) => state.user.id !== null,
        fullName: (state) => `${state.user.f_name} ${state.user.l_name}`,
        can: (state) => (ability) => {
            return state.user.abilities.indexOf(ability) !== -1 || state.user.abilities.indexOf('*') !== -1
        }, 
    }, // end of getters
    
    actions: {
        async initialize (token) {
            const response = await axios.get('auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            // setting default authorization header
            axios.defaults.headers.Authorization = `Bearer ${token}`
            
            // saving data to state
            this.user.id = response.data.tokenable.id
            this.user.f_name = response.data.tokenable.f_name
            this.user.l_name = response.data.tokenable.l_name
            this.user.username = response.data.tokenable.username
            this.user.email = response.data.tokenable.email
            this.user.abilities = response.data.abilities
        },
    
        async login (username, password) {
            const response = await axios.post('auth/login', {
                username, password
            })
    
            // add token to local storage
            localStorage.setItem('token', response.data.token)
    
            // setting default authorization header
            axios.defaults.headers.Authorization = `Bearer ${response.data.token}`
    
            // saving user to state
            response.data.user.abilities = response.data.user.abilities.split(',') // split abilities to array
            this.user = response.data.user
        },
    
        async logout () {
            await axios.post('auth/logout');
            // clear state
            this.user.id = null
            this.user.f_name = null
            this.user.l_name = null
            this.user.username = null
            this.user.email = null
            this.user.abilities = []
        },

        async update(data) {
            if (data.email === this.$state.user.email)
                delete data.email

            if (data.username === this.$state.user.username)
                delete data.username

            const response = await axios.patch('profile/settings', data)

            if (data.password) {
                localStorage.removeItem('token')
                // clear state
                this.user.id = null
                this.user.f_name = null
                this.user.l_name = null
                this.user.username = null
                this.user.email = null
                this.user.abilities = []
            }
        }
    }, // end of actions
})