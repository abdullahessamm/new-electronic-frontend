<template>
    <div class="sparePartsPermits-page h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="initializing" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-toolbox" />
                            أذون قطع غيار
                        </h5>
                    </div>
                </div>

                <div class="row mt-5" v-if="authStore.can(availableAbilities.exports.fullIndex)">
                    <div class="col-12 col-md-6 col-lg-3 px-lg-5 mt-2">
                        <input type="text" placeholder="بحث..." class="form-control" v-model="filterString">
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
                                    <th scope="col" class="bg-transparent text-white px-3">رقم الاذن</th>
                                    <th scope="col" class="bg-transparent text-white px-3" v-if="authStore.isAdmin">بواسطة</th>
                                    <th scope="col" class="bg-transparent text-white px-3">رقم الحالة</th>
                                    <th scope="col" class="bg-transparent text-white px-3">اسم العميل</th>
                                    <th scope="col" class="bg-transparent text-white px-3">وصف القطعة المصروفة</th>
                                    <th scope="col" class="bg-transparent text-white px-3" style="width: 135px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="authStore.can(availableAbilities.sparePartsPermits.create) && sparePartsPermitsStore.filterByDate(dateRange[0], dateRange[1]).length > 10" class="border-top">
                                    <td class="px-3 py-4">
                                        <input type="text" class="form-control" placeholder="رقم الإذن..." v-model="addForm.permit_number">
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
                                                placeholder="وصف القطعة المصروفة..."
                                                v-model="addForm.description"
                                            >
                                        </div>
                                    </td>

                                    <td colspan="2" class="px-3 py-4">
                                        <button class="btn btn-primary" @click="createSparePartsPermit" :disabled="! addForm.permit_number || ! addForm.case_number || ! addForm.client_name || ! addForm.description || addForm.saving">
                                            <loading-component v-if="addForm.saving" width="20px"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-plus" />
                                                إضافة
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="sparePartsPermitsStore.filterByDate(dateRange[0], dateRange[1]).length == 0" class="mt-5">
                                    <td colspan="6" class="text-center">
                                            لا يوجد نتائج
                                    </td>
                                </tr>
                                <tr v-for="SparePartsPermit in filteredPermits" :key="SparePartsPermit.id">
                                    <td class="px-3">
                                        {{ new Date(SparePartsPermit.created_at).toLocaleDateString() }} <br>
                                        {{ new Date(SparePartsPermit.created_at).toLocaleTimeString() }}
                                    </td>
                                    
                                    <td class="px-3" v-if="SparePartsPermit.editMode">
                                        <input type="text" class="form-control" placeholder="رقم الأذن..." :value="SparePartsPermit.permit_number" @input="e => SparePartsPermit.updatedPermitNumber = e.target.value">
                                    </td>
                                    <td class="px-3" v-else>
                                        {{ SparePartsPermit.permit_number }}
                                    </td>

                                    <td class="px-3" v-if="SparePartsPermit.editMode && authStore.isAdmin">
                                        <input type="text" class="form-control" :value="`${SparePartsPermit.user.f_name} ${SparePartsPermit.user.l_name}`" disabled="true">
                                    </td>
                                    <td class="px-3" v-if="! SparePartsPermit.editMode && authStore.isAdmin">
                                        <b v-if="SparePartsPermit.user">{{ authStore.user.id === SparePartsPermit.user.id ? 'أنت' : `${SparePartsPermit.user.f_name} ${SparePartsPermit.user.l_name}` }}</b>
                                        <b v-else> غير معروف </b>
                                    </td>

                                    <td class="px-3" v-if="SparePartsPermit.editMode">
                                        <input type="text" class="form-control" placeholder="رقم الحالة..." :value="SparePartsPermit.case_number" @input="e => SparePartsPermit.updatedCaseNumber = e.target.value">
                                    </td>
                                    <td class="px-3" v-else> {{ SparePartsPermit.case_number }} </td>
                                    
                                    <td class="px-3" v-if="SparePartsPermit.editMode">
                                        <input type="text" class="form-control" placeholder="أسم العميل..." :value="SparePartsPermit.client_name" @input="e => SparePartsPermit.updatedClientName = e.target.value">
                                    </td>
                                    <td class="px-3" v-else>{{ SparePartsPermit.client_name }}</td>

                                    <td class="px-3" v-if="SparePartsPermit.editMode">
                                        <input type="text" class="form-control" placeholder="وصف القطعة المصروفة..."  :value="SparePartsPermit.description" @input="e => SparePartsPermit.updatedDescription = e.target.value">
                                    </td>
                                    <td class="px-3" v-else> {{ SparePartsPermit.description }} </td>
                                    <td class="px-3">
                                        
                                        <button v-if="authStore.can(availableAbilities.sparePartsPermits.update) && ! SparePartsPermit.editMode" class="btn btn-primary mx-1 my-1" @click="() => SparePartsPermit.editMode = true">
                                            <span>
                                                <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.sparePartsPermits.update) && SparePartsPermit.editMode" class="btn btn-primary mx-1 my-1" @click="() => updateSparePartsPermit(SparePartsPermit)">
                                            <loading-component width="20px" v-if="SparePartsPermit.updating"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                                                حفظ
                                            </span>
                                        </button>

                                        <button v-if="authStore.can(availableAbilities.sparePartsPermits.delete)  && ! SparePartsPermit.editMode" class="btn btn-danger mx-1 my-1" @click="() => deleteSparePartsPermit(SparePartsPermit)">
                                            <loading-component width="20px" v-if="SparePartsPermit.deleting"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-trash" />
                                            </span>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="authStore.can(availableAbilities.sparePartsPermits.create)" class="border-top">
                                    <td class="px-3 py-4">
                                        <input type="text" class="form-control" placeholder="رقم الإذن..." v-model="addForm.permit_number">
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
                                                placeholder="وصف القطعة المصروفة..."
                                                v-model="addForm.description"
                                            >
                                        </div>
                                    </td>

                                    <td colspan="2" class="px-3 py-4">
                                        <button class="btn btn-primary" @click="createSparePartsPermit" :disabled="! addForm.permit_number || ! addForm.case_number || ! addForm.client_name || ! addForm.description || addForm.saving">
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
import { useSparePartsPermitsStore } from '../stores/sparePartsPermits'
import LoadingPage from './LoadingPage.vue'
import { dataTable } from '../utils/excelMaker'

export default {
    name: "SparePartsPermitsPage",
    data: () => ({
        filterString: "",
        availableAbilities,
        authStore: useAuthStore(),
        sparePartsPermitsStore: useSparePartsPermitsStore(),
        initializing: false,
        dateRange: [],
        addForm: {
            saving: false,
            client_name: '',
            permit_number: '',
            case_number: '',
            description: ''
        },
        addFormErrors: {}
    }), // end of data

    computed: {
        filteredPermits() { return this.sparePartsPermitsStore.filterByString(this.filterString) }
    }, // end of computed

    methods: {
        deleteSparePartsPermit(SparePartsPermit) {
            this.$swal.fire({
                icon: 'question',
                title: `حذف الأذن ؟`
            })
            .then(res => {
                if (res.isConfirmed) {
                    SparePartsPermit.deleting = true
                    this.sparePartsPermitsStore.delete(SparePartsPermit)
                    .catch(() => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'حدث خطأ ما.',
                            showConfirmButton: false,
                        })
                    })
                    .finally(() => {
                        SparePartsPermit ? SparePartsPermit.deleting = false : undefined
                    })
                }
            })

        }, // end of deleteSparePartsPermit

        createSparePartsPermit() {
            if (! this.addForm.comment)
                delete this.addForm.comment
                
            this.addForm.saving = true
            this.addForm.user = this.authStore.user
            this.sparePartsPermitsStore.create(this.addForm)
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تمت عملية الإضافة.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                })

                this.addForm.case_number = ''
                this.addForm.client_name = ''
                this.addForm.permit_number = ''
                this.addForm.description = ''
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
        }, // end of createSparePartsPermit

        updateSparePartsPermit(SparePartsPermit) {
            this.$swal.fire({
                title: 'تحديث البيانات',
                html: `جارى تحديث ايراد <b>${new Date(SparePartsPermit.created_at).toLocaleString()}</b>. برجاء الانتظار...`,
                showCancelButton: false,
                showConfirmButton: false
            })

            SparePartsPermit.editMode = false
            const updates = {}
            SparePartsPermit.updatedPermitNumber ? updates.permit_number = SparePartsPermit.updatedPermitNumber : null
            SparePartsPermit.updatedCaseNumber ? updates.case_number = SparePartsPermit.updatedCaseNumber : null
            SparePartsPermit.updatedClientName ? updates.client_name = SparePartsPermit.updatedClientName : null
            SparePartsPermit.updatedDescription ? updates.description = SparePartsPermit.updatedDescription : null
            this.sparePartsPermitsStore.update(SparePartsPermit.id, updates)
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
        }, //end of updateSparePartsPermit

        downloadReport() {
            dataTable('أذون قطع غيار نيو الكترونيك', this.sparePartsPermitsStore.filterByDate(this.dateRange[0], this.dateRange[1]), [
                {
                    column: 'تاريخ العملية',
                    type: String,
                    value: ele => new Date(ele.created_at).toLocaleString(),
                    width: 30,
                    align: 'center'
                },
                {
                    column: 'رقم الاذن',
                    type: String,
                    value: ele => ele.permit_number,
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
                    column: 'وصف القطعة المصروفة',
                    type: String,
                    value: ele => ele.description,
                    width: 30,
                    align: 'center'
                },
            ])
        },// end of downloadReport
    }, // end of methods

    mounted() {
        // redirect if not permitted
        if (! this.authStore.can(availableAbilities.sparePartsPermits.index) && ! this.authStore.can(availableAbilities.sparePartsPermits.fullIndex)) {
            this.$router.push({name: 'home'})
            return
        }

        this.initializing = true;
        this.sparePartsPermitsStore.initialize()
        .then(() => {
            if (this.authStore.can(availableAbilities.sparePartsPermits.fullIndex))
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