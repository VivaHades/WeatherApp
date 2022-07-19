import React from "react"
import { Card } from "../Card/Card"
import styles from "./CardTable.module.scss"
import citiesStore from "../../store/CityStore"
import { observer } from "mobx-react-lite"

export const CardTable = observer(() => {
  return (
    <div className={styles.cardTable + " container row padding"}>
      {citiesStore.cities.map((city: any) => {
        return <Card key={city.name} city={city} />
      })}
    </div>
  )
})
