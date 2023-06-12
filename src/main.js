import './assets/main.scss' // import main scss file

// import vue & pinia state manager
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import app & router
import App from './App.vue'
import router from './router'

// import bootstrap js
import '../node_modules/@popperjs/core/dist/umd/popper'
import '../node_modules/bootstrap/dist/js/bootstrap'

// import fontawesome
import { library as lib } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChartLine, faCircleInfo, faFloppyDisk, faGear, faHandHoldingDollar, faHeart, faLock, faPenToSquare, faPlus, faPowerOff, faRightToBracket, faSackDollar, faTrash, faUserGear, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons'

lib.add(faRightToBracket)
lib.add(faHeart)
lib.add(faPowerOff)
lib.add(faGear)
lib.add(faUserGear)
lib.add(faUsers)
lib.add(faChartLine)
lib.add(faSackDollar)
lib.add(faHandHoldingDollar)
lib.add(faPlus)
lib.add(faCircleInfo)
lib.add(faLock)
lib.add(faFloppyDisk)
lib.add(faUserPlus)
lib.add(faTrash)
lib.add(faPenToSquare)

// import sweetalert lib
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const options = {
    confirmButtonColor: '#135ea2',
    cancelButtonColor: '#dc3545',
    heightAuto: false,
    confirmButtonText: 'موافق',
    cancelButtonText: 'إلغاء',
    showConfirmButton: true,
    showCancelButton: true,
  };

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'



createApp(App)
.use(createPinia())
.use(router)
.use(VueSweetalert2, options)
.component('font-awesome-icon', FontAwesomeIcon)
.component('VueDatePicker', VueDatePicker)
.mount('#app')