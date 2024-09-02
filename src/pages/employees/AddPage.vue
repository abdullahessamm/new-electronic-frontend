<template>
    <div class="user-add-page position-absolute top-0 w-100 h-100 z-2 bg-body overflow-y-auto">
        <div class="container my-3">
            <div class="row mb-4">
                <div class="col-12">
                    <h5>
                        <font-awesome-icon icon="fa-solid fa-user-plus" />
                        إضافة موظف
                    </h5>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-12 mb-3">
                    <label for="name-input"> الاسم بالكامل </label>
                    <input
                        type="text"
                        id="name-input"
                        :class="`form-control mt-1 ${formErrors.name ? 'is-invalid' : empForm.name.length > 0 ? 'is-valid' : ''}`"
                        v-model="empForm.name"
                    >
                    <div class="invalid-feedback"> {{ formErrors.name }} </div>
                </div>
                <div class="form-group col-12 mb-3">
                    <label for="name-input"> الراتب </label>
                    <input
                        type="number"
                        id="name-input"
                        min="0"
                        max="999999.99"
                        :class="`form-control mt-1 ${formErrors.salary ? 'is-invalid' : empForm.salary.length > 0 ? 'is-valid' : ''}`"
                        v-model="empForm.salary"
                    >
                    <div class="invalid-feedback"> {{ formErrors.salary }} </div>
                </div>
            </div>
        </div>

        <div class="save-btn px-3 pb-4 text-left">
            <button @click="saveEmployee" class="btn btn-success px-3 py-2" :disabled="formHasErrors || formHasEmptyFields || saving">
                <loading-component v-if="saving" width="20px"></loading-component>
                <span v-else>
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" style="margin-left: 5px"/>
                    حفظ
                </span>

            </button>
        </div>
    </div>
</template>

<script>
import LoadingComponent from '../../components/LoadingComponent.vue';
import validationMsgs from '../../extras/validationMsgs'
import availableAbilities from '../../extras/availableAbilities';
import { useAuthStore } from '../../stores/auth';
import { useEmployeesStore } from '../../stores/employees';

export default {
    name: 'UserAddPage',
    data: () => ({
        authStore: useAuthStore(),
        empsStore: useEmployeesStore(),
        saving: false,
        availableAbilities,
        
        empForm: {
            name: '',
            salary: ''
        }, //user

        formErrors: {},
    }), // end of data

    computed: {
        formHasErrors() {
            return Object.keys(this.formErrors).length > 0
        }, // end of formHasErrors

        formHasEmptyFields() {
            return ! this.empForm.name || ! this.empForm.salary
        }
    }, // end of computed

    methods: {
        saveEmployee() {
            this.saving = true
            this.empsStore.createEmp({
                salary: this.empForm.salary,
                name: this.empForm.name
            }).then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تم إنشاء موظف جديد.',
                    showConfirmButton: true
                })

                this.$router.push({name: 'employees.index'})
            }).catch(err => {
                if (err.response.status === 400) {

                    this.$swal.fire({
                        icon: 'error',
                        title: 'يوجد خطأ بالبيانات.',
                        showConfirmButton: false,
                        cancelButtonText: 'مراجعة'
                    })
                } else {
                    this.$swal.fire({
                        icon: 'error',
                        title: 'يوجد خطأ بالشبكة.',
                        showConfirmButton: false,
                        cancelButtonText: 'إغلاق'
                    })
                }
            }).finally(() => this.saving = false)
        }, // end of saveEmployee
    }, //end of methods

    watch: {
        empForm: {
            handler(val) {
                // name validate
                if (! /^[a-zA-Z\u0621-\u064A\ ]{2,100}$/.test(val.name) && val.name)
                    this.formErrors.name = validationMsgs.name
                else
                    delete this.formErrors.name

                // salary validate
                if (val.salary) {
                    if (parseFloat(val.salary) >= 999999.99 || parseFloat(val.salary) < 1)
                        this.formErrors.salary = validationMsgs.salary
                    else
                        delete this.formErrors.salary
                } else {
                    this.formErrors.salary = validationMsgs.salary
                }
            },
            deep: true
        },
    }, //end of watch

    mounted() {
        if (! this.authStore.can(this.availableAbilities.employees.create))
            this.$router.push({name: 'home'})
    }, // end of mounted

    components: {
        LoadingComponent
    }, // end of components
}
</script>