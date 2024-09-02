<template>
    <div class="position-absolute top-0 w-100 h-100 z-2 bg-body overflow-y-auto">
        <div class="container my-3">
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="d-flex align-items-center">
                        <font-awesome-icon icon="fa-solid fa-user-tie" style="font-size: 34px; margin-left: 15px;"/>
                        <span>{{ emp?.name || loadedEmp?.name }}</span>
                        <LoadingComponent style="margin-right: 15px" width="28px" v-if="fetching"/>
                    </h5>
                </div>
            </div>



            <div class="row mt-5" v-if="loadedEmp">
                <div class="col-12 overflow-x-auto pb-3 mb-4 border-bottom">
                    <h6>حضور اليوم</h6>
                    <p v-if="loadedEmp.attendance.filter(
                        att => new Date(att.day).toLocaleDateString() === new Date().toLocaleDateString()
                        ).length > 0"
                    >
                        تم تسجيل الحضور فى: {{ convertTime(
                            loadedEmp.attendance.filter(
                            att => new Date(att.day).toLocaleDateString() === new Date().toLocaleDateString()
                            )[0].attended_at
                        ) }}
                    </p>
                    <div v-else>
                        <p>لم يتم تسجيل الحضور اليوم.</p>
                        <button class="btn btn-success" :disabled="settingAttendance" @click="setAttendance" v-if="authStore.can(availableAbilities.employees.update)">
                            <LoadingComponent v-if="settingAttendance" width="20px"/>
                            <span v-else>
                                تسجيل حضور الأن
                            </span>
                        </button>
                    </div>
                </div>

                <div class="col-12 overflow-x-auto">
                    <h6 class="mb-3">سجل الأشهر</h6>
                    <div class="accordion" id="fees">
                        <div class="accordion-item" v-for="fee in [...loadedEmp.fees].reverse()" :key="fee.id">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#fee-${fee.id}`" aria-expanded="false" aria-controls="collapseTwo">
                                    {{ new Date(fee.month).getMonth() + 1 }}/{{ new Date(fee.month).getFullYear() }}
                                </button>
                            </h2>
                            <div :id="`fee-${fee.id}`" class="accordion-collapse collapse" data-bs-parent="#fees">
                                <div class="accordion-body">
                                    <!-- info -->
                                    <div class="info mb-4 pb-2 border-bottom" v-if="authStore.$state.user.abilities.indexOf('*') > -1">
                                        <div>
                                            <b>الراتب</b>
                                            <span>: {{ emp?.salary }}ج</span>
                                        </div>
                                        <div>
                                            <b>مجموع الخصومات</b>
                                            <span>: {{ fee.discounts.reduce((total, discount) => total += discount.amount, 0) }}ج</span>
                                        </div>
                                        <div>
                                            <b>الباقى بعد الخصم</b>
                                            <span>: {{ emp?.salary - fee.discounts.reduce((total, discount) => total += discount.amount, 0) }}ج</span>
                                        </div>
                                    </div>
                                    <div class="info mb-4 pb-2 text-left" v-if="authStore.$state.user.abilities.indexOf('*') > -1">
                                        <button class="btn btn-excel color-main" @click="() => exportExeclSheet(fee)">
                                            <span class="ico">
                                                <font-awesome-icon icon="fa-solid fa-file-excel" />
                                            </span>
                                            <span style="margin-right: 7px;">
                                                إستخراج الى ملف اكسل
                                            </span>
                                        </button>
                                    </div>
                                    <!-- attendance -->
                                    <div class="mb-4 pb-2 border-bottom">
                                        <h5>أيام الحضور</h5>
                                        <Calendar
                                        :year="new Date(fee.month).getFullYear()"
                                        :month="new Date(fee.month).getMonth()"
                                        :events="loadedEmp.attendance.filter(att => new Date(att.day).getMonth() === new Date(fee.month).getMonth())"
                                        />
                                    </div>
                                    <!-- discounts -->
                                    <h5>الخصومات</h5>
                                    <table class="table table-borderless border-bottom overflow-x-auto">
                                        <thead class="bg-color-main">
                                            <tr>
                                                <th scope="col" class="bg-transparent text-white px-3">قيمة الخصم</th>
                                                <th scope="col" class="bg-transparent text-white px-3">السبب</th>
                                                <th scope="col" class="bg-transparent text-white px-3">التاريخ</th>
                                                <th scope="col" class="bg-transparent text-white px-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(discount, i) in fee.discounts" :key="i">
                                                <td class="px-3">
                                                    <input
                                                    type="number"
                                                    v-model="discount.amount"
                                                    name="amount"
                                                    class="form-control"
                                                    placeholder="قيمة الخصم"
                                                    v-if="discount.edit"
                                                    >
                                                    <span v-else>
                                                        {{ discount.amount }}ج
                                                    </span>
                                                </td>
                                                <td class="px-3">
                                                    <input
                                                    type="text"
                                                    v-model="discount.reason"
                                                    name="reason"
                                                    class="form-control"
                                                    placeholder="السبب"
                                                    v-if="discount.edit"
                                                    >
                                                    <span v-else>
                                                        {{ discount.reason }}
                                                    </span>
                                                </td>
                                                <td class="px-3">{{ discount.date ? `${new Date(discount.date).getDate()}/${new Date(discount.date).getMonth() + 1}/${new Date(discount.date).getFullYear()}` : 'لم يتم التسجيل' }}</td>
                                                <td class="px-3">
                                                    <div v-if="! discount.edit">
                                                        <button class="btn btn-primary" @click="discount.edit = true" v-if="authStore.$state.user.abilities.indexOf('*') > -1">
                                                            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                                        </button>
                                                        <button class="btn btn-danger" style="margin-right: 5px;" @click="fee.discounts.splice(i, 1)" v-if="authStore.$state.user.abilities.indexOf('*') > -1">
                                                            <font-awesome-icon icon="fa-solid fa-trash" />
                                                        </button>
                                                    </div>
                                                    <div v-else>
                                                        <button class="btn btn-success" @click="delete discount.edit" v-if="authStore.$state.user.abilities.indexOf('*') > -1">
                                                            <font-awesome-icon icon="fa-solid fa-check" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="border-bottom pb-3" v-if="authStore.can(availableAbilities.employees.update)">
                                        <b>إضافة خصم</b> <br>
                                        <form class="d-flex flex-wrap align-items-center" @submit="addDiscount($event, fee)">
                                            <input
                                            type="number"
                                            name="amount"
                                            class="form-control"
                                            placeholder="قيمة الخصم"
                                            style="width: 200px; margin-left: 5px; margin-top: 5px;"
                                            >
                                            <input
                                            type="text"
                                            name="reason"
                                            class="form-control"
                                            placeholder="السبب"
                                            style="width: 200px; margin-top: 5px; margin-left: 5px;"
                                            >
                                            <button
                                            type="submit"
                                            class="btn btn-primary"
                                            style="margin-top: 5px"
                                            >
                                                <font-awesome-icon icon="fa-solid fa-plus" />
                                                <span style="margin-right: 5px">إضافة</span>
                                            </button>
                                        </form>
                                    </div>
                                    <div class="d-flex justify-content-end mt-3" v-if="authStore.can(availableAbilities.employees.update)">
                                        <button class="btn btn-success" @click="saveFee(fee)" :disabled="fee.updating">
                                            <LoadingComponent v-if="fee.updating" width="20px"/>
                                            <span v-else>
                                                <font-awesome-icon icon="fa-solid fa-save" />
                                                <span style="margin-right: 5px">حفظ</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.accordion-button::after {
    margin-left: 0;
    margin-right: auto !important;;
}
</style>

<script>
import LoadingComponent from '../../components/LoadingComponent.vue';
import validationMsgs from '../../extras/validationMsgs'
import availableAbilities from '../../extras/availableAbilities';
import { useAuthStore } from '../../stores/auth';
import { useEmployeesStore } from '../../stores/employees';
import Calendar from '../../components/Calendar.vue';
import { dataTable } from '../../utils/excelMaker';

const getCalendar = (year, month, events) => {
    const weeks = [];
    const lastDay = new Date(year, month + 1, 0);
    const numberOfDays = lastDay.getDate();

    let currentWeek = [null, null, null, null, null, null, null];
    for (let day = 1; day <= numberOfDays; day++) {
        const currentDate = new Date(year, month, day);
        currentWeek[currentDate.getDay()] = {
            date: currentDate,
            events: events.filter(ev => new Date(ev.day).getDate() === currentDate.getDate())
        };

        if (currentDate.getDay() === 6 || day === numberOfDays) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    return weeks;
}

export default {
    data: () => ({
        authStore: useAuthStore(),
        empsStore: useEmployeesStore(),
        fetching: false,
        settingAttendance: false,
        availableAbilities,
    }), // end of data

    computed: {
        emp() {
            return this.empsStore.$state.employees.find(employee => employee.id.toString() === this.$route.params.id)
        },

        loadedEmp() {
            return this.empsStore.$state.loaded.find(employee => employee.id.toString() === this.$route.params.id)
        },
    }, // end of computed

    methods: {
        fetchEmp() {
            this.fetching = true
            this.empsStore.load(this.$route.params.id)
            .catch(() => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'يوجد خطأ بالشبكة.',
                    showConfirmButton: false,
                    cancelButtonText: 'إغلاق'
                })
            })
            .finally(() => this.fetching = false)
        },

        addDiscount(e, fee) {
            e.preventDefault()
            const amount = parseFloat(e.target.amount.value);
            const reason = e.target.reason.value;
            const date   = new Date().toISOString()

            if (! amount || ! reason)
                return

            fee.discounts.push({amount, reason, date})

            e.target.amount.value = ''
            e.target.reason.value = ''
        },

        saveFee(fee) {
            fee.updating = true
            this.empsStore.updateFees(this.emp.id, fee)
            .then(() => {
                this.$swal.fire({
                    icon: 'success',
                    title: 'تم الحفظ',
                    showCancelButton: false,
                    showConfirmButton: false
                })
            })
            .catch(() => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'خطأ فى الشبكة.',
                    showConfirmButton: false
                })
            })
            .finally(() => fee.updating = false)
        },
        convertTime(dateTimeString) {
            const dateTime = new Date(dateTimeString);
            
            if (isNaN(dateTime.getTime())) {
                return 'Invalid date';
            }

            const hours = dateTime.getHours();
            const minutes = dateTime.getMinutes();

            // Convert to 12-hour format
            const formattedHours = hours % 12 || 12;
            const period = hours < 12 ? 'صباحاً' : 'مساءً';

            // Pad single-digit minutes with a leading zero
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

            return `${formattedHours}:${formattedMinutes} ${period}`;
        },

        setAttendance() {
            this.settingAttendance = true
            this.empsStore.setAttendance(this.loadedEmp.id)
            .then(() => {
                this.loadedEmp.attendance.push({
                    day: new Date().toISOString(),
                    attended_at: new Date().toISOString()
                })
            })
            .catch(() => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'يوجد خطأ بالشبكة.',
                    showConfirmButton: false,
                    cancelButtonText: 'إغلاق'
                })
            })
            .finally(() => this.settingAttendance = false)
        }, // end of set attendance

        exportExeclSheet(fee) {
            const calendarWeeks = getCalendar(new Date(fee.month).getFullYear(), new Date(fee.month).getMonth(), this.loadedEmp.attendance.filter(att => new Date(att.day).getMonth() === new Date(fee.month).getMonth()))
            const discounts = fee.discounts
            dataTable(this.loadedEmp.name, [
                calendarWeeks, discounts
            ], [
                [
                    {
                        column: 'الأحد',
                        type: String,
                        value: week => week[0] ? `${week[0].date.getDate()} ${week[0].events[0] ? ' (' + new Date(week[0].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'الأثنين',
                        type: String,
                        value: week => week[1] ? `${week[1].date.getDate()} ${week[1].events[0] ? ' (' + new Date(week[1].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'الثلاثاء',
                        type: String,
                        value: week => week[2] ? `${week[2].date.getDate()} ${week[2].events[0] ? ' (' + new Date(week[2].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'الأربعاء',
                        type: String,
                        value: week => week[3] ? `${week[3].date.getDate()} ${week[3].events[0] ? ' (' + new Date(week[3].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'الخميس',
                        type: String,
                        value: week => week[4] ? `${week[4].date.getDate()} ${week[4].events[0] ? ' (' + new Date(week[4].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'الجمعة',
                        type: String,
                        value: week => week[5] ? `${week[5].date.getDate()} ${week[5].events[0] ? ' (' + new Date(week[5].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'السبت',
                        type: String,
                        value: week => week[6] ? `${week[6].date.getDate()} ${week[6].events[0] ? ' (' + new Date(week[6].events[0].attended_at).toLocaleTimeString() + ')' : ''}` : null,
                        width: 30,
                        align: 'center'
                    },
                ],
                [
                    {
                        column: 'قيمة الخصم',
                        type: String,
                        value: dis => `${dis.amount}ج`,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'السبب',
                        type: String,
                        value: dis => dis.reason,
                        width: 30,
                        align: 'center'
                    },
                    {
                        column: 'التاريخ',
                        type: String,
                        value: dis => new Date(dis.date).toLocaleDateString(),
                        width: 30,
                        align: 'center'
                    },
                ],
            ], [
                'الحضور',
                'الخصومات'
            ])

        },
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
        if (! this.authStore.can(this.availableAbilities.employees.index))
            this.$router.push({name: 'home'})

        if (! this.loadedEmp)
            this.fetchEmp()
    }, // end of mounted

    components: {
        LoadingComponent, Calendar
    }, // end of components
}
</script>