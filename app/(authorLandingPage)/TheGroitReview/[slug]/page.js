import { client, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import BlogPostInteractions from './BlogPostInteractions'
import BackButton from './BackButton'

export const dynamic = 'force-dynamic'; // SSR instead of ISR

export default async function Page({ params }) {
  const { slug } = await params;

  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    body,
    mainImage,
    publishedAt,
    author->{
      name,
      image
    }
  }`

  const post = await client.fetch(query, { slug });

  if (!post) return notFound();

  const components = {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null;
        return (
          <img
            src={urlFor(value).width(800).url()}
            alt="Blog image"
            className="my-8 rounded-lg w-full object-cover"
          />
        );
      },
    },
    block: {
      normal: ({ children }) => <p className="mb-6 text-gray-700 leading-relaxed text-lg">{children}</p>,
      h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold mt-12 mb-6 text-gray-900">{children}</h1>,
      h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-5 text-gray-900">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-semibold mt-8 mb-4 text-gray-900">{children}</h3>,
      h4: ({ children }) => <h4 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h4>,
      h5: ({ children }) => <h5 className="text-lg md:text-xl font-medium mt-5 mb-3 text-gray-800">{children}</h5>,
      h6: ({ children }) => <h6 className="text-base md:text-lg font-medium mt-4 mb-2 text-gray-800">{children}</h6>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-red-500 pl-6 py-4 my-8 bg-gray-50 rounded-r-lg italic text-gray-700 text-lg">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc list-outside ml-6 mb-6 space-y-3 text-gray-700 text-lg">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-3 text-gray-700 text-lg">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
      number: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = value?.href || '';
        const isExternal = href.startsWith('http');
        const text = typeof children === 'string' ? children : (children?.[0] || '');
        
        // Check if this is a CTA button (Get Book, Read More, etc.)
        const ctaPatterns = ['get book', 'read more', 'learn more', 'buy now', 'shop now', 'download', 'subscribe'];
        const isCTA = ctaPatterns.some(pattern => 
          text.toString().toLowerCase().includes(pattern)
        );
        
        if (isCTA) {
          return (
            <a
              href={href}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 my-4"
            >
              {children}
            </a>
          );
        }
        
        return (
          <a
            href={href}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-red-600 hover:text-red-700 underline underline-offset-2 font-medium transition-colors"
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">{children}</code>,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 md:p-6 py-12 md:py-24">
        <BackButton />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          {post.author?.name && <>By {post.author.name}</>}
          {post.publishedAt && <> · {format(new Date(post.publishedAt), 'PPP')}</>}
        </div>

        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).width(900).url()}
            alt={post.title}
            className="rounded-lg mb-8 shadow-lg w-full object-cover"
          />
        )}

        <article className="prose prose-lg max-w-none">
          <PortableText value={post.body} components={components} />
        </article>

        <BlogPostInteractions postTitle={post.title} postSlug={slug} />
      </div>
    </div>
  )
}
