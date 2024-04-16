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
						@keypress="findCity"
					/>
				</label>
			</div>
		</div>
	</header>
</template>
