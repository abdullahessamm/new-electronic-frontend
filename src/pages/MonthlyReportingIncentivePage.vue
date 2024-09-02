<template>
    <div class="h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="initializing" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-file-lines" />
                            تقرير الحافز الشهرى
                        </h5>
                    </div>
                </div>

                <div class="row mt-5" v-if="authStore.can(availableAbilities.exports.fullIndex)">
                    <div class="col-12 col-md-6 col-lg-3 px-lg-5 mt-2">
                        <div style="direction: ltr !important">
                            <VueDatePicker placeholder="أختر التاريخ" v-model="dateRange" :enable-time-picker="false" range></VueDatePicker>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-9 px-lg-5 text-left mt-2">
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

                <!-- Table -->
                <div class="row mt-5">
                    <div class="col-12 px-lg-5 px-0 overflow-x-auto">
                        <table class="table table-borderless overflow-x-auto">
                            <thead class="bg-color-main">
                                <tr>
                                    <th scope="col" class="bg-transparent text-white px-3">التاريخ</th>
                                    <th scope="col" class="bg-transparent text-white px-3">رقم الحالة</th>
                                    <th scope="col" class="bg-transparent text-white px-3">اسم العميل</th>
                                    <th scope="col" class="bg-transparent text-white px-3">حالة الضمان</th>
                                    <th scope="col" class="bg-transparent text-white px-3">التعليق</th>
                                    <th scope="col" class="bg-transparent text-white px-3">رسوم التحصيل</th>
                                    <th scope="col" class="bg-transparent text-white px-3">رقم SAP</th>
                                    <th scope="col" class="bg-transparent text-white px-3">موقف التالف</th>
                                    <th scope="col" class="bg-transparent text-white px-3" style="width: 135px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="authStore.can(availableAbilities.monthlyReportingIncentives.create) && reportsStore.filterByDate(dateRange[0], dateRange[1]).length > 0" class="border-top">
                                    <td class="px-3 py-4">
                                        <input
                                            type="text"
                                            class="form-control"
                                            disabled="true"
                                            :value="new Date().toLocaleDateString()"
                                            style="cursor: not-allowed"
                                        >
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="رقم الحالة..."
                                                v-model="addForm.case_number"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="أسم العميل..."
                                                v-model="addForm.client_name"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="حالة الضمان..."
                                                v-model="addForm.warranty_status"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="التعليق..."
                                                v-model="addForm.comment"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="number"
                                                class="form-control"
                                                placeholder="رسوم التحصيل..."
                                                v-model="addForm.collection_fees"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="رقم SAP..."
                                                v-model="addForm.sap_number"
                                            >
                                        </div>
                                    </td>

                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="checkbox"
                                                class="form-check-input"
                                                style="
                                                    width: 23px;
                                                    height: 23px;
                                                "
                                                v-model="addForm.damaged_position"
                                            >
                                        </div>
                                    </td>

                                    <td class="px-3 py-4">
                                        <button
                                        class="btn btn-primary"
                                        @click="createReport"
                                        :disabled="
                                            addForm.saving ||
                                            ! addForm.case_number ||
                                            ! addForm.client_name ||
                                            ! addForm.warranty_status ||
                                            ! addForm.collection_fees ||
                                            ! addForm.sap_number
                                        "
                                        >
                                            <loading-component v-if="addForm.saving" width="20px"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-plus" />
                                                إضافة
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="reportsStore.filterByDate(dateRange[0], dateRange[1]).length == 0" class="mt-5">
                                    <td colspan="5" class="text-center">
                                            لا يوجد نتائج
                                    </td>
                                </tr>
                                <tr v-for="report in reportsStore.filterByDate(dateRange[0], dateRange[1])" :key="report.id">
                                    <td class="px-3" v-if="report.editMode">
                                        <input type="text" class="form-control" :value="new Date(report.date).toLocaleString()" disabled="true">
                                    </td>
                                    <td class="px-3" v-else>
                                        {{ new Date(report.date).toLocaleDateString() }}
                                    </td>

                                    <td class="px-3" v-if="report.editMode">
                                        <input type="text" class="form-control" placeholder="رقم الحالة..." v-model="report.case_number">
                                    </td>
                                    <td class="px-3" v-else>{{ report.case_number }}</td>
                                    
                                    <td class="px-3" v-if="report.editMode">
                                        <input type="text" class="form-control" placeholder="أسم العميل..." v-model="report.client_name">
                                    </td>
                                    <td class="px-3" v-else>{{ report.client_name }}</td>

                                    <td class="px-3" v-if="report.editMode">
                                        <input type="text" class="form-control" placeholder="حالة الضمان..." v-model="report.warranty_status">
                                    </td>
                                    <td class="px-3" v-else>{{ report.warranty_status }}</td>
                                    
                                    <td class="px-3" v-if="report.editMode">
                                        <input type="text" class="form-control" placeholder="التعليق..."  v-model="report.comment">
                                    </td>
                                    <td class="px-3" v-else> {{ report.comment ?? 'لا يوجد التعليق' }} </td>

                                    <td class="px-3" v-if="report.editMode">
                                        <input type="number" class="form-control" min="0" v-model="report.collection_fees">
                                    </td>
                                    <td class="px-3" v-else> {{ report.collection_fees }}ج </td>

                                    <td class="px-3" v-if="report.editMode">
                                        <input type="text" class="form-control" placeholder="رقم SAP..."  v-model="report.sap_number">
                                    </td>
                                    <td class="px-3" v-else> {{ report.sap_number }} </td>

                                    <td class="px-3">
                                        <input type="checkbox" class="form-check-input" style="width: 23px; height: 23px;" v-model="report.damaged_position" :disabled="! report.editMode">
                                    </td>
                                    
                                    <td class="px-3">
                                        <button v-if="authStore.can(availableAbilities.monthlyReportingIncentives.update) && ! report.editMode" class="btn btn-primary mx-1 my-1" @click="() => report.editMode = true">
                                            <span>
                                                <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.monthlyReportingIncentives.update) && report.editMode" class="btn btn-primary mx-1 my-1" @click="() => updateReport(report)">
                                            <loading-component width="20px" v-if="report.updating"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                                                حفظ
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.monthlyReportingIncentives.delete)  && ! report.editMode" class="btn btn-danger mx-1 my-1" @click="() => deleteReport(report)">
                                            <loading-component width="20px" v-if="report.deleting"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-trash" />
                                            </span>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="authStore.can(availableAbilities.monthlyReportingIncentives.create)" class="border-top">
                                    <td class="px-3 py-4">
                                        <input
                                            type="text"
                                            class="form-control"
                                            disabled="true"
                                            :value="new Date().toLocaleDateString()"
                                            style="cursor: not-allowed"
                                        >
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="رقم الحالة..."
                                                v-model="addForm.case_number"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="أسم العميل..."
                                                v-model="addForm.client_name"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="حالة الضمان..."
                                                v-model="addForm.warranty_status"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="التعليق..."
                                                v-model="addForm.comment"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="number"
                                                class="form-control"
                                                placeholder="رسوم التحصيل..."
                                                v-model="addForm.collection_fees"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="رقم SAP..."
                                                v-model="addForm.sap_number"
                                            >
                                        </div>
                                    </td>

                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="checkbox"
                                                class="form-check-input"
                                                style="
                                                    width: 23px;
                                                    height: 23px;
                                                "
                                                v-model="addForm.damaged_position"
                                            >
                                        </div>
                                    </td>

                                    <td class="px-3 py-4">
                                        <button
                                        class="btn btn-primary"
                                        @click="createReport"
                                        :disabled="
                                            addForm.saving ||
                                            ! addForm.case_number ||
                                            ! addForm.client_name ||
                                            ! addForm.warranty_status ||
                                            ! addForm.collection_fees ||
                                            ! addForm.sap_number
                                        "
                                        >
                                            <loading-component v-if="addForm.saving" width="20px"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-plus" />
                                                إضافة
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import AddButton from '../components/AddButton.vue'
import LoadingComponent from '../components/LoadingComponent.vue'
import availableAbilities from '../extras/availableAbilities'
import { useAuthStore } from '../stores/auth'
import { useMonthlyReportingIncentivesStore } from '../stores/monthlyReportingIncentives'
import LoadingPage from './LoadingPage.vue'
import { dataTable } from '../utils/excelMaker'

export default {
    name: "MonthlyReportingIncentivesPage",
    data: () => ({
        availableAbilities,
        authStore: useAuthStore(),
        reportsStore: useMonthlyReportingIncentivesStore(),
        initializing: false,
        dateRange: [],
        addForm: {
            saving: false,
            case_number: '',
            client_name: '',
            warranty_status: '',
            collection_fees: '',
            sap_number: '',
            comment: '',
            damaged_position: false,
        },
        addFormErrors: {}
    }), // end of data

    methods: {
        deleteReport(report) {
            this.$swal.fire({
                icon: 'question',
                title: `حذف ؟`
            })
            .then(res => {
                if (res.isConfirmed) {
                    report.deleting = true
                    this.reportsStore.delete(report)
                    .catch(() => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'حدث خطأ ما.',
                            showConfirmButton: false,
                        })
                    })
                    .finally(() => {
                        report ? report.deleting = false : undefined
                    })
                }
            })

        }, // end of deleteReport

        createReport() {
            if (! this.addForm.comment)
                delete this.addForm.comment
                
            this.addForm.saving = true
            this.reportsStore.create(this.addForm)
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تمت عملية الإضافة.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })

                this.addForm = {
                    saving: false,
                    case_number: '',
                    client_name: '',
                    warranty_status: '',
                    collection_fees: '',
                    sap_number: '',
                    comment: '',
                    damaged_position: false,
                }
            })
            .catch(err => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'حدث خطأ تأكد من البيانات.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })
            })
            .finally(() => this.addForm.saving = false)
        }, // end of createReport

        updateReport(report) {
            this.$swal.fire({
                title: 'جار تحديث البيانات',
                showCancelButton: false,
                showConfirmButton: false
            })

            report.editMode = false
            this.reportsStore.update(report.id, report)
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تم التحديث بنجاح.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })
            })
            .catch(() => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'حدث خطأ تأكد من البيانات.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })
            })
        }, //end of updateReport

        downloadReport() {
            dataTable('تقرير الحافز الشهرى', this.reportsStore.filterByDate(this.dateRange[0], this.dateRange[1]), [
                {
                    column: 'التاريخ والوقت',
                    type: String,
                    value: ele => new Date(ele.date).toLocaleString(),
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'رقم الحالة',
                    type: String,
                    value: ele => ele.case_number,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'أسم العميل',
                    type: String,
                    value: ele => ele.client_name,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'حالة الضمان',
                    type: String,
                    value: ele => ele.warranty_status,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'التعليق',
                    type: String,
                    value: ele => ele.comment,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'رسوم التحصيل',
                    type: String,
                    value: ele => ele.collection_fees + 'ج',
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'رقم SAP',
                    type: String,
                    value: ele => ele.sap_number,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'موقف التالف',
                    type: String,
                    value: ele => ele.damaged_position ? '✓' : '',
                    width: 30,
                    align: 'center'
                },
            ])
        },// end of downloadReport
    }, // end of methods

    mounted() {
        // redirect if not permitted
        if (! this.authStore.can(availableAbilities.monthlyReportingIncentives.index)) {
            this.$router.push({name: 'home'})
            return
        }

        this.initializing = true;
        this.reportsStore.initialize()
        .catch(err => {
            this.$swal.fire({
                icon: 'error',
                title: 'حدث خطأ ما.',
                showConfirmButton: false,
            })
        })
        .finally(() => this.initializing = false)

    }, // end of mounted

    components: {
        LoadingPage, LoadingComponent, AddButton
    }, //end of components
}
</script>