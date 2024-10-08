<template>
    <div class="statistics-page  h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="! importsStoreInitialized || ! exportsStoreInitialized" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid text-center">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-chart-line" />
                            الأحصائيات
                        </h5>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-12 text-right">
                        <button class="btn btn-excel color-main" @click="downloadReport">
                            <span class="ico">
                                <font-awesome-icon icon="fa-solid fa-file-excel" />
                            </span>
                            <span style="margin-right: 7px;">
                                إستخراج الى ملف اكسل
                            </span>
                        </button>
                    </div>
                </div>

                <div class="row mt-5 bg-color-main text-white">
                    <div class="col-3 head"> الشهر </div>
                    <div class="col-3 head"> مجموع الإيرادات </div>
                    <div class="col-3 head"> مجموع المصروفات </div>
                    <div class="col-3 head"> الأجمالى </div>
                </div>

                <div class="row border-bottom py-2" v-for="month in months" :key="month">
                    <div class="col-3">
                        {{ month }}
                    </div>
                    <div class="col-3">
                        {{ monthsHistory[month].imports }}ج
                    </div>
                    <div class="col-3">
                        {{ monthsHistory[month].exports }}ج
                    </div>
                    <div class="col-3">
                        {{ monthsHistory[month].imports - monthsHistory[month].exports }}ج
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import availableAbilities from '../extras/availableAbilities'
import { useAuthStore } from '../stores/auth'
import { useImportsStore } from '../stores/imports'
import { useExportsStore } from '../stores/exports'
import LoadingPage from '../pages/LoadingPage.vue'
import { dataTable } from '../utils/excelMaker'

export default {
    name: "StatisticsPage",
    data: () => ({
        authStore: useAuthStore(),
        importsStore: useImportsStore(),
        exportsStore: useExportsStore(),
        importsStoreInitialized: false,
        exportsStoreInitialized: false,
        monthsHistory: {}
    }), // end of data

    computed: {
        months() {
            return Object.keys(this.monthsHistory)
        },

        getArrayData() {
            return Object.keys(this.monthsHistory).map(key => ({
                month: key,
                imports: this.monthsHistory[key].imports,
                exports: this.monthsHistory[key].exports,
                total: this.monthsHistory[key].imports - this.monthsHistory[key].exports,
            }))
        }
    }, // end of computed

    methods: {
        downloadReport() {
            dataTable('أحصائيات نيو الكترونيك', this.getArrayData, [
                {
                    column: 'الشهر',
                    type: String,
                    value: ele => ele.month,
                    width: 20,
                    align: 'center'
                },
                {
                    column: 'مجموع الإيرادات',
                    type: String,
                    value: ele => ele.imports + 'ج',
                    width: 20,
                    align: 'center'
                },
                {
                    column: 'مجموع المصروفات',
                    type: String,
                    value: ele => ele.exports + 'ج',
                    width: 20,
                    align: 'center'
                },
                {
                    column: 'الإجمالى',
                    type: String,
                    value: ele => ele.total + 'ج',
                    width: 20,
                    align: 'center'
                },
            ])
        },
    }, // end of methods

    mounted() {
        // redirect if not permitted
        if (! this.authStore.can(availableAbilities.statistics.show)) {
            this.$router.push({name: 'home'})
            return
        }

        this.importsStore.initialize()
        .then(() => {
            this.importsStoreInitialized = true
            Object.keys(this.importsStore.sumGroupByMonth).forEach(key => {
                this.monthsHistory[key] ? 
                    this.monthsHistory[key].imports = this.importsStore.sumGroupByMonth[key] :
                    this.monthsHistory[key] = { imports: this.importsStore.sumGroupByMonth[key] }
            })
        })
        .catch(err => {
            this.$swal.fire({
                icon: 'error',
                title: 'حدث خطأ اثناء جلب البيانات.',
                showConfirmButton: false,
                cancelButoonText: 'موافق'
            })
        })

        this.exportsStore.initialize()
        .then(() => {
            this.exportsStoreInitialized = true
            Object.keys(this.exportsStore.sumGroupByMonth).forEach(key => {
                this.monthsHistory[key] ? 
                    this.monthsHistory[key].exports = this.exportsStore.sumGroupByMonth[key] :
                    this.monthsHistory[key] = { exports: this.exportsStore.sumGroupByMonth[key] }
            })
        })
        .catch(err => {
            this.$swal.fire({
                icon: 'error',
                title: 'حدث خطأ اثناء جلب البيانات.',
                showConfirmButton: false,
                cancelButoonText: 'موافق'
            })
        })

    }, // end of mounted

    components: { LoadingPage }
}
</script>