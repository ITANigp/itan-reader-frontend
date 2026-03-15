import BlogClient from './BlogClient'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic' // <- this forces SSR

export default async function BlogPage() {
  const query = `*[_type == "post" && defined(slug.current)] | order(_createdAt desc){
    _id,
    title,
    slug,
    body,
    mainImage,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      title,
      description
    }
  }`

  const posts = await client.fetch(query)

  return (
    <div className='mt-20'>
      <BlogClient posts={posts} />
    </div>
  );
}
