'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ContactModal } from '@/components/ui/ContactModal'

interface ContactModalContextType {
  openModal: (initialSubject?: string) => void
}

const ContactModalContext = createContext<ContactModalContextType>({
  openModal: () => {},
})

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialSubject, setInitialSubject] = useState<string | undefined>()

  const openModal = (subject?: string) => {
    setInitialSubject(subject)
    setIsOpen(true)
  }

  return (
    <ContactModalContext.Provider value={{ openModal }}>
      {children}
      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialSubject={initialSubject}
      />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  return useContext(ContactModalContext)
}
