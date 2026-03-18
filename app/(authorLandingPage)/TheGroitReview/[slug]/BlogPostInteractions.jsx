'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXTwitter,
  faFacebookF,
  faInstagram,
  faTiktok,
  faWhatsapp,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons'
import {
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
  faShare,
} from '@fortawesome/free-solid-svg-icons'
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
} from '@fortawesome/free-regular-svg-icons'

export default function BlogPostInteractions({ postTitle, postSlug }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [saveCount, setSaveCount] = useState(0)

  useEffect(() => {
    setLikeCount(Math.floor(Math.random() * 800) + 200)
    setSaveCount(Math.floor(Math.random() * 300) + 50)
  }, [postSlug])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    setSaveCount(prev => isSaved ? prev - 1 : prev + 1)
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/TheGroitReview/${postSlug}` : ''
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(postTitle)

  return (
    <div className="mt-10 border-t pt-8">
      {/* Engagement Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 group transition-all"
          >
            <FontAwesomeIcon
              icon={isLiked ? faHeartSolid : faHeartRegular}
              className={`text-2xl transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-gray-600 group-hover:text-red-500'}`}
            />
            <span className="text-gray-700 font-medium">{likeCount.toLocaleString()}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 group transition-all"
          >
            <FontAwesomeIcon
              icon={isSaved ? faBookmarkSolid : faBookmarkRegular}
              className={`text-2xl transition-all ${isSaved ? 'text-yellow-500 scale-110' : 'text-gray-600 group-hover:text-yellow-500'}`}
            />
            <span className="text-gray-700 font-medium">{saveCount.toLocaleString()}</span>
          </button>
        </div>

        {/* Share Section */}
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faShare} className="text-gray-500 mr-2" />
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-gray-50 rounded-xl">
        <span className="text-sm font-medium text-gray-600 mr-2">Share this article:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#166FE5] transition-all hover:scale-110 shadow-md"
          title="Share on Facebook"
        >
          <FontAwesomeIcon icon={faFacebookF} className="text-white" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-all hover:scale-110 shadow-md"
          title="Share on X"
        >
          <FontAwesomeIcon icon={faXTwitter} className="text-white" />
        </a>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20BA5C] transition-all hover:scale-110 shadow-md"
          title="Share on WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
        </a>
        <a
          href={`https://www.instagram.com/`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 transition-all hover:scale-110 shadow-md"
          title="Share on Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} className="text-white" />
        </a>
        <a
          href={`https://www.tiktok.com/`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-all hover:scale-110 shadow-md"
          title="Share on TikTok"
        >
          <FontAwesomeIcon icon={faTiktok} className="text-white" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A66C2] hover:bg-[#004182] transition-all hover:scale-110 shadow-md"
          title="Share on LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedinIn} className="text-white" />
        </a>
      </div>
    </div>
  )
}
