import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Status from '../static/object/Status';

Vue.use(Vuex);

function createTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return {
    hours,
    minutes,
  };
}

function compareTimes(time, { start, end }) {
  return (parseInt(start.hours, 10) <= time.hours && parseInt(end.hours, 10) >= time.hours)
    && (parseInt(start.minutes, 10) <= time.minutes && parseInt(end.minutes, 10) >= time.minutes);
}

let date = new Date();
let currTime = createTime(date);
let currDayOfWeek = date.getDay();

const store = new Vuex.Store({
  state: {
    currentSlug: null,
    currentTime: { dayOfWeek: currDayOfWeek, time: currTime },
    typeStatus: Status,
  },

  getters: {
    getTimetableSlug({ currentSlug }) {
      if (!currentSlug) {
        return [];
      }
      return currentSlug.schedules;
    },
    isClose: ({ currentTime }) => (timeTimetable) => {
      const { dayOfWeek, time } = currentTime;
      const currentDay = timeTimetable.items
        .find(item => parseInt(item.dayOfWeek, 10) === dayOfWeek);
      console.log(currentDay);
      if (!currentDay) {
        return Status.holiday;
      }
      const startWork = currentDay.startAt;
      const endWork = currentDay.endAt;

      const [startHour, startMinutes] = startWork.split(':', 2);
      const [endHour, endMinutes] = endWork.split(':', 2);

      const startTimeWork = { hours: startHour, minutes: startMinutes };
      const endTimeWork = { hours: endHour, minutes: endMinutes };

      if (compareTimes(time, { start: startTimeWork, end: endTimeWork })) {
        return Status.open;
      }
      return Status.close;
    },
  },

  mutations: {
    setCurrentSlug(state, data) {
      state.currentSlug = data;
    },
    updateTime(state, updateDate) {
      state.currentTime = updateDate;
    },
  },

  actions: {
    fetchSlugDataByName({ commit }, nameSlug) {
      return axios.get(`/api/v1/places/${nameSlug}`)
        .then(({ data }) => {
          const { data: slugData, status } = data;
          if (status === 'Success') {
            commit('setCurrentSlug', slugData.place);
          } else {
            throw new Error('status not equal \'Success\', plz contact me');
          }
        })
        .catch((er) => {
          console.error('🙀 Что то пошло не так 🙀 ', er);
        });
    },
  },
});

setInterval(() => {
  date = new Date();
  currTime = createTime(date);
  currDayOfWeek = date.getDay();
  store.commit('updateTime', { dayOfWeek: currDayOfWeek, time: currTime });
}, 10 * 1000);

export default store;
