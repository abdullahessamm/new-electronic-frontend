<template>
    <div class="settings-page h-100 pb-5 overflow-auto position-relative py-4">
        <div class="container">
            <div class="row mb-4">
                <div class="col-12">
                    <h5>
                        <font-awesome-icon icon="fa-solid fa-user-gear" />
                        <span> إعدادات الحساب </span>
                    </h5>
                </div>
            </div>

            <div class="row" v-if="authStore.isAdmin">
                <div class="col-12 col-md-6 form-group my-2">
                    <label for="f_name"> الإسم الاول </label>
                    <input type="text"
                        id="f_name"
                        :class="`form-control ${contactDataErrors.f_name ? 'is-invalid' : ( contactData.f_name.length > 0 ? 'is-valid' : '')}`"
                        v-model="contactData.f_name"
                    >
                    <div class="invalid-feedback"> {{ contactDataErrors.f_name }} </div>
                </div>
                <div class="col-12 col-md-6 form-group my-2">
                    <label for="l_name"> الإسم العائلة </label>
                    <input type="text"
                        id="l_name"
                        class="form-control"
                        :class="`form-control ${contactDataErrors.l_name ? 'is-invalid' : ( contactData.l_name.length > 0 ? 'is-valid' : '')}`"
                        v-model="contactData.l_name"
                    >
                    <div class="invalid-feedback"> {{ contactDataErrors.l_name }} </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12 form-group my-2">
                    <label for="email">البريد الالكترونى</label>
                    <input
                        type="email"
                        id="email"
                        class="form-control"
                        :class="`form-control ${contactDataErrors.email ? 'is-invalid' : ( contactData.email.length > 0 ? 'is-valid' : '')}`"
                        v-model="contactData.email"
                    >
                    <div class="invalid-feedback"> {{ contactDataErrors.email }} </div>
                </div>
                <div class="col-12 form-group my-2">
                    <label for="username">أسم المستخدم</label>
                    <input
                        type="text"
                        id="username"
                        class="form-control"
                        :class="`form-control ${contactDataErrors.username ? 'is-invalid' : ( contactData.username.length > 0 ? 'is-valid' : '')}`"
                        v-model="contactData.username"
                    >
                    <div class="invalid-feedback"> {{ contactDataErrors.username }} </div>
                </div>
                <div class="col-12 my-2 text-left">
                    <button class="btn btn-success" @click="updateContactInfo">
                        <loading-component v-if="updatingContactData" width="20px"></loading-component>
                        <span v-else>
                            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                            حفظ
                        </span>
                    </button>
                </div>
            </div>

            <div class="row">
                <div class="col-12 mt-5 mb-2">
                    <h6> تغيير كلمة السر </h6>
                </div>

                <div class="col-12 col-md-6 form-group my-2">
                    <label for="old-password"> كلمة السر الحالية </label>
                    <input
                        type="password"
                        id="old-password"
                        class="form-control"
                        :class="`form-control ${passwordErrors.oldPassword ? 'is-invalid' : ( passwords.oldPassword.length > 0 ? 'is-valid' : '')}`"
                        v-model="passwords.oldPassword"    
                    >
                    <div class="invalid-feedback"> {{ validationMsgs.oldPassword }} </div>
                </div>
                <div class="col-12 col-md-6 form-group my-2">
                    <label for="new-password"> كلمة السر الجديدة </label>
                    <input
                        type="password"
                        id="new-password"
                        class="form-control"
                        :class="`form-control ${passwordErrors.newPassword ? 'is-invalid' : ( passwords.newPassword.length > 0 ? 'is-valid' : '')}`"
                        v-model="passwords.newPassword"
                    >
                    <div class="invalid-feedback"> {{ validationMsgs.password }} </div>
                </div>
                <div class="col-12 my-2 text-left">
                    <button class="btn btn-success" @click="updatePassword" :disabled="! passwords.oldPassword || ! passwords.newPassword || passwordErrors.newPassword">
                        <loading-component v-if="updatingPassword" width="20px"></loading-component>
                        <span v-else>
                            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                            حفظ
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import validationMsgs from '../extras/validationMsgs'
import { useAuthStore } from '../stores/auth'
import LoadingComponent from '../components/LoadingComponent.vue'

export default {
    name: "SettingsPage",
    data: () => ({
        validationMsgs,
        authStore: useAuthStore(),
        
        updatingContactData: false,
        contactData: {
            f_name: '',
            l_name: '',
            email: '',
            username: ''
        },

        contactDataErrors: {},

        passwords: {
            oldPassword: '',
            newPassword: '',
        },

        updatingPassword: false,
        passwordErrors: {},

    }), // end of data

    watch: {
        contactData: {
            handler(val) {
                if (! /^[a-zA-Z\u0621-\u064A]{2,20}$/.test(val.f_name))
                    this.contactDataErrors.f_name = validationMsgs.fName
                else
                    delete this.contactDataErrors.f_name

                if (! /^[a-zA-Z\u0621-\u064A]{2,20}$/.test(val.l_name))
                    this.contactDataErrors.l_name = validationMsgs.lName
                else
                    delete this.contactDataErrors.l_name

                if (! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val.email))
                    this.contactDataErrors.email = validationMsgs.email
                else
                    delete this.contactDataErrors.email

                if (! /^[a-zA-Z0-9\.]{3,50}$/.test(val.username))
                    this.contactDataErrors.username = validationMsgs.username
                else
                    delete this.contactDataErrors.username
            },
            deep: true
        },

        passwords: {
            handler(val) {
                if (! /^.{8,100}$/.test(val.newPassword) && val.newPassword)
                    this.passwordErrors.newPassword = validationMsgs.password
                else 
                    delete this.passwordErrors.newPassword
            },
            deep: true
        }
    }, // end of watch

    methods: {
        updateContactInfo() {
            this.updatingContactData = true

            this.authStore.update({
                f_name: this.contactData.f_name,
                l_name: this.contactData.l_name,
                email: this.contactData.email,
                username: this.contactData.username,
            })
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تم التعديل.',
                    showCancelButton: false
                })
            })
            .catch(err => {
                if (err.response.status === 400) {

                    if (err.response.data.errors.email) {
                        if (err.response.data.errors.email[0] === 'The email has already been taken.')
                            this.$swal.fire({
                                icon: 'error',
                                title: validationMsgs.emailUnique,
                                showConfirmButton: false,
                                cancelButtonText: 'مراجعة'
                            })
                    }
                      
                    if (err.response.data.errors.username) {
                        if (err.response.data.errors.username[0] === 'The username has already been taken.')
                            this.$swal.fire({
                                icon: 'error',
                                title: validationMsgs.usernameUnique,
                                showConfirmButton: false,
                                cancelButtonText: 'مراجعة'
                            })
                    }

                } else {
                    this.$swal.fire({
                        icon: 'error',
                        title: 'خطأ غير معروف تأكد من اتصالك بالانترنت.',
                        showConfirmButton: false,
                        cancelButtonText: 'مراجعة'
                    })
                }
            })
            .finally(() => this.updatingContactData = false)
        }, //end of update contactInfo

        updatePassword() {
            this.updatingPassword = true
            this.authStore.update({
                password: this.passwords.newPassword,
                old_password: this.passwords.oldPassword
            })
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تم التعديل.',
                    html: `برجاء تسجيل الدخول مرة اخرى.`,
                    showCancelButton: false
                })
            })
            .catch(err => {
                if (err.response.status === 403)
                    this.passwordErrors.oldPassword = validationMsgs.oldPassword
            })
            .finally(() => this.updatingPassword = false)

        }, // end of update password
    }, // end of methods

    mounted() {
        const { user } = this.authStore
        this.contactData.f_name = user.f_name
        this.contactData.l_name = user.l_name
        this.contactData.email = user.email
        this.contactData.username = user.username
    }, // end of mounted

    components: { LoadingComponent }
}
</script>