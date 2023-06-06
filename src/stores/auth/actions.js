import axios from "../../axios";
import state from "./state";

export default {
    initialize: async (token) => {
        const response = await axios.get('auth/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        // setting default authorization header
        axios.defaults.headers.Authorization = `Bearer ${token}`
        
        // saving data to state
        state.user.id = response.data.tokenable.id
        state.user.f_name = response.data.tokenable.f_name
        state.user.l_name = response.data.tokenable.l_name
        state.user.username = response.data.tokenable.username
        state.user.email = response.data.tokenable.email
        state.user.abilities = response.data.abilities
    },

    login: async (username, password) => {
        const response = await axios.post('auth/login', {
            username, password
        })

        // setting default authorization header
        axios.defaults.headers.Authorization = `Bearer ${response.data.token}`

        // saving user to state
        response.data.user.abilities = response.data.user.abilities.split(',') // split abilities to array
        state.user = response.data.user
    },

    logout: async () => {
        await axios.post('auth/logout');
        // clear state
        state.user.id = null
        state.user.f_name = null
        state.user.l_name = null
        state.user.username = null
        state.user.email = null
        state.user.abilities = []
    }
}