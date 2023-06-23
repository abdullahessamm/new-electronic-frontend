import { defineStore } from "pinia";
import axios from "../axios";

export const useSparePartsPermitsStore = defineStore('sparePartsPermits', {
    state: () => ({
        sparePartsPermits: []
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

                return state.sparePartsPermits.filter(ele => {
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

        filterByString: state => key => {
            return state.sparePartsPermits.filter(
                sparePartsPermit =>
                    sparePartsPermit.client_name.match(new RegExp(key.trim())) ||
                    sparePartsPermit.permit_number.match(new RegExp(key)) ||
                    sparePartsPermit.case_number.match(new RegExp(key)) ||
                    sparePartsPermit.description.match(new RegExp(key))
            )
        },
    }, // end of getters

    actions: {
        async initialize() {
            const response = await axios.get('sparePartsPermits')
            this.sparePartsPermits = response.data.spare_parts_permits
        }, // end of initialize

        async refresh() {
            return this.initialize()
        }, // end of refresh

        async create(SparePartsPermit) {
            const { user } = SparePartsPermit
            delete SparePartsPermit.user
            const response = await axios.post('sparePartsPermits', SparePartsPermit)
            this.sparePartsPermits.unshift({
                ...response.data.spare_parts_permit,
                user
            })
        }, // end of create

        async delete(SparePartsPermit) {
            await axios.delete(`sparePartsPermits/${SparePartsPermit.id}`)
            const sparePartsPermitIndex = this.sparePartsPermits.findIndex(ele => ele.id === SparePartsPermit.id)
            this.sparePartsPermits.splice(sparePartsPermitIndex, 1)
        }, // end of remove

        async update(id, form) {
            await axios.patch(`sparePartsPermits/${id}`, form)

            this.sparePartsPermits[this.sparePartsPermits.findIndex(ele => ele.id == id)] = {
                ...this.sparePartsPermits[this.sparePartsPermits.findIndex(ele => ele.id == id)],
                ...form
            }

        }, // end of update

    }
})