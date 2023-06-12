import { defineStore } from "pinia";
import axios from "../axios";

export const useExportsStore = defineStore('exports', {
    state: () => ({
        exports: []
    }), // end of state

    getters: {
        filterByDate: state => {
            return (dateFrom, dateTo) => {
                dateFrom?.setHours(0)
                dateFrom?.setMinutes(0)
                dateFrom?.setSeconds(0)

                dateTo?.setHours(0)
                dateTo?.setMinutes(0)
                dateTo?.setSeconds(0)

                return state.exports.filter(ele => {
                    const eleDate = new Date(ele.created_at)
                    eleDate.setHours(0)
                    eleDate.setMinutes(0)
                    eleDate.setSeconds(0)
                    return (! dateFrom && ! dateTo) ? ! dateFrom && ! dateTo : (
                        ! dateTo ? eleDate >= dateFrom :
                        eleDate >= dateFrom && eleDate <= dateTo
                    ) 
            })}
        },

        sumGroupByMonth: state => {
            const groupedExports = {}
            state.exports.forEach(ele => {
                const date = `${new Date(ele.created_at).getMonth() + 1}/${new Date(ele.created_at).getFullYear()}`
                groupedExports[date] ? groupedExports[date].push(ele) : groupedExports[date] = [ele]
            })

            Object.keys(groupedExports).forEach(key => {
                const monthExports = groupedExports[key]
                let sum = 0
                monthExports.forEach(ex => sum += ex.amount)
                groupedExports[key] = sum
            })
            
            return groupedExports
        }
    }, // end of getters

    actions: {
        async initialize() {
            const response = await axios.get('exports')
            this.exports = response.data.exports
        }, // end of initialize

        async refresh() {
            return this.initialize()
        }, // end of refresh

        async create(Export) {
            const { user } = Export
            delete Export.user
            const response = await axios.post('exports', Export)
            this.exports.unshift({
                ...response.data.export,
                user
            })
        }, // end of create

        async delete(Export) {
            await axios.delete(`exports/${Export.id}`)
            const exportIndex = this.exports.findIndex(ele => ele.id === Export.id)
            this.exports.splice(exportIndex, 1)
        }, // end of remove

        async update(id, form) {
            await axios.patch(`exports/${id}`, form)

            this.exports[this.exports.findIndex(ele => ele.id == id)] = {
                ...this.exports[this.exports.findIndex(ele => ele.id == id)],
                ...form
            }

        }, // end of update

    }
})