<template>
  <li :key="timetable.id" class="timetable__el">
    <div v-if="!timetable.isMain" class="timetable__el__header">
      <span class="timetable__el__header__name">{{timetable.name}}</span>
      <span class="timetable__el__header__status"
            :class="{
            'timetable__el__header__status_close': status === typeStatus.close ||
            status === typeStatus.holiday,
            'timetable__el__header__status_open': status === typeStatus.open
            }">
        {{status}}
        </span>
    </div>
    <p v-for="day in  uiDays"
       :key="day.dayOfWeek"
       class="timetable__el__line">
      <span class="timetable__el__line__day">{{day.text || day.dayOfWeek}}</span>
      <span v-if="day.startAt && day.endAt" class="timetable__el__line__status">
            {{`${day.startAt} - ${day.endAt}` | aroundTheClock}}
          </span>
      <span v-else class="timetable__el__line__status">
           выходной
          </span>
    </p>
  </li>
</template>

<script>
const dayOfWeek = Object.freeze({
  ru: {
    1: 'Пн',
    2: 'Вт',
    3: 'Ср',
    4: 'Чт',
    5: 'Пт',
    6: 'Сб',
    7: 'Вс',
  },
});

export default {
  name: 'TimetableItem',
  props: {
    timetable: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uiDays: [],
    };
  },
  computed: {
    status() {
      return this.$store.getters.isClose(this.timetable);
    },
    typeStatus() {
      return this.$store.state.typeStatus;
    },
  },
  filters: {
    aroundTheClock(fullTime) {
      if (fullTime === '00:00 - 23:59') {
        return 'круглосутночно';
      }
      return fullTime;
    },
  },
  methods: {
    concatDay(daysList) {
      this.initDayUi(daysList);
      const submittedDay = [];
      this.groupDaysUi(submittedDay);
      this.createHolidayTimetable(submittedDay);
    },

    initDayUi(daysList) {
      const timeFound = {};
      daysList.forEach((day) => {
        if (!timeFound[`${day.startAt} - ${day.endAt}`]) {
          timeFound[`${day.startAt} - ${day.endAt}`] = day.dayOfWeek;
          const weekContains = [];
          weekContains.push(day.dayOfWeek);
          this.uiDays.push({
            ...day,
            text: 'Неопределенно',
            weekContains,
          });
        } else {
          const lastDayFoundByTime = timeFound[`${day.startAt} - ${day.endAt}`];
          const findLastDay = this.uiDays
            .find(item => item.weekContains.includes(lastDayFoundByTime));

          if (!findLastDay) throw new Error('Что то пошло не так!');

          findLastDay.weekContains.push(day.dayOfWeek);
          timeFound[`${day.startAt} - ${day.endAt}`] = day.dayOfWeek;
        }
      });
    },

    groupDaysUi(submittedDay) {
      this.uiDays.forEach((day) => {
        const daysTimetable = day.weekContains;
        const haveOrder = [];
        let lastDay = null;
        daysTimetable.forEach((day) => {
          if (lastDay && lastDay !== day - 1) {
            haveOrder.push(day);
          }
          lastDay = day;
        });

        if (haveOrder.length) {
          let text = '';
          daysTimetable.forEach((dayNumber, index) => {
            text += index !== daysTimetable.length - 1 ? `${dayOfWeek.ru[dayNumber]}, ` : `${dayOfWeek.ru[dayNumber]}`;
          });
          day.text = text;
          console.log('i cant test this simple=( need create mock');
        } else {
          const startDay = daysTimetable[0];
          const endDay = daysTimetable[daysTimetable.length - 1];


          submittedDay.push(...daysTimetable);

          day.text = `${dayOfWeek.ru[startDay]} - ${dayOfWeek.ru[endDay]}`;
        }
      });
    },

    createHolidayTimetable(submittedDay) {
      if (submittedDay.length < 7) {
        console.warn('Не все дни!!!');
        const holidays = Object.keys(dayOfWeek.ru)
          .filter(day => !submittedDay.includes(parseInt(day, 10)));
        let dayHolidatyText = '';
        holidays.forEach((holiday, index) => {
          dayHolidatyText += index !== holidays.length - 1 ? `${dayOfWeek.ru[holiday]}, ` : `${dayOfWeek.ru[holiday]}`;
        });
        this.uiDays.push({
          text: dayHolidatyText,
          dayOfWeek: null,
          startAt: null,
          endAt: null,
        });
      }
    },
  },
  created() {
    this.concatDay(this.timetable.items);
  },
  updated() {
    if (!this.uiDays.length) this.concatDay(this.timetable.items);
  },
};
</script>

<style lang="scss" scoped>
  %circle_status_default {
    content: '';
    display: inline-block;
    margin-right: 5px;
    min-width: 10px;
    min-height: 10px;
    border-radius: 25px;
  }

  .timetable {

    &__el {
      padding: 5px 0;

      &:not(:last-of-type) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      &__header {
        display: flex;
        color: black;
        padding-top: 10px;

        &__text {
        }

        &__status {
          margin-left: auto;

          &_close {
            &:before {
              @extend %circle_status_default;
              background-color: #737373;
            }
          }

          &_open {
            color: #EE514A;

            &:before {
              @extend %circle_status_default;
              background-color: #EE514A;
            }
          }
        }
      }

      &__line {
        padding: 5px 0;
        display: flex;
        flex-wrap: wrap;
        font-size: 14px;
        line-height: 17px;
        color: gray;

        &__day {

        }

        &__status {
          margin-left: auto;
        }
      }
    }
  }
</style>
