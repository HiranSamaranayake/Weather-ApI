const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const searchCitySection = document.querySelector('.search-city')
const WeatherInfosection = document.querySelector('.weather-info')

const countryTxt = document.querySelector('.country-text')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityVAlueaTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weathersummaryImg = document.querySelector('.weather-summary-img')
const CurrentDateTxt = document.querySelector('.current-date-txt')
const notFoundSection = document.querySelector('.not-found')
const forecastItemConteiner = document.querySelector('.forcast-item-container')
const apiKey = 'ff4492438dc0af011dedc26cbdb34885'

searchBtn.addEventListener('click' , () => {
    if(cityInput.value.trim() !=''){
       updateWeatherInfo(cityInput.value)
       cityInput.value=''
       cityInput.blur()
    }
  
})
cityInput.addEventListener('keydown', (event) =>{
    if(event.key == 'Enter' && 
        cityInput.value.trim() !='' 
    ){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

async function getFetchdata(endPoint , city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getweatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 323) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentdate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
   return (currentDate.toLocaleDateString('en-GB' , options))
}

async function updateWeatherInfo(city){
    const weatherdata =  await getFetchdata('weather', city)
    
    if(weatherdata.cod !=200){
        showDsiplaySection(notFoundSection)
        return
    }

    console.log(weatherdata)

    const{
        name: country,
        main:{temp , humidity },
        weather: [{id , main}],
        wind: {speed}
    } = weatherdata

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityVAlueaTxt.textContent = humidity +'%'
    windValueTxt.textContent =  speed + 'M/s'

    CurrentDateTxt.textContent = getCurrentdate()
    console.log(getCurrentdate())
    
    weathersummaryImg.src = `assets/weather/${getweatherIcon(id)}`

    await updateForecastInfo(city)
    showDsiplaySection(WeatherInfosection)
}

async function updateForecastInfo(city){
    const forecastsData = await getFetchdata('forecast' , city)
  
    const timeTaken = '12:00:00'
    const todayDate = new Date ().toISOString().split('T')[0]

    forecastItemConteiner.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        
        if(forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)
                // console.log(forecastWeather)
        }    
    })
}

function updateForecastItems(weatherdata){

    console.log(weatherdata)
    const{
        dt_txt: date ,
        weather: [{id}] ,
        main:{ temp }
    } = weatherdata

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US' , dateOption)

    const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-item regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getweatherIcon(id)}" class="forcast-item-img">
                    <h5 class="forecast-item-temp"> ${Math.round(temp)} °C</h5>
                </div>`

    forecastItemConteiner.insertAdjacentHTML('beforeend' , forecastItem)
}

function showDsiplaySection(section){

    [WeatherInfosection , searchCitySection , notFoundSection]
    .forEach(section => section.style.display = 'none')
 
    section.style.display = 'flex' 
}