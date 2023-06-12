import { defineStore } from "pinia"
import axios from "../axios"

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
    }), // end of state

    getters: {
        numOfUsers: state => state.users.length,
        search: state => (key) => {
            return state.users.filter(
                user => `${user.f_name} ${user.l_name}`.match(new RegExp(key.trim())) ||
                        user.email.match(new RegExp(key)) ||
                        user.username.match(new RegExp(key)) 
            )
        }, // end of search
        getUser: state => id => state.users.find(user => user.id == id)
    }, // end of getters

    actions: {
        async initialize() {
            const response = await axios.get('users')
            this.users = response.data.users
        }, // end of initialize

        async refresh() {
            return this.initialize()
        }, // end of refresh

        async create(user) {
            const response = await axios.put('users', user)
            this.users.push(response.data.user)
        }, // end of create

        async delete(user) {
            await axios.delete(`users/${user.id}`)
            const userIndex = this.users.findIndex(ele => ele.id === user.id)
            this.users.splice(userIndex, 1)
        }, // end of remove

        async update(id, form) {
            const change = {}
            const user = this.getUser(id)
            if (form.f_name !== user.f_name)
                change.f_name = form.f_name

            if (form.l_name !== user.l_name)
                change.l_name = form.l_name

            if (form.email !== user.email)
                change.email = form.email

            if (form.username !== user.username)
                change.username = form.username

            if (form.password)
                change.password = form.password

            change.abilities = form.abilities

            const userIndex = this.users.findIndex(ele => ele.id == id)
            await axios.patch(`users/${id}`, change)

            change.abilities = change.abilities.join(',')

            Object.keys(change).forEach(key => {
                this.users[userIndex][key] = change[key]
            })
        }
    }, //end of actions
})