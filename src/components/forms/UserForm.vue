<template>
    <form class="user-form container">
        <div class="row">
            <div class="col-12 my-4">
                <h5 class="color-main">
                    <font-awesome-icon icon="fa-solid fa-circle-info"/>
                    بيانات المستخدم
                </h5>
            </div>
            <div class="form-group col-12 col-md-6 mb-3">
                <label for="f_name-input"> الاسم الاول </label>
                <input
                    type="text"
                    id="f_name-input"
                    :class="`form-control ${errors.fName ? 'is-invalid' : fName.length > 0 ? 'is-valid' : ''}`"
                    :value="fName"
                    @input="$emit('update:fName', $event.target.value)"
                >
                <div class="invalid-feedback"> {{ errors.fName }} </div>
            </div>
            <div class="form-group col-12 col-md-6 mb-3">
                <label for="l_name-input"> اسم العائلة </label>
                <input
                    type="text"
                    id="l_name-input"
                    :class="`form-control ${errors.lName ? 'is-invalid': lName.length > 0 ? 'is-valid' : ''}`"
                    :value="lName"
                    @input="$emit('update:lName', $event.target.value)"
                >
                <div class="invalid-feedback"> {{ errors.lName }} </div>
            </div>
            <div class="form-group col-12 mb-3">
                <label for="email-input"> البريد الالكترونى </label>
                <input
                    type="email"
                    id="email-input"
                    :class="`form-control ${errors.email ? 'is-invalid' : email.length > 0 ? 'is-valid' : ''}`"
                    :value="email"
                    @input="$emit('update:email', $event.target.value)"
                >
                <div class="invalid-feedback"> {{ errors.email }} </div>
            </div>
            <div class="form-group col-12 mb-3">
                <label for="username-input"> أسم المستخدم </label>
                <input
                    type="text"
                    id="username-input"
                    :class="`form-control ${errors.username ? 'is-invalid' : username.length > 0 ? 'is-valid' : ''}`"
                    :value="username"
                    @input="$emit('update:username', $event.target.value)"
                >
                <div class="invalid-feedback"> {{ errors.username }} </div>
            </div>
            <div class="form-group col-12 mb-3">
                <label for="password-input"> الرقم السري </label>
                <input
                    type="password"
                    id="password-input"
                    :class="`form-control ${errors.password ? 'is-invalid' : password.length > 0 ? 'is-valid' : ''}`"
                    :value="password"
                    @input="$emit('update:password', $event.target.value)"
                >
                <div class="invalid-feedback"> {{ errors.password }} </div>
            </div>
            <div class="form-group col-12 mb-3">
                <label for="repeat-password-input"> أعد الرقم السرى </label>
                <input
                    type="password"
                    id="repeat-password-input"
                    :class="`form-control ${errors.repeatPassword ? 'is-invalid' : repeatPassword.length > 0 ? 'is-valid' : ''}`"
                    :value="repeatPassword"
                    @input="$emit('update:repeatPassword', $event.target.value)"
                >
                <div class="invalid-feedback"> {{ errors.repeatPassword }} </div>
            </div>
        </div>
        <!-- abilities -->
        <div class="row">
            <div class="col-12 my-4">
                <h5 class="color-main">
                    <font-awesome-icon icon="fa-solid fa-lock" />
                    الصلاحيات
                </h5>
            </div>
            <!-- users -->
            <div class="col-12">
                <h6> المستخدمين: </h6>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-user-read"
                        @change="$emit('update:ability:users:read', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.users.index) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-user-read">قراءة البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-user-create"
                        @change="$emit('update:ability:users:create', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.users.create) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-user-create">إنشاء مستخدمين</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-user-update"
                        @change="$emit('update:ability:users:update', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.users.update) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-user-update">تعديل البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-user-delete"
                        @change="$emit('update:ability:users:delete', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.users.delete) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-user-delete">حذف المستخدمين</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>
            <!-- employees -->
            <div class="col-12">
                <h6> الموظفين: </h6>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-employees-read"
                        @change="$emit('update:ability:employees:read', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.employees.index) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-employees-read">قراءة البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-employee-create"
                        @change="$emit('update:ability:employees:create', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.employees.create) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-employee-create">إنشاء موظفين</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-employee-update"
                        @change="$emit('update:ability:employees:update', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.employees.update) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-employee-update">تعديل البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-employee-delete"
                        @change="$emit('update:ability:employees:delete', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.employees.delete) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-employee-delete">حذف الموظفين</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>
            <!-- imports -->
            <div class="col-12">
                <h6> الإيرادات: </h6>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-imports-read"
                        @change="$emit('update:ability:imports:read', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.imports.index) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-imports-read">قراءة سجل اليوم</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-imports-full-read"
                        @change="$emit('update:ability:imports:fullRead', $event.target.checked)"    
                        :checked="abilities.indexOf(availableAbilities.imports.fullIndex) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-imports-full-read">قراءة السجل كامل</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-imports-create"
                        @change="$emit('update:ability:imports:create', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.imports.create) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-imports-create">تسجيل ايرادات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-imports-update"
                        @change="$emit('update:ability:imports:update', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.imports.update) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-imports-update">تعديل الايرادات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-imports-delete"
                        @change="$emit('update:ability:imports:delete', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.imports.delete) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-imports-delete">حذف ايرادات</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>
            <!-- exports -->
            <div class="col-12">
                <h6> المصروفات: </h6>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-exports-read"
                        @change="$emit('update:ability:exports:read', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.exports.index) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-exports-read">قراءة سجل اليوم</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-exports-full-read"
                        @change="$emit('update:ability:exports:fullRead', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.exports.fullIndex) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-exports-full-read">قراءة السجل كامل</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-exports-create"
                        @change="$emit('update:ability:exports:create', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.exports.create) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-exports-create">تسجيل مصروفات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-exports-update"
                        @change="$emit('update:ability:exports:update', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.exports.update) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-exports-update">تعديل المصروفات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-exports-delete"
                        @change="$emit('update:ability:exports:delete', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.exports.delete) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-exports-delete">حذف مصروفات</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>

            <!-- Spare parts permits -->
            <div class="col-12">
                <h6> أذون قطع غيار: </h6>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-sparePartsPermits-read"
                        @change="$emit('update:ability:sparePartsPermits:read', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.sparePartsPermits.index) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-sparePartsPermits-read">قراءة سجل اليوم</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-sparePartsPermits-full-read"
                        @change="$emit('update:ability:sparePartsPermits:fullRead', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.sparePartsPermits.fullIndex) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-sparePartsPermits-full-read">قراءة السجل كامل</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-sparePartsPermits-create"
                        @change="$emit('update:ability:sparePartsPermits:create', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.sparePartsPermits.create) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-sparePartsPermits-create">تسجيل أذونات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-sparePartsPermits-update"
                        @change="$emit('update:ability:sparePartsPermits:update', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.sparePartsPermits.update) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-sparePartsPermits-update">تعديل أذونات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-sparePartsPermits-delete"
                        @change="$emit('update:ability:sparePartsPermits:delete', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.sparePartsPermits.delete) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-sparePartsPermits-delete">حذف أذونات</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>

            <!-- Monthly reporting incentives -->
            <div class="col-12">
                <h6> تقرير الحافز الشهرى: </h6>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-monthlyReportingIncentive-read"
                        @change="$emit('update:ability:monthlyReportingIncentive:read', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.monthlyReportingIncentives.index) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-monthlyReportingIncentive-read">قراءة البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-monthlyReportingIncentive-create"
                        @change="$emit('update:ability:monthlyReportingIncentive:create', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.monthlyReportingIncentives.create) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-monthlyReportingIncentive-create">تسجيل البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-monthlyReportingIncentive-update"
                        @change="$emit('update:ability:monthlyReportingIncentive:update', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.monthlyReportingIncentives.update) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-monthlyReportingIncentive-update">تعديل البيانات</label>
                </div>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-monthlyReportingIncentive-delete"
                        @change="$emit('update:ability:monthlyReportingIncentive:delete', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.monthlyReportingIncentives.delete) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-monthlyReportingIncentive-delete">حذف البيانات</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>

            <!-- statistics -->
            <div class="col-12">
                <h6> صفحة الاحصائيات: </h6>
            </div>
            <div class="col-12 mb-5">
                <div class="form-check form-switch form-check-reverse">
                    <input
                        class="form-check-input cursor-hand"
                        type="checkbox"
                        id="ability-statistics-show"
                        @change="$emit('update:ability:statistics:show', $event.target.checked)"
                        :checked="abilities.indexOf(availableAbilities.statistics.show) !== -1"
                    >
                    <label class="form-check-label cursor-hand" for="ability-statistics-show">الوصول لصفحة الاحصائيات</label>
                </div>
            </div>
            <div class="col-12 my-3"></div>
        </div>
    </form>
</template>

<script>
import availableAbilities from '../../extras/availableAbilities';

export default {
    name: 'UserForm',
    data: () => ({
        availableAbilities,
    }), // end of data
    props: ['fName', 'lName', 'email', 'username', 'password', 'repeatPassword', 'abilities', 'errors'],
    emits: [
        'update:fName',
        'update:lName',
        'update:email',
        'update:username',
        'update:password',
        'update:repeatPassword',
        // users abilities
        'update:ability:users:read',
        'update:ability:users:update',
        'update:ability:users:create',
        'update:ability:users:delete',
        // employees abilities
        'update:ability:employees:read',
        'update:ability:employees:update',
        'update:ability:employees:create',
        'update:ability:employees:delete',
        // imports abilities
        'update:ability:imports:read',
        'update:ability:imports:fullRead',
        'update:ability:imports:update',
        'update:ability:imports:create',
        'update:ability:imports:delete',
        // exports abilities
        'update:ability:exports:read',
        'update:ability:exports:fullRead',
        'update:ability:exports:update',
        'update:ability:exports:create',
        'update:ability:exports:delete',
        // spare parts permits abilities
        'update:ability:sparePartsPermits:read',
        'update:ability:sparePartsPermits:fullRead',
        'update:ability:sparePartsPermits:update',
        'update:ability:sparePartsPermits:create',
        'update:ability:sparePartsPermits:delete',
        // monthly reporting incentive
        'update:ability:monthlyReportingIncentive:read',
        'update:ability:monthlyReportingIncentive:update',
        'update:ability:monthlyReportingIncentive:create',
        'update:ability:monthlyReportingIncentive:delete',
        // statistics abilities
        'update:ability:statistics:show',
    ]
}
</script>