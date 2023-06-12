import { defineStore } from "pinia";
import axios from "../axios";

export const useImportsStore = defineStore('imports', {
    state: () => ({
        imports: []
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

                return state.imports.filter(ele => {
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
            const groupedImports = {}
            state.imports.forEach(ele => {
                const date = `${new Date(ele.created_at).getMonth() + 1}/${new Date(ele.created_at).getFullYear()}`
                groupedImports[date] ? groupedImports[date].push(ele) : groupedImports[date] = [ele]
            })

            Object.keys(groupedImports).forEach(key => {
                const monthImports = groupedImports[key]
                let sum = 0
                monthImports.forEach(i => sum += i.cost)
                groupedImports[key] = sum
            })
            
            return groupedImports
        }
    }, // end of getters

    actions: {
        async initialize() {
            const response = await axios.get('imports')
            this.imports = response.data.imports
        }, // end of initialize

        async refresh() {
            return this.initialize()
        }, // end of refresh

        async create(Import) {
            const { user } = Import
            delete Import.user
            const response = await axios.post('imports', Import)
            this.imports.unshift({
                ...response.data.import,
                user
            })
        }, // end of create

        async delete(Import) {
            await axios.delete(`imports/${Import.id}`)
            const importIndex = this.imports.findIndex(ele => ele.id === Import.id)
            this.imports.splice(importIndex, 1)
        }, // end of remove

        async update(id, form) {
            await axios.patch(`imports/${id}`, form)

            this.imports[this.imports.findIndex(ele => ele.id == id)] = {
                ...this.imports[this.imports.findIndex(ele => ele.id == id)],
                ...form
            }

        }, // end of update

    }
})