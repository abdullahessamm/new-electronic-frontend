import { defineStore } from "pinia";
import axios from "../axios";

export const useMonthlyReportingIncentivesStore = defineStore('monthlyReportingIncentivesStore', {
    state: () => ({
        reports: []
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

                return state.reports.filter(ele => {
                    const eleDate = new Date(ele.date)
                    eleDate.setHours(0)
                    eleDate.setMinutes(0)
                    eleDate.setSeconds(0)
                    return (! dateFrom && ! dateTo) ? ! dateFrom && ! dateTo : (
                        ! dateTo ? eleDate >= dateFrom :
                        eleDate >= dateFrom && eleDate <= dateTo
                    ) 
            })}
        },
    }, // end of getters

    actions: {
        async initialize() {
            const response = await axios.get('monthly-reporting-incentives')
            this.reports = response.data.reports
        }, // end of initialize

        async refresh() {
            return this.initialize()
        }, // end of refresh

        async create(report) {
            const response = await axios.post('monthly-reporting-incentives', report)
            this.reports.unshift(response.data.report)
        }, // end of create

        async delete(report) {
            await axios.delete(`monthly-reporting-incentives/${report.id}`)
            const reportIndex = this.reports.findIndex(ele => ele.id === report.id)
            this.reports.splice(reportIndex, 1)
        }, // end of remove

        async update(id, form) {
            await axios.patch(`monthly-reporting-incentives/${id}`, form)

            this.reports[this.reports.findIndex(ele => ele.id == id)] = {
                ...this.reports[this.reports.findIndex(ele => ele.id == id)],
                ...form
            }

        }, // end of update

    }
})
