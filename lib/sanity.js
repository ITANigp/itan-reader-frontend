import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: 'mgzoy6yz',
  dataset: 'blog',
  apiVersion: '2023-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
