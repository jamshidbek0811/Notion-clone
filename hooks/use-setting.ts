import { create } from 'zustand'

interface SettingState {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    onToggle: () => void
}

export const useSetting = create<SettingState>(( set, get) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    onToggle: () => set({ isOpen: !get().isOpen })
}))