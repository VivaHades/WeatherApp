import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"

import styles from "./Card.module.scss"

import { API_KEY, API_URL } from "../../Global"

import citiesStore from "../../store/CityStore"
import langStore from "../../store/LangStore"

import IChartData from "../../interfaces/chartData"
import ICity from "../../interfaces/city"

import { AreaChart, XAxis, YAxis, Area } from "recharts"
import ErrorPopup from "../ErrorPopup/ErrorPopup"
import { Loader } from "../Loader/Loader"

interface ICard {
  city: ICity
}

export const Card = observer((props: ICard) => {
  const { city } = props
  const [weather, setWeather] = useState<any>(null)
  const [weatherForecast, setWeatherForecast] = useState<any>(null)
  const [chartData, setChartData] = useState<IChartData[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()

  /* fetching weather data */
  useEffect(() => {
    if (citiesStore.cities.length) {
      setLoading(true)
      fetch(`${API_URL}weather?q=${city.name}&units=metric&lang=${langStore.lang}&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => {
          if (Number(res.cod) !== 200) {
            const err = new Error(res.message)
            setErrorMessage(err.message)
            setTimeout(() => citiesStore.removeCity(city), 3000)
          } else {
            setWeather(res)
            setLoading(false)
          }
        })
        .catch((err) => {
          setErrorMessage(err.message)
          setTimeout(() => citiesStore.removeCity(city), 3000)
          console.log(weather)
          console.log(city)
        })
    }
  }, [langStore.lang])

  /* fetching weather forecast data */
  useEffect(() => {
    if (citiesStore.cities.length) {
      setLoading(true)
      fetch(`${API_URL}forecast?q=${city.name}&units=${city.isCelsius ? "metric" : "imperial"}&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => {
          if (Number(res.cod) !== 200) {
            const err = new Error(res.message)
            setErrorMessage(err.message)
            setTimeout(() => citiesStore.removeCity(city), 3000)
          } else {
            setWeatherForecast(res)
            setLoading(false)
          }
        })
        .catch((err) => {
          setErrorMessage(err.message)
          setTimeout(() => citiesStore.removeCity(city), 3000)
        })
    }
  }, [city.isCelsius])

  /* setting chart data */
  useEffect(() => {
    if (weatherForecast) {
      setChartData(
        weatherForecast.list.slice(0, 16).map((item: any) => {
          return {
            name: String(item.dt_txt.split(" ")[1].split(":")[0] + ":00"),
            uv: Number(item.main.temp),
            amt: Number(item.dt),
          }
        })
      )
    }
  }, [weatherForecast])

  if (errorMessage) {
    return (
      <div className={styles.card}>
        <button
          className={styles.removeButton}
          onClick={() => {
            citiesStore.removeCity(city)
          }}
        >
          <svg height="15px" width="15px" viewBox="0 0 512 512">
            <path
              fill="#fff"
              d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
            />
          </svg>
        </button>
        <ErrorPopup errorMessage={errorMessage} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.card}>
        <Loader />
      </div>
    )
  }
  
  if (weather) {
    return (
      <div className={styles.card}>
        <button
          className={styles.removeButton}
          onClick={() => {
            citiesStore.removeCity(city)
          }}
        >
          <svg height="15px" width="15px" viewBox="0 0 512 512">
            <path
              fill="#fff"
              d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
            />
          </svg>
        </button>
        <div className={styles.cityAndWeather}>
          <div className={styles.city}>
            {weather.name}, {weather.sys?.country}
          </div>
          <div className={styles.weather}>
            <img
              className={styles.icon}
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={`${weather.weather[0].description}`}
            />
            {weather.weather[0].description}
          </div>
        </div>
        <div className={styles.chart}>
          <AreaChart width={340} height={100} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: "8px" }} tickCount={5} tickSize={2} />
            <YAxis tick={{ fontSize: "10px" }} type={"number"} minTickGap={0} tickSize={2} />
            <Area type="monotone" dataKey="uv" stroke="#ffffff" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </div>

        <div className={styles.info}>
          <div className={styles.temp}>
            <div className={styles.tempMain}>
              {city.isCelsius ? weather.main.temp : ((weather.main.temp * 9) / 5 + 32).toFixed(2)}
              <button
                className={`${styles.tempSign} ${city.isCelsius ? styles.selected : ""}`}
                onClick={() => {
                  citiesStore.fahrengheitToCelsius(city)
                }}
              >
                °C
              </button>
              <span className={styles.tempSign}>|</span>
              <button
                className={`${styles.tempSign} ${city.isCelsius ? "" : styles.selected}`}
                onClick={() => {
                  citiesStore.celsiusToFahrengheit(city)
                }}
              >
                °F
              </button>
            </div>
            <div className={styles.tempFeelsLike}>
              <b>{t("feelsLike")}:</b>{" "}
              {city.isCelsius ? weather.main.feels_like : ((weather.main.feels_like * 9) / 5 + 32).toFixed(2)}
            </div>
          </div>
          <div className={styles.WHP}>
            <div className={styles.WHPitems}>
              {" "}
              <b>{t("wind")}:</b> {weather.wind.speed} {t("speedUnits")}
            </div>
            <div className={styles.WHPitems}>
              <b>{t("humidity")}:</b> {weather.main.humidity} %
            </div>
            <div className={styles.WHPitems}>
              <b>{t("pressure")}:</b> {weather.main.pressure} {t("pressureUnits")}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
})
