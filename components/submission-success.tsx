import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function SubmissionSuccess({
    submissionMessage
} : {
    submissionMessage?: string
}) {
    return (
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
            <div className="max-w-lg mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h2>
                    <p className="text-gray-600">{
                        submissionMessage || "Your form has been submitted successfully"}
                    </p>
                </div>

                {/* Powered by footer - positioned relative to the card */}
                <div className="mt-8 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                    <div className="flex items-center gap-2 justify-center">
                        <span>Powered by</span>
                        <Link href="/" className="text-blue-600 hover:underline">
                            <Image src="/Logo.svg" alt="FormGen Logo" width={100} height={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubmissionSuccess