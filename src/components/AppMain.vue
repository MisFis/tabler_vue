<template>
  <main class="container__main">
    <ul class="timetable" v-if="timetables.length">
      <li class="timetable__header">
        <span class="timetable__header__title">Часы работы</span>
        <span class="timetable__header__status"
              :class="{'timetable__header__status_open': statusMain === typeStatus.open}"
        >{{statusMain}}</span>
      </li>
      <TimetableItem v-for="timetable in timetables"
                     :key="timetable.id"
                     :timetable="timetable"
                     class="timetable__el"/>
    </ul>
    <p v-else-if="errorMessages">{{errorMessages}}</p>
    <p v-else>Список пуст, укажите Слаг заведения</p>
  </main>
</template>

<script>
import TimetableItem from './TimetableItem.vue';

export default {
  name: 'AppMain',
  components: { TimetableItem },
  computed: {
    timetables() {
      return this.$store.getters.getTimetableSlug;
    },
    mainTimetable() {
      return this.$store.getters.getTimetableSlug.find(item => item.isMain);
    },
    statusMain() {
      return this.$store.getters.isClose(this.mainTimetable);
    },
    typeStatus() {
      return this.$store.state.typeStatus;
    },
    errorMessages() {
      return this.$store.state.errorMessage;
    },
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
  .timetable {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 10px;

    &__header {
      margin-bottom: 10px;

      &__status {
        margin-left: 10px;
        &_open {
          color: #EE514A;
        }
      }
    }
  }
</style>
