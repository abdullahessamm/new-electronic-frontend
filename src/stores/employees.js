import { defineStore } from "pinia";
import axios from "../axios";

const maxLoadedEmps = 5

export const useEmployeesStore = defineStore('employeesStore', {
    state: () => ({
        loading: false,
        loaded: [],
        employees: []
    }),

    getters: {
        search: state => (key) => {
            return state.employees?.filter(
                emp => `${emp.name}`.match(new RegExp(key.trim()))
            ) ?? []
        }, // end of search
    },

    actions: {
        async sync() {
            const response = await axios.get('employees')
            this.$state.employees = response.data.employees
        },

        async load(id) {
            const response = await axios.get(`employees/${id}`)

            if (this.$state.loaded.length < maxLoadedEmps)
                this.$state.loaded.push(response.data.employee)
            else
                this.$state.loaded[0] = response.data.employee
        },

        updateEmp(id, frm) {
            return axios.patch(`employees/${id}`, frm)
        },

        async delEmp(id) {
            await axios.delete(`employees/${id}`)

            this.$state.employees = this.$state.employees.filter(emp => emp.id !== id)
            this.$state.loaded = this.$state.loaded.filter(emp => emp.id !== id)
        },

        async createEmp(frm) {
            await axios.put('employees', frm)
            await this.sync()
        },

        updateFees(id, frm) {
            return axios.patch(`employees/${id}/fees`, frm)
        },

        setAttendance(id) {
            return axios.patch(`employees/${id}/mark-day-attendance`)
        },
    },
})