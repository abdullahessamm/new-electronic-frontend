<template>
    <div class="users-index-page h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="initializing" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-users" />
                            <span> الموظفين ({{ empsStore.employees.length }}) </span>
                        </h5>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-12 px-lg-5 px-0 overflow-x-auto">
                        <div class="text-center mt-5" v-if="empsStore.$state.employees.length == 0">
                            لا يوجد نتائج
                        </div>
                        <table class="table table-borderless overflow-x-auto" v-else>
                            <thead class="bg-color-main">
                                <tr>
                                    <th scope="col" class="bg-transparent text-white px-3">اسم الموظف</th>
                                    <th scope="col" class="bg-transparent text-white px-3" v-if="authStore.$state.user.abilities.indexOf('*') > -1">الراتب</th>
                                    <th scope="col" class="bg-transparent text-white px-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in empsStore.$state.employees" :key="emp.id">
                                    <td class="px-3">
                                        <router-link :to="`/employees/${emp.id}`" class="text-decoration-none text-black">
                                            <b> {{ emp.name }} </b>
                                        </router-link>
                                    </td>
                                    <td class="px-3" v-if="authStore.$state.user.abilities.indexOf('*') > -1">{{ emp.salary }}ج</td>
                                    <td class="px-3">
                                        <button v-if="authStore.can(availableAbilities.employees.delete)" class="btn btn-danger" @click="() => deleteUser(emp)">
                                            <loading-component width="20px" v-if="emp.deleting"></loading-component>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-trash" />
                                                حذف
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
        <router-view v-slot="{ Component }">
            <transition name="page">
                <component :is="Component" />
            </transition>
        </router-view>
        <div
        v-if="! initializing && authStore.can(availableAbilities.employees.create)"
        class="floating-btn floating-btn-left floating-btn-bottom m-3 d-inline-flex"
        @click="$router.push({name: 'employees.add'})"
        >
            <add-button></add-button>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth'
import availableAbilities from '../../extras/availableAbilities'
import LoadingPage from '../LoadingPage.vue'
import AddButton from '../../components/AddButton.vue'
import LoadingComponent from '../../components/LoadingComponent.vue'
import { useEmployeesStore } from '../../stores/employees'

export default {
    name: 'UsersIndexPage',
    data: () => ({
        availableAbilities,
        authStore: useAuthStore(),
        empsStore: useEmployeesStore(),
        initializing: false,
    }), // end of data

    methods: {
        deleteUser(emp) {
            this.$swal.fire({
                icon: 'question',
                title: `حذف ${emp.name}؟`
            }).then(res => {
                if (res.isConfirmed) {
                    emp.deleting = true
                    this.empsStore.delEmp(emp.id)
                    .catch(err => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'خطأ فى الشبكة.',
                            showConfirmButton: false
                        })
                    }).finally(() => delete emp.deleting)
                }
                    
            })
        }
    }, // end of methods

    mounted() {
        // check permissions
        if (! this.authStore.can(availableAbilities.employees.index)) {
            this.$router.push({ name: 'home' })
            return
        }
        
        if (this.empsStore.$state.employees.length < 1) {
            this.initializing = true
            this.empsStore.sync()
            .catch(err => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'حدث خطأ ما تأكد من اتصالك بالانترنت.',
                    showConfirmButton: false,
                })
            })
            .finally(() => this.initializing = false)
        }
    }, // end of mounted

    components: {
        LoadingPage, AddButton, LoadingComponent
    }, //endof components
}
</script>