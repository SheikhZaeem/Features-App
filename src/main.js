import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import { initAuth } from './services/auth'
import i18n from './i18n'

initAuth();
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(i18n) // lang
app.mount('#app')