const body = document.querySelector("body"),
  translateBtn = body.querySelector(".translate"),
  weatherIcon = body.querySelector(".weather-icon"),
  temperature = body.querySelector(".temperature"),
  wind = body.querySelector(".wind"),
  humidity = body.querySelector(".humidity"),
  weatherDescription = body.querySelector(".weather-description"),
  city = body.querySelector(".city"),
  slidePrev = body.querySelector(".slide-prev"),
  slideNext = body.querySelector(".slide-next"),
  time = body.querySelector(".time"),
  date = body.querySelector(".date"),
  greeting = body.querySelector(".greeting"),
  clientName = body.querySelector(".name"),
  changeQuoteBtn = body.querySelector(".change-quote"),
  quote = body.querySelector(".quote"),
  author = body.querySelector(".author");

const timesOfDayEng = ["night", "morning", "afternoon", "evening"];
const timesOfDayRus = [
  "Доброй ночи",
  "Доброе утро",
  "Добрый день",
  "Добрый вечер",
];

let RANDOM_1_20 = getRandomNum(1, 21),
  language = "en",
  isSlideEnabled = true;

const greetingTranslation = {
  en: {
    locale: "en-GB",
    greeting: `Good ${getTimeOfDay("en")}`,
    placeholder: "[Enter name]",
    weather: "en",
    wind: "Wind speed:",
    humidity: "Humidity",
    dateOptions: {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZoneName: "short",
    },
  },
  ru: {
    locale: "ru-RU",
    greeting: `${getTimeOfDay("ru")}`,
    placeholder: "[Введите имя]",
    weather: "ru",
    wind: "Скорость ветра:",
    humidity: "Влажность",
    dateOptions: {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZoneName: "short",
      formatMatcher: "best fit",
    },
  },
};

//* TRANSLATE

function toggleLanguage() {
  const newLang = translateBtn.textContent.trim().toLowerCase();

  if (newLang == "ru") {
    language = "ru";
    translateBtn.textContent = "EN";
  }
  if (newLang == "en") {
    language = "en";
    translateBtn.textContent = "RU";
  }
}

function changeLanguage() {
  toggleLanguage();
  setWeather(language);
}

//* DATE & TIME & GREETING

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getTimeOfDay(lang = "en") {
  let date = new Date();
  let hours = date.getHours();
  let index = Math.floor(hours / 6);

  if (lang === "en") {
    return timesOfDayEng[index];
  }
  if (lang === "ru") {
    return timesOfDayRus[index];
  }
}

function updateDate() {
  let dateX = new Date();
  let currentDate = dateX.toLocaleDateString(
    greetingTranslation[language].locale,
    greetingTranslation[language].dateOptions
  );

  date.textContent = currentDate[0].toUpperCase() + currentDate.slice(1);
}

function setGreeting() {
  greeting.textContent = greetingTranslation[language].greeting;
  clientName.placeholder = greetingTranslation[language].placeholder;
}

function updateTime() {
  let date = new Date();
  let currentTime = date.toLocaleTimeString(
    greetingTranslation[language].locale
  );
  time.textContent = currentTime;
  updateDate();
  setGreeting();
}

//* LOCAL STORAGE & BACKGROUND

function setLocalStorage() {
  localStorage.setItem("name", clientName.value);
  localStorage.setItem("city1", city.value);
}

function showSavedNameAndCity() {
  const currentName = localStorage.getItem("name");
  const currentCity = localStorage.getItem("city1");

  if (currentName) {
    clientName.value = currentName;
  }
  if (currentCity) {
    city.value = currentCity;
  }
}

async function setBackground() {
  const timeOfDay = getTimeOfDay("en");
  const random = RANDOM_1_20 < 10 ? `0${RANDOM_1_20}` : RANDOM_1_20;
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/insane-idea/momentum-images/master/${timeOfDay}/${random}.jpg`;

  const setBg = async () => {
    body.style.backgroundImage = `url(${img.src})`;
    body.style.backgroundSize = "cover";
  };

  img.onload = () => {
    setBg().then(() =>
      setTimeout(() => {
        isSlideEnabled = true;
      }, 1000)
    );
  };
}

function setNextSlide() {
  RANDOM_1_20++;
  isSlideEnabled = false;

  if (RANDOM_1_20 > 20) {
    RANDOM_1_20 = 1;
    setBackground();
  } else {
    setBackground();
  }
}

function setPrevSlide() {
  RANDOM_1_20--;
  isSlideEnabled = false;

  if (RANDOM_1_20 < 1) {
    RANDOM_1_20 = 20;
    setBackground();
  } else {
    setBackground();
  }
}

//* WEATHER & QUOTES

async function setWeather(lang = "en") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${
    localStorage.getItem("city1") || "Minsk"
  }&lang=${lang}&appid=e7cf8b5ebc96d9c3252a0dcddd2f27d9&units=metric`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    city.className = "city";

    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${greetingTranslation[language].wind} ${Math.floor(
      data.wind.speed
    )} m/s`;
    humidity.textContent = `${
      greetingTranslation[language].humidity
    } ${Math.floor(data.main.humidity)}%`;
  } else {
    city.classList.add("weather-error");
  }
}

async function setRandomQuote() {
  const quotes = "js/data.json";
  const load = await fetch(quotes);
  const data = await load.json();
  const RANDOM_0_1642 = getRandomNum(0, 1642);

  quote.textContent = data[RANDOM_0_1642].text;
  author.textContent = data[RANDOM_0_1642].author;
}

function init() {
  setBackground();
  setWeather(language);
  setRandomQuote();
}

function cityChangeObserver() {
  setLocalStorage();
  showSavedNameAndCity();
  setWeather(language);
}

init();
const clock = setInterval(updateTime, 500);

window.addEventListener("load", showSavedNameAndCity);
window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("beforeunload", () => clearInterval(clock));
slideNext.addEventListener("click", () => isSlideEnabled && setNextSlide());
slidePrev.addEventListener("click", () => isSlideEnabled && setPrevSlide());
city.addEventListener("change", cityChangeObserver);
translateBtn.addEventListener("click", changeLanguage);
changeQuoteBtn.addEventListener("click", setRandomQuote);
