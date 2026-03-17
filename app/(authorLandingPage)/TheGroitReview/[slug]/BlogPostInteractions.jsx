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
  faPaperPlane,
  faSpinner,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
  faComment,
} from '@fortawesome/free-regular-svg-icons'

// Default Avatar Component
const DefaultAvatar = ({ name, size = 'md' }) => {
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const getColor = (name) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500'
    ]
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  return (
    <div className={`${sizeClasses[size]} ${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold`}>
      {getInitials(name)}
    </div>
  )
}

export default function BlogPostInteractions({ postTitle, postSlug }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [saveCount, setSaveCount] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userName, setUserName] = useState('')

  // Get localStorage key for this specific post
  const getStorageKey = () => `blog_comments_${postSlug}`

  // Initialize - load comments from localStorage
  useEffect(() => {
    setLikeCount(Math.floor(Math.random() * 800) + 200)
    setSaveCount(Math.floor(Math.random() * 300) + 50)

    // Load saved comments from localStorage
    const savedComments = localStorage.getItem(getStorageKey())
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments))
      } catch (e) {
        setComments([])
      }
    }

    // Load saved username
    const savedUserName = localStorage.getItem('blog_user_name')
    if (savedUserName) {
      setUserName(savedUserName)
    }
  }, [postSlug])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    setSaveCount(prev => isSaved ? prev - 1 : prev + 1)
  }

  const handleCommentLike = (commentId) => {
    setComments(prev => {
      const updated = prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        }
        return comment
      })
      localStorage.setItem(getStorageKey(), JSON.stringify(updated))
      return updated
    })
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !userName.trim()) return

    setIsSubmitting(true)

    // Save username for future use
    localStorage.setItem('blog_user_name', userName)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const userComment = {
      id: Date.now(),
      name: userName,
      text: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    setComments(prev => {
      const updated = [userComment, ...prev]
      localStorage.setItem(getStorageKey(), JSON.stringify(updated))
      return updated
    })
    setNewComment('')
    setIsSubmitting(false)
  }

  // Format relative time from ISO date string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
    const months = Math.floor(days / 30)
    return `${months} month${months !== 1 ? 's' : ''} ago`
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

          {/* Comment Count */}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faComment}
              className="text-2xl text-gray-600"
            />
            <span className="text-gray-700 font-medium">{comments.length}</span>
          </div>

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

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faComment} className="text-gray-600" />
          Comments ({comments.length})
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="3"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || !userName.trim() || isSubmitting}
                  className="absolute right-3 bottom-3 w-9 h-9 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faSpinner} className="text-white animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faComment} className="text-4xl mb-3 text-gray-300" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                <DefaultAvatar name={comment.name} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{comment.name}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{getTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                      <FontAwesomeIcon
                        icon={comment.isLiked ? faHeartSolid : faHeartRegular}
                        className="text-sm"
                      />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
