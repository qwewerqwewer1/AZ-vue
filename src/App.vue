<script setup>
import { ref, computed } from 'vue'
import {
  FIELDS,
  SEARCH_KEYS,
  TAB_GROUPS,
  DEPT_PALETTE,
  UNASSIGNED_DEPARTMENT,
} from './constants/constants.js'
import { hashString, filterByQuery } from './utils/helpers.js'
import { parseExcel } from './utils/excelParser.js'
import AppBar from './components/AppBar.vue'
import ToolBar from './components/ToolBar.vue'
import UserCard from './components/UserCard.vue'
import EmptyState from './components/EmptyState.vue'
import EditDialog from './components/EditDialog.vue'

const data = ref([])
const idCounter = ref(1)
const searchQuery = ref('')
const editedUser = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const fileInput = ref(null)

const fields = FIELDS
const tabGroups = TAB_GROUPS

const filteredList = computed(() => filterByQuery(data.value, searchQuery.value, SEARCH_KEYS))

const groupedByDepartment = computed(() => {
  const map = new Map()

  for (const user of filteredList.value) {
    const departmentName = (user['Департамент'] || '').trim() || UNASSIGNED_DEPARTMENT
    if (!map.has(departmentName)) {
      map.set(departmentName, [])
    }
    map.get(departmentName).push(user)
  }

  const groups = Array.from(map.entries()).map(([department, users]) => ({
    department,
    users,
    color: DEPT_PALETTE[hashString(department) % DEPT_PALETTE.length],
  }))

  groups.sort((left, right) => {
    if (left.department === UNASSIGNED_DEPARTMENT) return 1
    if (right.department === UNASSIGNED_DEPARTMENT) return -1
    return left.department.localeCompare(right.department, 'ru')
  })

  return groups
})

const add = () => {
  const user = { id: idCounter.value++ }
  fields.forEach((fieldName) => {
    user[fieldName] = ''
  })
  data.value.push(user)
  openPopup(user)
}

const openPopup = (user) => {
  editedUser.value = user
}

const closePopup = () => {
  editedUser.value = null
}

const showToast = (message) => {
  snackbarText.value = message
  snackbar.value = true
}

const copyToClipboard = async (text) => {
  const value = String(text || '').trim()
  if (!value) return

  try {
    await navigator.clipboard.writeText(value)
    showToast('IP скопирован')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const onLoadExcel = async (file) => {
  if (!file) return

  try {
    const rows = await parseExcel(file)
    const maxId = Math.max(0, ...data.value.map((u) => u.id), 0)
    idCounter.value = maxId + 1

    data.value = rows.map((row) => ({ id: idCounter.value++, ...row }))
    showToast(`Загружено ${rows.length} записей`)
  } catch (error) {
    console.error(error)
    alert('Ошибка чтения Excel')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <v-app>
    <AppBar />
    <ToolBar v-model="searchQuery" @add="add" @load-excel="onLoadExcel" />

    <!-- Основной контент -->
    <v-main>
      <v-container>
        <v-row v-if="groupedByDepartment.length === 0">
          <v-col>
            <EmptyState />
          </v-col>
        </v-row>

        <template v-else>
          <v-row v-for="group in groupedByDepartment" :key="group.department">
            <v-col cols="12">
              <v-card class="mb-4">
                <v-card-title :style="{ backgroundColor: group.color, color: 'white' }">
                  {{ group.department }}
                </v-card-title>
                <v-card-text class="ma-4">
                  <v-row>
                    <v-col
                      v-for="user in group.users"
                      :key="user.id"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <UserCard :user="user" @click="openPopup(user)" @copy-ip="copyToClipboard" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-main>

    <!-- Диалог редактирования -->
    <EditDialog
      :user="editedUser"
      :tab-groups="tabGroups"
      @close="closePopup"
      @update:user="
        (user) => {
          if (editedUser) {
            Object.assign(editedUser, user)
          }
        }
      "
    />

    <!-- Снэкбар для уведомлений -->
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn @click="snackbar = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
