import React from "react"
import "./App.scss"
import "./global.scss"

import { useJsApiLoader } from "@react-google-maps/api"
import { MAPS_KEY } from "./Global.js"
import i18n from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import lang from "./store/LangStore"

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
  lng: lang.lang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

function App() {
  const { t } = useTranslation()
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_KEY,
    libraries: ["places"],
  })

  if (!isLoaded) {
    return (
      <div className="mainContainer container col">
        <Loader />
      </div>
    )
  }

  return (
    <div className="App">
      <div className="mainContainer container col">
        <div className="selectWrapper container padding">
          <LanguageSelect />
        </div>
        <h1 className="appHeader">{t("heading")}</h1>
        <GeolocatedCard />
        <Search />
        <CardTable />
      </div>
    </div>
  )
}

export default App
