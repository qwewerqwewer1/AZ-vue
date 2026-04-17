// Импорт VUE
import { createApp } from 'vue'
import App from './App.vue'

// Импорт общих стилей
// import './assets/main.css'

// Импорт VUETIFY
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
// createApp(App).mount('#app')
