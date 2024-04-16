<template>
	<header>
		<div class="content">
			<div class="header-logo">REAL TIME WEATHER</div>
			<div class="header-input">
				<label for="cityInput" class="input-label">
					<img src="/icons/search.svg" alt="Search Icon" class="search-icon" />

					<input
						type="text"
						placeholder="Введите свой город"
						v-model="cityInput"
						id="cityInput"
						@input="getCitiesList"
						@keypress.enter="getWeather"
					/>

					<ul class="city-list">
						<li
							class="city-item"
							v-for="(item, index) in cities"
							:index="index"
							@click="getWeatherByName(item.name)"
						>
							<span class="city-name">
								{{
									item.local_names && item.local_names['ru']
										? item.local_names['ru']
										: item.name
								}}, {{ item.country }}
							</span>
						</li>
					</ul>
				</label>
			</div>
		</div>
	</header>
	<main id="weather">
		<div class="weather-real" v-if="weatherShow">
			<span class="city-name">
				{{ weatherData.name }}, {{ weatherData.sys.country }}
			</span>
			<h1 class="temperature">{{ Math.round(weatherData.main.temp) }}°</h1>

			<span class="weather-info">
				{{ weatherData.weather[0].description }}
			</span>

			<span class="temperature-info">
				мин. {{ Math.round(weatherData.main.temp) }}° макс.
				{{ Math.round(weatherData.main.temp) }}°
			</span>

			<div class="weather">
				<!-- Температура ощущается как -->
				<div class="weather-block">
					<div class="desc-block">
						<span class="text-desc">
							<img src="/icons/temperature.svg" alt="temperature" height="14" />
							Ощущается как
						</span>
						<span class="heavy-text">
							{{ Math.round(weatherData.main.feels_like) }}°
						</span>
					</div>
					<span class="text-desc item">
						{{
							getFeelsTemperature(
								weatherData.main.feels_like,
								weatherData.main.temp
							)
						}}
					</span>
				</div>

				<div class="weather-block">
					<div class="desc-block">
						<span class="text-desc">
							<img src="/icons/wind.svg" alt="temperature" height="14" />
							Ветер
						</span>
						<span class="heavy-text">
							{{ Math.round(weatherData.wind.speed) }}
							<span style="font-size: 16px">м/с</span>
						</span>
					</div>
					<span class="text-desc item" v-if="weatherData.wind.gust"
						>Порывы до <br />
						<span style="color: #fff">
							{{ Math.round(weatherData.wind.gust) }} м/с
						</span>
					</span>

					<span class="text-desc item" v-else
						>Данных о порывах ветра не поступало</span
					>
				</div>

				<div class="weather-block">
					<div class="desc-block">
						<span class="text-desc">
							<img src="/icons/eye.svg" alt="temperature" height="14" />
							Видимость
						</span>
						<span class="heavy-text">
							{{ (weatherData.visibility / 1000).toFixed(1) }}
							<span style="color: #fff; font-size: 16px">км.</span>
						</span>
					</div>
					<span class="text-desc item">
						{{ getVisibilityDesc(weatherData.visibility) }}
					</span>
				</div>

				<div class="weather-block">
					<div class="desc-block">
						<span class="text-desc">
							<img src="/icons/sunrise.svg" alt="temperature" height="14" />
							{{ getSunTimeDesc(1).description }}
						</span>
						<span class="heavy-text">
							{{ formatTime(weatherData.sys.sunrise) }}
						</span>
					</div>
					<span class="text-desc item">
						{{ getSunTimeDesc().description }}<br />
						{{ getCurrentSun() }}
					</span>
				</div>
				<div class="weather-block">
					<div class="desc-block">
						<span class="text-desc">
							<img src="/icons/humidity.svg" alt="temperature" height="14" />
							Влажность
						</span>
						<span class="heavy-text"> {{ weatherData.main.humidity }} % </span>
					</div>
					<span class="text-desc item">
						{{ getHumidityDesc() }}
					</span>
				</div>

				<div class="weather-block">
					<div class="desc-block">
						<span class="text-desc">
							<img src="/icons/pressure.svg" alt="temperature" height="14" />
							Давление
						</span>
						<span class="heavy-text">
							{{ weatherData.main.pressure }}
							<span style="font-size: 16px">гПа</span>
						</span>
					</div>
					<span class="text-desc item">
						{{ getPressureDesc() }}
					</span>
				</div>
			</div>
		</div>
		<div class="no-weather">
			<h1>Выберите город для просмотра погоды</h1>
			<h2>Например: Ростов-на-Дону</h2>
		</div>
	</main>
	<footer>
		<span class="footer-text">
			Powered by
			<a href="https://openweathermap.org/api" ref="noref">OpenWeather API</a>
		</span>
	</footer>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			cityInput: '',
			weatherData: [],
			cities: [],
			weatherShow: false,
		};
	},
	methods: {
		async getWeather() {
			if (!this.cityInput) return;

			await axios(
				'https://api.openweathermap.org/data/2.5/weather?q=' + this.cityInput,
				{
					params: {
						appid: '30edf1b6f565ec00ddd08901dff35571',
						lang: 'ru',
						units: 'metric',
					},
				}
			).then(response => {
				this.weatherData = response['data'];
				this.weatherShow = true;
			});
		},

		async getWeatherByName(name) {
			if (!name) return;

			await axios('https://api.openweathermap.org/data/2.5/weather?q=' + name, {
				params: {
					appid: '30edf1b6f565ec00ddd08901dff35571',
					lang: 'ru',
					units: 'metric',
				},
			}).then(response => {
				this.weatherData = response['data'];
				this.cities = [];
				this.weatherShow = true;
			});
		},

		async getCitiesList() {
			if (!this.cityInput) return;

			await axios(
				'https://api.openweathermap.org/geo/1.0/direct?q=' + this.cityInput,
				{
					params: {
						appid: '30edf1b6f565ec00ddd08901dff35571',
						limit: 5,
					},
				}
			).then(response => {
				this.cities = response['data'];
				// this.weatherData = response['data'];
				// this.weatherShow = true;
				console.log('this.cities', this.cities);
			});
		},

		// Получаем описание для ощущаемой температуры
		getFeelsTemperature(feels_temperature, real_temperature) {
			let temperatureDesc = '';
			if (feels_temperature > real_temperature) {
				temperatureDesc = 'По ощущениям теплее из-за отсутствия ветра';
			} else if (feels_temperature < real_temperature) {
				temperatureDesc = 'По ощущениям прохладнее из-за ветра';
			} else {
				temperatureDesc = 'Примерно как фактическая температура';
			}
			return temperatureDesc;
		},

		// Получаем описание видимости
		getVisibilityDesc(visibility) {
			let visibilityDesc = '';
			if (visibility > 5000) {
				visibilityDesc = 'Отличная видимость';
			} else if (visibility > 1000) {
				visibilityDesc = 'Хорошая видимость';
			} else if (visibility > 500) {
				visibilityDesc = 'Низкая видимость';
			} else {
				visibilityDesc = 'Очень низкая видимость';
			}

			return visibilityDesc;
		},

		getSunTimeDesc(item) {
			const currentTimezoneOffsetInSeconds =
				-new Date().getTimezoneOffset() * 60;
			const currentUnixTime = Math.round(Date.now() / 1000); // Текущее время в Unix

			const sunriseUnixTime = this.weatherData.sys.sunrise; // Время восхода солнца в Unix
			const sunsetUnixTime = this.weatherData.sys.sunset; // Время заката солнца в Unix

			let isSunrise = currentUnixTime < sunriseUnixTime;
			let isSunset = currentUnixTime < sunsetUnixTime;

			if (item === 1) {
				return {
					description: isSunset
						? 'Восход солнца'
						: isSunrise
						? 'Закат солнца'
						: 'Восход солнца',
					icon: isSunset
						? '/icons/sunrise.svg'
						: isSunrise
						? '/icons/sunset.svg'
						: '/icons/sunrise.svg',
				};
			} else {
				return {
					description: isSunset
						? 'Закат солнца'
						: isSunrise
						? 'Восход солнца'
						: 'Закат солнца',
					icon: isSunset
						? '/icons/sunset.svg'
						: isSunrise
						? '/icons/sunrise.svg'
						: '/icons/sunset.svg',
				};
			}
		},

		getIconPath(item) {
			return this.getSunTimeDesc(item).icon;
		},

		getCurrentSun() {
			const date = new Date();

			const currentTimezoneOffsetInSeconds =
				-new Date().getTimezoneOffset() * 60;
			const currentUnixTime = Math.round(
				date.getTime() + this.weatherData.timezone / 1000
			); // Текущее время в Unix

			const sunriseUnixTime = this.weatherData.sys.sunrise; // Время восхода солнца в Unix
			const sunsetUnixTime = this.weatherData.sys.sunset; // Время заката солнца в Unix

			let isSunrise = currentUnixTime < sunriseUnixTime;
			let isSunset = currentUnixTime > sunsetUnixTime;

			return isSunrise
				? this.formatTime(this.weatherData.sys.sunrise)
				: isSunset
				? this.formatTime(this.weatherData.sys.sunset)
				: this.formatTime(this.weatherData.sys.sunrise);
		},

		// Получаем описание влажности
		getHumidityDesc() {
			const humidity = this.weatherData.main.humidity;

			if (humidity > 80) {
				return 'Экстремальный уровень влажности';
			} else if (humidity > 60) {
				return 'Очень высокий уровень влажности';
			} else if (humidity > 40) {
				return 'Высокий уровень влажности';
			} else if (humidity > 20) {
				return 'Умеренный уровень влажности';
			} else if (humidity > 10) {
				return 'Низкий уровень влажности';
			} else {
				return 'Очень низкий уровень влажности';
			}
		},

		// Получаем описание атфосферного давления
		getPressureDesc() {
			const pressure = this.weatherData.main.pressure;

			if (pressure > 1030) {
				return 'Очень высокое атмосферное давление';
			} else if (pressure > 1013) {
				return 'Нормальное атмосферное давление';
			} else if (pressure > 980) {
				return 'Среднее атмосферное давление';
			} else if (pressure > 950) {
				return 'Низкое атмосферное давление';
			} else if (pressure < 950) {
				return 'Очень низкое атмосферное давление';
			}
		},

		formatTime(unix) {
			let UnixTimezone = unix + this.weatherData.timezone;
			const date = new Date(UnixTimezone * 1000);

			const hours = date.getUTCHours();
			const minutes = date.getUTCMinutes();
			// Форматируем
			const formattedHours = hours < 10 ? '0' + hours : hours;
			const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

			return `${formattedHours}:${formattedMinutes}`;
		},
	},
};
</script>
