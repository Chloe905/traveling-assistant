import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import createStoreInstance from './store'

const app = createApp(App)

const store = createStoreInstance()

const isAuthenticated = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user')) || null

if (isAuthenticated) {
  store.dispatch('login', user)
} else {
  store.dispatch('logout')
}

app.use(store)
app.use(router)
app.mount('#app')
