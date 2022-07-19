import { makeAutoObservable } from "mobx"

class Language {
  storagedLang = localStorage.getItem("lang")
  lang: string = this.storagedLang ? JSON.parse(this.storagedLang) : "en"

  constructor() {
    makeAutoObservable(this)
  }

  changeLanguage(value: string) {
    this.lang = value
    localStorage.setItem("lang", JSON.stringify(this.lang))
  }
}

export default new Language()
