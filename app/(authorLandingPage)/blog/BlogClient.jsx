'use client'

import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { useState, useMemo, useEffect } from 'react'

// ✅ Fix date parsing
const parseDate = (dateStr) => {
  if (!dateStr) return null
  try {
    const isoString = dateStr.includes('T')
      ? dateStr
      : dateStr.replace(' ', 'T') + ':00Z'
    const date = new Date(isoString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

export default function BlogClient({ posts }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const POSTS_PER_PAGE = 10

  const categories = useMemo(() => {
    const all = posts.flatMap(post => post.categories?.map(c => c.title) || [])
    const unique = Array.from(new Set(all))
    return ['All', ...unique]
  }, [posts])

  const getSnippet = (body) => {
    const firstBlock = body?.find(block => block._type === 'block')
    if (!firstBlock || !firstBlock.children) return ''
    const fullText = firstBlock.children.map(child => child.text).join(' ')
    return fullText.length > 180 ? fullText.slice(0, 180) + '...' : fullText
  }

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        if (selectedCategory !== 'All') {
          return post.categories?.some(c => c.title === selectedCategory)
        }
        return true
      })
      .filter(post => {
        const snippet = getSnippet(post.body).toLowerCase()
        return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snippet.includes(searchTerm.toLowerCase())
        )
      })
  }, [posts, selectedCategory, searchTerm])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl mb-10 text-center">
        <span className="font-bold">ITAN</span>{' '}
        <span className="font-light">BLOG.</span>
      </h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search posts..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* No Posts */}
      {paginatedPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No posts found.</p>
      )}

      {/* Featured Post */}
      {paginatedPosts.length > 0 && (
        <div className="mb-16 transition-transform hover:shadow-2xl hover:-translate-y-1 hover:border-gray-300 border rounded-xl p-4 bg-white">
          <Link href={`/blog/${paginatedPosts[0].slug.current}`}>
            <img
              src={urlFor(paginatedPosts[0].mainImage).width(1200).url()}
              alt={paginatedPosts[0].title}
              className="rounded-lg w-full h-[400px] object-cover mb-4"
            />
          </Link>
          <p className="text-sm font-semibold text-gray-800">
            {parseDate(paginatedPosts[0].publishedAt || paginatedPosts[0]._createdAt)
              ?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) || 'No date available'}
          </p>
          <Link href={`/blog/${paginatedPosts[0].slug.current}`}>
            <h2 className="text-3xl font-bold text-black hover:underline mt-1">
              {paginatedPosts[0].title}
            </h2>
          </Link>
        </div>
      )}

      {/* Remaining Posts */}
      <div className="grid md:grid-cols-3 gap-10">
        {paginatedPosts.slice(1).map(post => (
          <div
            key={post._id}
            className="bg-white hover:bg-gray-50 rounded-xl shadow-sm border transition-transform hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 p-4 cursor-pointer"
          >
            <Link href={`/blog/${post.slug.current}`}>
              <img
                src={urlFor(post.mainImage).width(600).url()}
                alt={post.title}
                className="rounded-lg w-full h-48 object-cover mb-3"
              />
            </Link>

            <p className="text-sm font-semibold text-gray-800">
              {parseDate(post.publishedAt || post._createdAt)
                ?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) || 'No date available'}
            </p>

            <Link href={`/blog/${post.slug.current}`}>
              <h3 className="text-lg font-semibold text-black hover:underline mt-1">
                {post.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600 text-sm pt-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <div className="mt-20 border-t pt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Become an Insider</h2>
        <p className="text-gray-600 mb-6">Get early access to big things.</p>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Join The Community
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
            <form action="/api/subscribe" method="POST" className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
