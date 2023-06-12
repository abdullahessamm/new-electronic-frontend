<template>
    <div class="users-index-page h-100 pb-5 overflow-auto position-relative">
        <loading-page v-if="initializing" color="#135ea2"></loading-page>
        <div class="py-4" v-else>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h5>
                            <font-awesome-icon icon="fa-solid fa-users" />
                            <span> المستخدمين ({{ usersStore.numOfUsers }}) </span>
                        </h5>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-12 col-md-6 col-lg-3 px-lg-5 px-1 px-0 mb-3">
                        <input type="text" class="form-control" placeholder="بحث" v-model="filterString">
                    </div>
                    <div class="col-12 px-lg-5 px-0 overflow-x-auto">
                        <div class="text-center mt-5" v-if="usersStore.search(filterString).length == 0">
                            لا يوجد نتائج
                        </div>
                        <table class="table table-borderless overflow-x-auto" v-else>
                            <thead class="bg-color-main">
                                <tr>
                                    <th scope="col" class="bg-transparent text-white px-3">المستخدم</th>
                                    <th scope="col" class="bg-transparent text-white px-3">اسم المستخدم</th>
                                    <th scope="col" class="bg-transparent text-white px-3">تاريخ التسجيل</th>
                                    <th scope="col" class="bg-transparent text-white px-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in usersStore.search(filterString)" :key="user.id">
                                    <td class="px-3">
                                        <router-link :to="`/users/show/${user.id}`" class="text-decoration-none text-black">
                                            <b v-if="user.id === authStore.user.id"> أنت </b>
                                            <b v-else> {{ user.f_name }} {{ user.l_name }} </b> <br />
                                            <span> {{ user.email }} </span>
                                        </router-link>
                                    </td>
                                    <td class="px-3">{{ user.username }}</td>
                                    <td class="px-3"> {{ new Date(user.created_at).toLocaleDateString() }} </td>
                                    <td class="px-3">
                                        <button v-if="user.id !== 1 && authStore.can(availableAbilities.users.delete)" class="btn btn-danger" @click="() => deleteUser(user)">
                                            <loading-component width="20px" v-if="user.deleting"></loading-component>
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
        v-if="! initializing && authStore.can(availableAbilities.users.create)"
        class="floating-btn floating-btn-left floating-btn-bottom m-3 d-inline-flex"
        @click="$router.push({name: 'users.add'})"
        >
            <add-button></add-button>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth'
import { useUsersStore } from '../../stores/users'
import availableAbilities from '../../extras/availableAbilities';
import LoadingPage from '../LoadingPage.vue';
import AddButton from '../../components/AddButton.vue';
import LoadingComponent from '../../components/LoadingComponent.vue';

export default {
    name: 'UsersIndexPage',
    data: () => ({
        availableAbilities,
        authStore: useAuthStore(),
        usersStore: useUsersStore(),
        initializing: false,
        filterString: "",
    }), // end of data

    methods: {
        deleteUser(user) {
            this.$swal.fire({
                icon: 'question',
                title: `حذف ${user.f_name} ${user.l_name}؟`
            }).then(res => {
                if (res.isConfirmed) {
                    user.deleting = true
                    this.usersStore.delete(user)
                    .catch(err => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'خطأ فى الشبكة.',
                            showConfirmButton: false
                        })
                    }).finally(() => delete user.deleting)
                }
                    
            })
        }
    }, // end of methods

    mounted() {
        // check permissions
        if (! this.authStore.can(availableAbilities.users.index)) {
            this.$router.push({ name: 'home' })
            return
        }
        
        if (this.usersStore.numOfUsers < 1) {
            this.initializing = true
            this.usersStore.initialize()
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