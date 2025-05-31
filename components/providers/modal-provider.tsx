"use client"

import { useEffect, useState } from "react"
import SettingsModal from "../modals/settings-modal"
import CoverImageModal from "../modals/cover-image-modal"

const ModalProvider = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if(!mounted) return null

    return (
      <>
        <SettingsModal />
        <CoverImageModal />
      </>
    )
}

export default ModalProvider