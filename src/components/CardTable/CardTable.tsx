import React from "react"
import { observer } from "mobx-react-lite"

import styles from "./CardTable.module.scss"

import citiesStore from "../../store/CityStore"

import { Card } from "../Card/Card"

export const CardTable = observer(() => {
  return (
    <div className={styles.cardTable + " container row padding"}>
      {citiesStore.cities.map((city: any) => {
        return <Card key={city.name} city={city} />
      })}
    </div>
  )
})
