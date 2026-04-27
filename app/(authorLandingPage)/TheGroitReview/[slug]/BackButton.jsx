'use client'

import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white group-hover:bg-gray-200 transition-colors shadow-sm">
        <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
      </div>
      <span className="font-medium">Go Back</span>
    </button>
  )
}
