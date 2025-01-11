'use client'

import { useState } from 'react'

interface CustomAlertDialogProps {
  alertTitle: string
  description: string
  triggerBtnText: string
  cancelBtnText: string
  actionBtnText: string
  onActionClick: () => Promise<void>
}

export function CustomAlertDialog({
  alertTitle,
  description,
  triggerBtnText,
  cancelBtnText,
  actionBtnText,
  onActionClick,
}: CustomAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAction = async () => {
    setLoading(true)
    try {
      await onActionClick()
      setIsOpen(false) // 닫기
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        onClick={() => setIsOpen(true)}
      >
        {triggerBtnText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">{alertTitle}</h2>
            <p className="mb-6 text-gray-600">{description}</p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                {cancelBtnText}
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={handleAction}
                disabled={loading}
              >
                {loading ? 'Processing...' : actionBtnText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
