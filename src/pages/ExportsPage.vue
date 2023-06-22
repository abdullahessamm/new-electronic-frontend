<template>
    <div class="exports-page h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="initializing" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
                            المصروفات
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
                                    <th scope="col" class="bg-transparent text-white px-3">تاريخ العملية</th>
                                    <th scope="col" class="bg-transparent text-white px-3" v-if="authStore.isAdmin">بواسطة</th>
                                    <th scope="col" class="bg-transparent text-white px-3">التفاصيل</th>
                                    <th scope="col" class="bg-transparent text-white px-3">المبلغ</th>
                                    <th scope="col" class="bg-transparent text-white px-3">ملاحظات</th>
                                    <th scope="col" class="bg-transparent text-white px-3" style="width: 135px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="authStore.can(availableAbilities.exports.create) && exportsStore.filterByDate(dateRange[0], dateRange[1]).length > 10" class="border-top">
                                    <td class="px-3 py-4">
                                        <input type="text" class="form-control" disabled="true" :value="new Date().toLocaleDateString()" style="cursor: not-allowed">
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="التفاصيل..."
                                                v-model="addForm.reason"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="number"
                                                class="form-control"
                                                placeholder="المبلغ..."
                                                v-model="addForm.amount"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="ملاحظات..."
                                                v-model="addForm.comment"
                                            >
                                        </div>
                                    </td>

                                    <td class="px-3 py-4">
                                        <button class="btn btn-primary" @click="createExport" :disabled="addForm.saving || ! addForm.reason || ! addForm.amount">
                                            <loading-component v-if="addForm.saving" width="20px"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-plus" />
                                                إضافة
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="exportsStore.filterByDate(dateRange[0], dateRange[1]).length == 0" class="mt-5">
                                    <td colspan="5" class="text-center">
                                            لا يوجد نتائج
                                    </td>
                                </tr>
                                <tr v-for="Export in exportsStore.filterByDate(dateRange[0], dateRange[1])" :key="Export.id">
                                    <td class="px-3" v-if="Export.editMode">
                                        <input type="text" class="form-control" :value="new Date(Export.created_at).toLocaleString()" disabled="true">
                                    </td>
                                    <td class="px-3" v-else>
                                        {{ new Date(Export.created_at).toLocaleDateString() }} <br>
                                        {{ new Date(Export.created_at).toLocaleTimeString() }}
                                    </td>

                                    <td class="px-3" v-if="Export.editMode && authStore.isAdmin">
                                        <input type="text" class="form-control" :value="`${Export.user.f_name} ${Export.user.l_name}`" disabled="true">
                                    </td>
                                    <td class="px-3" v-if="! Export.editMode && authStore.isAdmin">
                                        <b v-if="Export.user">{{ authStore.user.id === Export.user.id ? 'أنت' : `${Export.user.f_name} ${Export.user.l_name}` }}</b>
                                        <b v-else> غير معروف </b>
                                    </td>

                                    <td class="px-3" v-if="Export.editMode">
                                        <input type="text" class="form-control" placeholder="التفاصيل..." :value="Export.reason" @input="e => Export.updatedReason = e.target.value">
                                    </td>
                                    <td class="px-3" v-else>{{ Export.reason }}</td>
                                    
                                    <td class="px-3" v-if="Export.editMode">
                                        <input type="number" class="form-control"  :value="Export.amount" @input="e => Export.updatedAmount = e.target.value">
                                    </td>
                                    <td class="px-3" v-else> {{ Export.amount }}ج </td>
                                    
                                    <td class="px-3" v-if="Export.editMode">
                                        <input type="text" class="form-control" placeholder="ملاحظات..."  :value="Export.comment" @input="e => Export.updatedComment = e.target.value">
                                    </td>
                                    <td class="px-3" v-else> {{ Export.comment ?? 'لا يوجد ملاحظات' }} </td>
                                    <td class="px-3">
                                        
                                        <button v-if="authStore.can(availableAbilities.exports.update) && ! Export.editMode" class="btn btn-primary mx-1 my-1" @click="() => Export.editMode = true">
                                            <span>
                                                <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.exports.update) && Export.editMode" class="btn btn-primary mx-1 my-1" @click="() => updateExport(Export)">
                                            <loading-component width="20px" v-if="Export.updating"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                                                حفظ
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.exports.delete)  && ! Export.editMode" class="btn btn-danger mx-1 my-1" @click="() => deleteExport(Export)">
                                            <loading-component width="20px" v-if="Export.deleting"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-trash" />
                                            </span>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="authStore.can(availableAbilities.exports.create)" class="border-top">
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
                                                placeholder="التفاصيل..."
                                                v-model="addForm.reason"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="number"
                                                class="form-control"
                                                placeholder="المبلغ..."
                                                v-model="addForm.amount"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                :class="`form-control ${addFormErrors.comment ? 'is-invalid' : ''}`"
                                                placeholder="ملاحظات..."
                                                v-model="addForm.comment"
                                            >
                                        </div>
                                    </td>

                                    <td class="px-3 py-4">
                                        <button class="btn btn-primary" @click="createExport" :disabled="addForm.saving || ! addForm.reason || ! addForm.amount">
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
import { useExportsStore } from '../stores/exports'
import LoadingPage from './LoadingPage.vue'
import { dataTable } from '../utils/excelMaker'

export default {
    name: "ExportsPage",
    data: () => ({
        availableAbilities,
        authStore: useAuthStore(),
        exportsStore: useExportsStore(),
        initializing: false,
        dateRange: [],
        addForm: {
            saving: false,
            reason: '',
            amount: '',
            comment: ''
        },
        addFormErrors: {}
    }), // end of data

    methods: {
        deleteExport(Export) {
            this.$swal.fire({
                icon: 'question',
                title: `حذف المصروف ؟`
            })
            .then(res => {
                if (res.isConfirmed) {
                    Export.deleting = true
                    this.exportsStore.delete(Export)
                    .catch(() => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'حدث خطأ ما.',
                            showConfirmButton: false,
                        })
                    })
                    .finally(() => {
                        Export ? Export.deleting = false : undefined
                    })
                }
            })

        }, // end of deleteExport

        createExport() {
            if (! this.addForm.comment)
                delete this.addForm.comment
                
            this.addForm.saving = true
            this.addForm.user = this.authStore.user
            this.exportsStore.create(this.addForm)
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تمت عملية الإضافة.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })

                this.addForm.comment = ''
                this.addForm.reason = ''
                this.addForm.amount = ''
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
        }, // end of createExport

        updateExport(Export) {
            this.$swal.fire({
                title: 'تحديث البيانات',
                html: `جارى تحديث مصروف <b>${new Date(Export.created_at).toLocaleString()}</b>. برجاء الانتظار...`,
                showCancelButton: false,
                showConfirmButton: false
            })

            Export.editMode = false
            const updates = {}
            Export.updatedReason ? updates.reason = Export.updatedReason : null
            Export.updatedAmount ? updates.amount = Export.updatedAmount : null
            Export.updatedComment ? updates.comment = Export.updatedComment : null
            this.exportsStore.update(Export.id, updates)
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
        }, //end of updateExport

        downloadReport() {
            dataTable(`مصروفات نيو الكترونيك`, this.exportsStore.filterByDate(this.dateRange[0], this.dateRange[1]), [
                {
                    column: 'التاريخ والوقت',
                    type: String,
                    value: ele => new Date(ele.created_at).toLocaleString(),
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'التفاصيل',
                    type: String,
                    value: ele => ele.reason,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'المبلغ',
                    type: String,
                    value: ele => ele.amount + 'ج',
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'ملاحظات',
                    type: String,
                    value: ele => ele.comment,
                    width: 30,
                    align: 'center'
                },
            ])
        },// end of downloadReport

    }, // end of methods

    mounted() {
        // redirect if not permitted
        if (! this.authStore.can(availableAbilities.exports.index) && ! this.authStore.can(availableAbilities.exports.fullIndex)) {
            this.$router.push({name: 'home'})
            return
        }

        this.initializing = true;
        this.exportsStore.initialize()
        .then(() => {
            if (this.authStore.can(availableAbilities.exports.fullIndex))
                this.dateRange = []
        })
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