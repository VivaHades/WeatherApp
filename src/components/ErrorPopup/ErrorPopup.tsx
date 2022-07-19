import React from "react"

import styles from "./ErrorPopup.module.scss"

interface IErrorPopupProps {
  errorMessage: string
}

export default function ErrorPopup(props: IErrorPopupProps) {
  const { errorMessage } = props
  return <div className={styles.errorBlock}>{errorMessage}</div>
}
