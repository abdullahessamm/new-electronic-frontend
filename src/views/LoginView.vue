<template>
    <div class="login-view bg-color-main w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <img src="../assets/elaraby.png" class="mb-5">
        <form class="login-form bg-white rounded-4 text-black w-75 p-4 pt-3 pb-3" @submit.prevent="login">
            <div class="container">
                <div class="row">
                    <div class="col-12 text-center">
                        <h4>
                            تسجيل دخول
                        </h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3 mt-4">
                            <label for="username" class="form-label">أسم المستخدم</label>
                            <input type="text" :class="`form-control ${errors.username ? 'is-invalid' : ''}`" id="username" v-model="username">
                            <div class="invalid-feedback" v-if="errors.username"> أسم المستخدم غير موجود. </div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">كلمة السر</label>
                            <input type="password" :class="`form-control ${errors.password ? 'is-invalid' : ''}`" id="password" v-model="password">
                            <div class="invalid-feedback" v-if="errors.password"> الرقم السرى خطأ. </div>
                        </div>
                        <div class="mt-5 text-center">
                            <button type="submit" class="btn btn-primary w-50" :disabled="anyFieldEmpty || isLoading">
                                <span v-if="! isLoading">
                                    <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
                                    دخول
                                </span>
                                <div class="text-center" v-if="isLoading">
                                    <LoadingComponent width="20px" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <Footer color="#fff" backgroundColor="transparent" />
    </div>
</template>

<style lang="scss" scoped>
    form {
        max-width: 600px;
        min-width: 270px;

        button {
            max-width: 200px;
        }
    }
</style>

<script>
import LoadingComponent from '../components/LoadingComponent.vue'
import Footer from '../components/Footer.vue'
import { useAuthStore } from '../stores/auth'

export default {
    name: "LoginView",
    data: () => ({
        username: "",
        password: "",
        isLoading: false,
        errors: {
            username: false,
            password: false
        },
        authStore: useAuthStore(),
    }), //end of data

    computed: {

        anyFieldEmpty() {
            return this.username === '' || this.password === '' 
        }, // end of anyFieldEmpty

    }, //end of computed

    methods: {
        login() {
            this.isLoading = true
            this.authStore.login(this.username, this.password)
            .catch(err => {
                if (err.response.status === 401) {
                    this.errors = err.response.data.errors
                    if (err.response.data.errors.username)
                        this.username = ''
                    this.password = ''
                }
            })
            .finally(() => this.isLoading = false)
        }, //end of login
    }, //end of methods

    components: {
        LoadingComponent, Footer
    }, //end of components
}
</script>