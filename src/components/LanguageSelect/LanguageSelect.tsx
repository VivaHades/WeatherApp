import React from "react"
import styles from "./LanguageSelect.module.scss"
import langStore from "../../store/LangStore"
import { observer } from "mobx-react-lite"
import i18n from "i18next"

export const LanguageSelect = observer(() => {
  return (
    <select
      className={styles.select}
      value={langStore.lang}
      onChange={(e) => {
        langStore.changeLanguage(e.target.value)
        i18n.changeLanguage(e.target.value)
      }}
    >
      <option className={styles.option} value="en">
        EN
      </option>
      <option className={styles.option} value="ua">
        UA
      </option>
      <option className={styles.option} value="ru">
        RU
      </option>
    </select>
  )
})
