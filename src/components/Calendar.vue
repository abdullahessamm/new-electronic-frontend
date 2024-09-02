<template>
<table class="table table-borderless overflow-x-auto">
    <thead class="bg-color-main">
        <tr>
            <th scope="col" class="bg-transparent text-white text-center px-3">احد</th>
            <th scope="col" class="bg-transparent text-white text-center px-3">اثنين</th>
            <th scope="col" class="bg-transparent text-white text-center px-3">ثلاثاء</th>
            <th scope="col" class="bg-transparent text-white text-center px-3">اربعاء</th>
            <th scope="col" class="bg-transparent text-white text-center px-3">خميس</th>
            <th scope="col" class="bg-transparent text-white text-center px-3">جمعة</th>
            <th scope="col" class="bg-transparent text-white text-center px-3">سبت</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(week, i) in weeks" :key="i">
            <td v-for="(day, index) in week" :key="index" :class="`day-td px-3 border-1 ${day?.events.length > 0 ? 'active' : ''}`">
                <div class="d-flex align-items-center">
                    <span :class="`day`">
                        {{ day?.date.getDate() }}
                    </span>
                </div>
                <p v-if="day?.events.length > 0">
                    الوقت: {{ convertToTimeOnly(day?.events[0].attended_at) }}
                </p>
            </td>
        </tr>
    </tbody>
</table>
</template>

<style scoped>
.day-td {
    width: 50px;
    height: 100px;
}
.day {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
.active {
    background-color: #13a24a;
    color: #fff
}
</style>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    year: Number,
    month: Number,
    events: Array,
})

const weeks = computed(() => {
    const weeks = [];
    const lastDay = new Date(props.year, props.month + 1, 0);
    const numberOfDays = lastDay.getDate();

    let currentWeek = [null, null, null, null, null, null, null];
    for (let day = 1; day <= numberOfDays; day++) {
        const currentDate = new Date(props.year, props.month, day);
        currentWeek[currentDate.getDay()] = {
            date: currentDate,
            events: props.events.filter(ev => new Date(ev.day).getDate() === currentDate.getDate())
        };

        if (currentDate.getDay() === 6 || day === numberOfDays) {
        weeks.push(currentWeek);
        currentWeek = [];
        }
    }

    return weeks;
})

function convertToTimeOnly(dateTimeString) {
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
}
</script>