<template>
    <div class="imports-page h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="initializing" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-sack-dollar" />
                            الإيرادات
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
                                    <th scope="col" class="bg-transparent text-white px-3">اسم العميل</th>
                                    <th scope="col" class="bg-transparent text-white px-3">التكلفة</th>
                                    <th scope="col" class="bg-transparent text-white px-3">ملاحظات</th>
                                    <th scope="col" class="bg-transparent text-white px-3" style="width: 135px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="authStore.can(availableAbilities.imports.create) && importsStore.filterByDate(dateRange[0], dateRange[1]).length > 10" class="border-top">
                                    <td class="px-3 py-4">
                                        <input type="text" class="form-control" disabled="true" :value="new Date().toLocaleDateString()" style="cursor: not-allowed">
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="أسم العميل..."
                                                v-model="addForm.customer_name"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="number"
                                                class="form-control"
                                                placeholder="التكلفة..."
                                                v-model="addForm.cost"
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
                                        <button class="btn btn-primary" @click="createImport" :disabled="addForm.saving || ! addForm.customer_name || ! addForm.cost">
                                            <loading-component v-if="addForm.saving" width="20px"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-plus" />
                                                إضافة
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="importsStore.filterByDate(dateRange[0], dateRange[1]).length == 0" class="mt-5">
                                    <td colspan="5" class="text-center">
                                            لا يوجد نتائج
                                    </td>
                                </tr>
                                <tr v-for="Import in importsStore.filterByDate(dateRange[0], dateRange[1])" :key="Import.id">
                                    <td class="px-3" v-if="Import.editMode">
                                        <input type="text" class="form-control" :value="new Date(Import.created_at).toLocaleString()" disabled="true">
                                    </td>
                                    <td class="px-3" v-else>
                                        {{ new Date(Import.created_at).toLocaleDateString() }} <br>
                                        {{ new Date(Import.created_at).toLocaleTimeString() }}
                                    </td>

                                    <td class="px-3" v-if="Import.editMode && authStore.isAdmin">
                                        <input type="text" class="form-control" :value="`${Import.user.f_name} ${Import.user.l_name}`" disabled="true">
                                    </td>
                                    <td class="px-3" v-if="! Import.editMode && authStore.isAdmin">
                                        <b v-if="Import.user">{{ authStore.user.id === Import.user.id ? 'أنت' : `${Import.user.f_name} ${Import.user.l_name}` }}</b>
                                        <b v-else> غير معروف </b>
                                    </td>

                                    <td class="px-3" v-if="Import.editMode">
                                        <input type="text" class="form-control" placeholder="أسم العميل..." :value="Import.customer_name" @input="e => Import.updatedCustomer_name = e.target.value">
                                    </td>
                                    <td class="px-3" v-else>{{ Import.customer_name }}</td>
                                    
                                    <td class="px-3" v-if="Import.editMode">
                                        <input type="number" class="form-control"  :value="Import.cost" @input="e => Import.updatedCost = e.target.value">
                                    </td>
                                    <td class="px-3" v-else> {{ Import.cost }}ج </td>
                                    
                                    <td class="px-3" v-if="Import.editMode">
                                        <input type="text" class="form-control" placeholder="ملاحظات..."  :value="Import.comment" @input="e => Import.updatedComment = e.target.value">
                                    </td>
                                    <td class="px-3" v-else> {{ Import.comment ?? 'لا يوجد ملاحظات' }} </td>
                                    <td class="px-3">
                                        
                                        <button v-if="authStore.can(availableAbilities.imports.update) && ! Import.editMode" class="btn btn-primary mx-1 my-1" @click="() => Import.editMode = true">
                                            <span>
                                                <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.imports.update) && Import.editMode" class="btn btn-primary mx-1 my-1" @click="() => updateImport(Import)">
                                            <loading-component width="20px" v-if="Import.updating"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                                                حفظ
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.imports.delete)  && ! Import.editMode" class="btn btn-danger mx-1 my-1" @click="() => deleteImport(Import)">
                                            <loading-component width="20px" v-if="Import.deleting"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-trash" />
                                            </span>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="authStore.can(availableAbilities.imports.create)" class="border-top">
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
                                                placeholder="أسم العميل..."
                                                v-model="addForm.customer_name"
                                            >
                                        </div>
                                    </td>
                                    <td class="px-3 py-4">
                                        <div class="form-group">
                                            <input
                                                type="number"
                                                class="form-control"
                                                placeholder="التكلفة..."
                                                v-model="addForm.cost"
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
                                        <button class="btn btn-primary" @click="createImport" :disabled="addForm.saving || ! addForm.customer_name || ! addForm.cost">
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
import { useImportsStore } from '../stores/imports'
import LoadingPage from './LoadingPage.vue'
import { dataTable } from '../utils/excelMaker'

export default {
    name: "ImportsPage",
    data: () => ({
        availableAbilities,
        authStore: useAuthStore(),
        importsStore: useImportsStore(),
        initializing: false,
        dateRange: [],
        addForm: {
            saving: false,
            customer_name: '',
            cost: '',
            comment: ''
        },
        addFormErrors: {}
    }), // end of data

    methods: {
        deleteImport(Import) {
            this.$swal.fire({
                icon: 'question',
                title: `حذف الإيراد ؟`
            })
            .then(res => {
                if (res.isConfirmed) {
                    Import.deleting = true
                    this.importsStore.delete(Import)
                    .catch(() => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'حدث خطأ ما.',
                            showConfirmButton: false,
                        })
                    })
                    .finally(() => {
                        Import ? Import.deleting = false : undefined
                    })
                }
            })

        }, // end of deleteImport

        createImport() {
            if (! this.addForm.comment)
                delete this.addForm.comment
                
            this.addForm.saving = true
            this.addForm.user = this.authStore.user
            this.importsStore.create(this.addForm)
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تمت عملية الإضافة.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })

                this.addForm.comment = ''
                this.addForm.customer_name = ''
                this.addForm.cost = ''
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
        }, // end of createImport

        updateImport(Import) {
            this.$swal.fire({
                title: 'تحديث البيانات',
                html: `جارى تحديث ايراد <b>${new Date(Import.created_at).toLocaleString()}</b>. برجاء الانتظار...`,
                showCancelButton: false,
                showConfirmButton: false
            })

            Import.editMode = false
            const updates = {}
            Import.updatedCustomer_name ? updates.customer_name = Import.updatedCustomer_name : null
            Import.updatedCost ? updates.cost = Import.updatedCost : null
            Import.updatedComment ? updates.comment = Import.updatedComment : null
            this.importsStore.update(Import.id, updates)
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
        }, //end of updateImport

        downloadReport() {
            dataTable('ايرادات نيو الكترونيك', this.importsStore.filterByDate(this.dateRange[0], this.dateRange[1]), [
                {
                    column: 'التاريخ والوقت',
                    type: String,
                    value: ele => new Date(ele.created_at).toLocaleString(),
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'أسم العميل',
                    type: String,
                    value: ele => ele.customer_name,
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'التكلفة',
                    type: String,
                    value: ele => ele.cost + 'ج',
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
        if (! this.authStore.can(availableAbilities.imports.index) && ! this.authStore.can(availableAbilities.imports.fullIndex)) {
            this.$router.push({name: 'home'})
            return
        }

        this.initializing = true;
        this.importsStore.initialize()
        .then(() => {
            if (this.authStore.can(availableAbilities.imports.fullIndex))
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