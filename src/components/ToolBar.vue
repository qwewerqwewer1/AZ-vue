<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'add', 'load-excel'])

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target?.files?.[0]
  if (file) {
    emit('load-excel', file)
  }
  // Очищаем input, чтобы можно было загрузить тот же файл повторно
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <v-toolbar density="comfortable" class="px-4">
    <v-text-field
      :model-value="modelValue"
      density="compact"
      variant="outlined"
      placeholder="Поиск по ФИО, логину или IP"
      hide-details
      class="mr-4"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <v-btn variant="outlined" @click="triggerFileInput"> Загрузить Excel </v-btn>

    <v-btn color="primary" class="ml-2" @click="emit('add')"> Добавить запись </v-btn>

    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      style="display: none"
      @change="handleFileChange"
    />
  </v-toolbar>
</template>

<style>
.v-toolbar {
  position: inherit !important;
}
</style>
