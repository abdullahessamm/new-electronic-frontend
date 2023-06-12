<template>
    <div class="user-show-page position-absolute top-0 w-100 h-100 z-2 bg-body overflow-y-auto">
        <div class="container my-3">
            <div class="row">
                <div class="col-12">
                    <h5>
                        <font-awesome-icon icon="fa-solid fa-user-gear" />
                        تعديل مستخدم
                    </h5>
                </div>
            </div>
        </div>
        <user-form
        :fName="userForm.fName"
        @update:fName="val => userForm.fName = val"
        :lName="userForm.lName"
        @update:lName="val => userForm.lName = val"
        :email="userForm.email"
        @update:email="val => userForm.email = val"
        :username="userForm.username"
        @update:username="val => userForm.username = val"
        :password="userForm.password"
        @update:password="val => userForm.password = val"
        :repeatPassword="userForm.repeatPassword"
        @update:repeatPassword="val => userForm.repeatPassword = val"
        :abilities="userForm.abilities"
        
        @update:ability:users:read="val => val ? addAbility(availableAbilities.users.index) : removeAbility(availableAbilities.users.index)"
        @update:ability:users:update="val => val ? addAbility(availableAbilities.users.update) : removeAbility(availableAbilities.users.update)"
        @update:ability:users:create="val => val ? addAbility(availableAbilities.users.create) : removeAbility(availableAbilities.users.create)"
        @update:ability:users:delete="val => val ? addAbility(availableAbilities.users.delete) : removeAbility(availableAbilities.users.delete)"
        
        @update:ability:imports:fullRead="val => val ? addAbility(availableAbilities.imports.fullIndex) : removeAbility(availableAbilities.imports.fullIndex)"
        @update:ability:imports:read="val => val ? addAbility(availableAbilities.imports.index) : removeAbility(availableAbilities.imports.index)"
        @update:ability:imports:update="val => val ? addAbility(availableAbilities.imports.update) : removeAbility(availableAbilities.imports.update)"
        @update:ability:imports:create="val => val ? addAbility(availableAbilities.imports.create) : removeAbility(availableAbilities.imports.create)"
        @update:ability:imports:delete="val => val ? addAbility(availableAbilities.imports.delete) : removeAbility(availableAbilities.imports.delete)"

        @update:ability:exports:fullRead="val => val ? addAbility(availableAbilities.exports.fullIndex) : removeAbility(availableAbilities.exports.fullIndex)"
        @update:ability:exports:read="val => val ? addAbility(availableAbilities.exports.index) : removeAbility(availableAbilities.exports.index)"
        @update:ability:exports:update="val => val ? addAbility(availableAbilities.exports.update) : removeAbility(availableAbilities.exports.update)"
        @update:ability:exports:create="val => val ? addAbility(availableAbilities.exports.create) : removeAbility(availableAbilities.exports.create)"
        @update:ability:exports:delete="val => val ? addAbility(availableAbilities.exports.delete) : removeAbility(availableAbilities.exports.delete)"
        
        @update:ability:statistics:show="val => val ? addAbility(availableAbilities.statistics.show) : removeAbility(availableAbilities.statistics.show)"

        :errors="formErrors"
        />

        <div class="save-btn px-3 pb-4 text-left">
            <button @click="saveUser" class="btn btn-success px-3 py-2" :disabled="formHasErrors || formHasEmptyFields || saving">
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
import UserForm from '../../components/forms/UserForm.vue'
import LoadingComponent from '../../components/LoadingComponent.vue';
import validationMsgs from '../../extras/validationMsgs'
import availableAbilities from '../../extras/availableAbilities'
import { useAuthStore } from '../../stores/auth'
import { useUsersStore } from '../../stores/users'

export default {
    name: "UserShowPage",
    data: () => ({
        authStore: useAuthStore(),
        usersStore: useUsersStore(),
        availableAbilities,
        saving: false,
        
        userForm: {
            fName: '',
            lName: '',
            email: '',
            username: '',
            password: '',
            repeatPassword: '',
            abilities: [],
        }, //user

        formErrors: {},

    }), // end of data

    computed: {
        formHasErrors() {
            return Object.keys(this.formErrors).length > 0
        }, // end of formHasErrors

        formHasEmptyFields() {
            return (
                ! this.userForm.fName          ||
                ! this.userForm.lName          ||
                ! this.userForm.email          ||
                ! this.userForm.username       ||
                this.userForm.abilities.length === 0
            )
        }
    }, // end of computed

    methods: {
        addAbility(ability) { this.userForm.abilities.push(ability) }, // end of addAbility
        removeAbility(ability) {
            this.userForm.abilities.splice(
                this.userForm.abilities.indexOf(ability),
                1
            )
        }, // end of abilities

        saveUser() {
            this.saving = true
            this.usersStore.update(this.$route.params.id, {
                f_name: this.userForm.fName,
                l_name: this.userForm.lName,
                email: this.userForm.email,
                username: this.userForm.username,
                password: this.userForm.password,
                abilities: this.userForm.abilities,
            }).then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تم التعديل.',
                    showCancelButton: false
                })

                this.$router.push({name: 'users'})
            }).catch(err => {
                if (err.response.status === 400) {

                    this.$swal.fire({
                        icon: 'error',
                        title: 'يوجد خطأ بالبيانات.',
                        showConfirmButton: false,
                        cancelButtonText: 'مراجعة'
                    })

                    if (err.response.data.errors.username[0] === 'The username has already been taken.')
                        this.formErrors.username = validationMsgs.usernameUnique

                    if (err.response.data.errors.email[0] === 'The email has already been taken.')
                        this.formErrors.email = validationMsgs.emailUnique
                }
            }).finally(() => this.saving = false)   
        }, // end of saveUser
    }, //end of methods

    watch: {
        userForm: {
            handler(val) {
                // fName validate
                if (! /^[a-zA-Z\u0621-\u064A]{2,20}$/.test(val.fName) && val.fName)
                    this.formErrors.fName = validationMsgs.fName
                else
                    delete this.formErrors.fName

                // lName validate
                if (! /^[a-zA-Z\u0621-\u064A]{2,20}$/.test(val.lName) && val.lName)
                    this.formErrors.lName = validationMsgs.lName
                else
                    delete this.formErrors.lName

                // email validate
                if (! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val.email) && val.email)
                    this.formErrors.email = validationMsgs.email
                else
                    delete this.formErrors.email

                // username validation
                if (! /^[a-zA-Z0-9\.]{3,50}$/.test(val.username) && val.username)
                    this.formErrors.username = validationMsgs.username
                else
                    delete this.formErrors.username

                // password validation
                if (! /^.{8,100}$/.test(val.password) && val.password)
                    this.formErrors.password = validationMsgs.password
                else
                    delete this.formErrors.password

                // repeat password validation
                if (val.password !== val.repeatPassword)
                    this.formErrors.repeatPassword = validationMsgs.repeatPassword
                else
                    delete this.formErrors.repeatPassword
            },
            deep:true
        }
    }, //end of watch

    mounted() {
        if (! this.authStore.can(availableAbilities.users.update) || this.$route.params.id === '1') {
            this.$router.push({name: 'users'})
            return
        }

        try {
            const user = this.usersStore.getUser(this.$route.params.id)
            this.userForm.fName = user.f_name
            this.userForm.lName = user.l_name
            this.userForm.email = user.email
            this.userForm.username = user.username
            this.userForm.abilities = user.abilities.split(',')
        } catch (err) {
            this.$router.push({name: 'users'})
        }

    }, // end of mounted

    components: {
        UserForm, LoadingComponent
    }, // end of components
}
</script>