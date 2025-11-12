'use client'

// DISABLED: Intro popup is completely disabled
// This component will never render anything

interface IntroImagePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function IntroImagePopup({ isOpen, onClose }: IntroImagePopupProps) {
  // Always return null - component is disabled
  return null;
}
