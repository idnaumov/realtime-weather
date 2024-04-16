import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showWeather: false,
    cityInput: null,
    weatherData: {},
    currentWeatherImage: ''
  },
  mutations: {
    setShowWeather(state, value) {
      state.showWeather = value;
    },
    setCityInput(state, value) {
      state.cityInput = value;
    },
    setWeatherData(state, value) {
      state.weatherData = value;
    },
    setCurrentWeatherImage(state, value) {
      state.currentWeatherImage = value;
    }
  },
  getters: {
    showWeather: state => state.showWeather,
    cityInput: state => state.cityInput,
    weatherData: state => state.weatherData,
    currentWeatherImage: state => state.currentWeatherImage
  }
});