export const weatherUtils = {
	data() {
		return {
			api_key: '30edf1b6f565ec00ddd08901dff35571',
			url_base: 'https://api.openweathermap.org/data/2.5/',
			query: '',
			cityInput: null,
			showWeather: false,
			weatherData: {},
			currentWeatherImage: '',
		};
	},
	methods: {
		findCity(e) {
			if (e.key === 'Enter') {
				fetch(
					`${this.url_base}weather?q=${this.cityInput}&units=metric&lang=ru&APPID=${this.api_key}`
				)
					.then(response => {
						this.setWeather();
						return response.json();
					})
					.then(this.setWeather());
			}
		},
		setWeather(results) {
			this.weatherData = results;
			this.showWeather = true;
			this.currentWeatherImage =
				'./dist/img/weather/' + this.weatherData.weather[0].main + '.svg';
			console.log(results, this.showWeather);
		},
	},
};
