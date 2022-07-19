import React, { useRef, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useTranslation } from "react-i18next"

import styles from "./Search.module.scss"
import "./Autocomplete.scss"

import citiesStore from "../../store/CityStore"

export const Search = () => {
  const autocompleteRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState("")

  const { t } = useTranslation()

  const handleChange = (e: any) => {
    setInputValue(e.target.value)
  }

  return (
    <form className={styles.form + " container padding"} onSubmit={(e) => e.preventDefault()}>
      <Autocomplete>
        <input
          ref={autocompleteRef}
          value={inputValue}
          onChange={handleChange}
          className={styles.input}
          type="text"
          placeholder={t("searchPlaceholder")}
        />
      </Autocomplete>
      <button
        disabled={inputValue === "" ? true : false}
        type="button"
        className={styles.button}
        onClick={() => {
          if (autocompleteRef.current != null) {
            citiesStore.addCity(autocompleteRef.current.value)
            setInputValue("")
          }
        }}
      >
        {t("addButton")}
      </button>
    </form>
  )
}
