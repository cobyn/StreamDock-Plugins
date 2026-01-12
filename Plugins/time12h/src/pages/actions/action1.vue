<script setup lang="ts">
  import { usePropertyStore, useWatchEvent, TabView } from '@/hooks/property';
  import { useI18nStore } from '@/hooks/i18n';
  import { NSwitch, NInput } from 'naive-ui';

  const property = usePropertyStore();
  const i18n = useI18nStore();
</script>

<template>
  <TabView :label="i18n['ShowSeconds']">
    <NSwitch v-model:value="property.settings.showSeconds">
      <template #checked>{{ i18n['Yes'] }}</template>
      <template #unchecked>{{ i18n['No'] }}</template>
    </NSwitch>
  </TabView>
  <TabView :label="i18n['ShowDate']">
    <NSwitch v-model:value="property.settings.showDate">
      <template #checked>{{ i18n['Yes'] }}</template>
      <template #unchecked>{{ i18n['No'] }}</template>
    </NSwitch>
  </TabView>
  <TabView :label="i18n['Command']">
    <NInput v-model:value="property.settings.command" placeholder="Enter command to execute on press" />
  </TabView>
</template>
