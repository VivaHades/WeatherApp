import React from "react"
import i18n from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import { useJsApiLoader } from "@react-google-maps/api"

import styles from "./App.module.scss"
import "./global.scss"

import { MAPS_KEY } from "./global_vars.js"

import langStore from "./store/LangStore"

import { CardTable } from "./components/CardTable/CardTable"
import { Search } from "./components/Search/Search"
import { LanguageSelect } from "./components/LanguageSelect/LanguageSelect"
import { GeolocatedCard } from "./components/GeolocatedCard/GeolocatedCard"
import { RussianTranslation } from "./translations/Russian"
import { EnglishTranslation } from "./translations/English"
import { UkrainianTranslation } from "./translations/Ukrainian"
import { Loader } from "./components/Loader/Loader"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: EnglishTranslation },
    ua: { translation: UkrainianTranslation },
    ru: { translation: RussianTranslation },
  },
  lng: langStore.lang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_KEY,
    libraries: ["places"],
  })

  const { t } = useTranslation()

  if (!isLoaded) {
    return (
      <div className={styles.App}>
        <div className="mainContainer container col">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.App}>
      <div className={`${styles.mainContainer} container col`}>
        <div className={`${styles.selectWrapper} container padding`}>
          <LanguageSelect />
        </div>
        <h1>{t("heading")}</h1>
        <GeolocatedCard />
        <Search />
        <CardTable />
      </div>
    </div>
  )
}

export default App
