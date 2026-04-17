<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  user: { type: Object, default: null },
  tabGroups: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'update:user'])

// Создаем локальную копию пользователя
const localUser = ref(props.user ? { ...props.user } : {})

// Следим за изменениями props.user и обновляем локальную копию
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      localUser.value = { ...newUser }
    } else {
      localUser.value = {}
    }
  },
  { deep: true, immediate: true },
)

// Сохраняем изменения
const save = () => {
  emit('update:user', localUser.value)
  emit('close')
}

// Отменяем изменения
const cancel = () => {
  emit('close')
}
</script>

<template>
  <v-dialog max-width="800px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        {{ user ? 'Редактировать пользователя' : 'Добавить пользователя' }}
      </v-card-title>

      <v-card-text>
        <v-tabs v-model="activeTab" bg-color="primary" class="mb-4">
          <template v-for="group in tabGroups" :key="group.id">
            <v-tab :value="group.id">{{ group.label }}</v-tab>
          </template>
        </v-tabs>

        <v-window v-model="activeTab">
          <template v-for="group in tabGroups" :key="group.id">
            <v-window-item :value="group.id">
              <v-row>
                <template v-for="field in group.fields" :key="field">
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="localUser[field]" :label="field" :clearable="true" />
                  </v-col>
                </template>
              </v-row>
            </v-window-item>
          </template>
        </v-window>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Отмена</v-btn>
        <v-btn @click="save" color="primary" variant="elevated">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
