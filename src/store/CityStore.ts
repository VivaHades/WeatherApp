import { makeAutoObservable } from "mobx"
import ICity from "../interfaces/city"

class Cities {
  storagedCities = localStorage.getItem("cities")
  cities: ICity[] = this.storagedCities ? JSON.parse(this.storagedCities) : []

  constructor() {
    makeAutoObservable(this)
  }

  addCity(cityName: string) {
    this.cities.push({ id: Date.now(), name: cityName, isCelsius: true })
    localStorage.setItem("cities", JSON.stringify(this.cities))
  }

  removeCity(city: ICity) {
    this.cities = this.cities.filter((c) => c.id !== city.id)
    localStorage.setItem("cities", JSON.stringify(this.cities))
  }
  celsiusToFahrengheit(city: ICity) {
    city.isCelsius = false
    localStorage.setItem("cities", JSON.stringify(this.cities))
  }
  fahrengheitToCelsius(city: ICity) {
    city.isCelsius = true
    localStorage.setItem("cities", JSON.stringify(this.cities))
  }
}
export default new Cities()
