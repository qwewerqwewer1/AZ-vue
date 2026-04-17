<script setup>
import { computed } from 'vue'
const props = defineProps({
  user: { type: Object, required: true },
})

const emit = defineEmits(['click', 'copy-ip'])

const initial = computed(() => (props.user['ФИО пользователя'] || '?')[0])
const userName = computed(() => props.user['ФИО пользователя'] || '—')
const userLogin = computed(() => props.user['Логин пользователя'] || '—')
const ip = computed(() => props.user['IP адрес'])
const department = computed(() => props.user['Департамент'])
const location = computed(() => props.user['Здание, кабинет'])
</script>

<template>
  <v-card @click="emit('click')">
    <v-card-item>
      <template v-slot:prepend>
        <v-avatar color="primary">
          <span class="text-h5">{{ initial }}</span>
        </v-avatar>
      </template>

      <v-card-title>{{ userName }}</v-card-title>
      <v-card-subtitle>{{ userLogin }}</v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-chip v-if="ip" size="small" class="mr-2" @click.stop="emit('copy-ip', ip)">
        IP {{ ip }}
      </v-chip>
      <v-chip v-if="department" size="small" variant="outlined" class="mr-2">
        {{ department }}
      </v-chip>
      <v-chip v-if="location" size="small" variant="outlined">
        {{ location }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>
