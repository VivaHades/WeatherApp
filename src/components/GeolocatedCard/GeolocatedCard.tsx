import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

import styles from "./GeolocatedCard.module.scss"

import { API_KEY, API_URL } from "../../global_vars"

import IChartData from "../../interfaces/chartData"

import langStore from "../../store/LangStore"

import ErrorPopup from "../ErrorPopup/ErrorPopup"
import { Loader } from "../Loader/Loader"

interface Coords {
  lat: number | null
  lon: number | null
}

export const GeolocatedCard = () => {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [isCelsius, setIsCelsius] = useState<boolean>(true)
  const [data, setData] = useState<any>(null)
  const [weatherForecast, setWeatherForecast] = useState<any>(null)
  const [chartData, setChartData] = useState<IChartData[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation()

  const geolocate = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => setError(err.message)
    )
  }

  useEffect(() => {
    if (coords !== null) {
      setLoading(true)
      fetch(
        `${API_URL}weather?lon=${coords.lon}&lat=${coords.lat}&lang=${langStore.lang}&units=metric&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((res) => {
          setData(res)
          setLoading(false)
        })
        .catch((err) => setError(err.message))
    }
  }, [coords, langStore.lang])

  useEffect(() => {
    if (coords !== null) {
      setLoading(true)
      fetch(
        `${API_URL}forecast?lat=${coords.lat}&lon=${coords.lon}&units=${
          isCelsius ? "metric" : "imperial"
        }&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((res) => {
          setWeatherForecast(res)
          setLoading(false)
        })
        .catch((err) => setError(err.message))
    }
  }, [coords, isCelsius])

  useEffect(() => {
    if (weatherForecast && weatherForecast.list.length) {
      setChartData(
        weatherForecast.list.slice(0, 8).map((item: any) => {
          return {
            name: String(item.dt_txt.split(" ")[1].split(":")[0] + ":00"),
            uv: Number(item.main.temp),
            amt: Number(item.dt),
          }
        })
      )
    }
  }, [weatherForecast, isCelsius])

  if (error)
    return (
      <div className={styles.errorWrapper}>
        <button className={styles.geolocationButton} onClick={geolocate}>
          {t("geolocationButton")}
        </button>
        <ErrorPopup errorMessage={error} />
      </div>
    )

  if (loading) return <Loader />

  if (data != null)
    return (
      <div className={styles.card}>
        <div className={styles.cityAndWeather}>
          <div className={styles.city}>
            {data.name}, {data.sys?.country}
          </div>
          <div className={styles.weather}>
            <img
              className={styles.icon}
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={`${data.weather[0].description}`}
            />

            {data.weather[0].description}
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
            <XAxis dataKey="name" tick={{ fontSize: "8px" }} tickCount={5} />
            <YAxis tick={{ fontSize: "10px" }} type={"number"} minTickGap={0} />
            <Area type="monotone" dataKey="uv" stroke="#ffffff" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </div>

        <div className={styles.info}>
          <div className={styles.temp}>
            <div className={styles.tempMain}>
              {isCelsius ? data.main.temp : ((data.main.temp * 9) / 5 + 32).toFixed(2)}
              <button
                className={`${styles.tempSign} ${isCelsius ? styles.selected : ""}`}
                onClick={() => setIsCelsius(true)}
              >
                °C
              </button>
              <span className={styles.tempSign}>|</span>
              <button
                className={`${styles.tempSign} ${isCelsius ? "" : styles.selected}`}
                onClick={() => setIsCelsius(false)}
              >
                °F
              </button>
            </div>
            <div className={styles.tempFeelsLike}>
              <b>{t("FeelsLike")}:</b>{" "}
              {isCelsius ? data.main.feels_like : ((data.main.feels_like * 9) / 5 + 32).toFixed(2)}
            </div>
          </div>
          <div className={styles.WHP}>
            <div className={styles.WHPdatas}>
              {" "}
              <b>{t("wind")}:</b> {data.wind.speed} {t("speedUnits")}
            </div>
            <div className={styles.WHPdatas}>
              <b>{t("humidity")}:</b> {data.main.humidity} %
            </div>
            <div className={styles.WHPdatas}>
              <b>{t("pressure")}:</b> {data.main.pressure} {t("pressureUnits")}
            </div>
          </div>
        </div>
      </div>
    )
  return (
    <button className={styles.geolocationButton} onClick={geolocate}>
      {t("geolocationButton")}
    </button>
  )
}
