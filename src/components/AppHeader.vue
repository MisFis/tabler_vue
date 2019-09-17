<template>
  <header class="container__header">
    <label class="input-wrapper">
      <span class="input-wrapper__text">Слаг заведения</span>
      <input v-model="slugSearch" type="text" class="input-wrapper__input">
    </label>
    <button class="button button-header" :disabled="!slugSearch" @click.prevent="fetchGetSlagData">
      Обновить
    </button>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      slugSearch: '',
    };
  },
  methods: {
    fetchGetSlagData() {
      this.$store.dispatch('fetchSlugDataByName', this.slugSearch);
    },
  },
};
</script>
