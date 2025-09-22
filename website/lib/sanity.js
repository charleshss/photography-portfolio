// website/lib/sanity.js - This replaces your old portfolio-data.js

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: true,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    requestTimeout: 30000, // 30 second timeout to prevent hanging requests
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
    return builder.image(source)
}

// Fetch functions that replace your old static data
export async function getAllPhotos() {
    return client.fetch(`
    *[_type == "photo"] | order(_createdAt desc) {
      _id,
      title,
      description,
      image,
      location,
      species,
      category,
      featured,
      heroCarousel,
      cameraData,
      tags,
      slug,
      _createdAt
    }
  `)
}

export async function getHeroImages() {
    return client.fetch(`
    *[_type == "photo" && heroCarousel == true] | order(_createdAt desc) {
      _id,
      title,
      description,
      image,
      location,
      category
    }
  `)
}

export async function getFeaturedImages() {
    return client.fetch(`
    *[_type == "photo" && featured == true] | order(_createdAt desc) [0...3] {
      _id,
      title,
      description,
      image,
      location,
      category,
      species
    }
  `)
}

export async function getImagesByCategory(category) {
    return client.fetch(`
    *[_type == "photo" && category == $category] | order(_createdAt desc) {
      _id,
      title,
      description,
      image,
      location,
      species,
      category,
      featured,
      cameraData,
      tags,
      slug
    }
  `, { category })
}

export async function getPortfolioStats() {
    const stats = await client.fetch(`{
    "totalImages": count(*[_type == "photo"]),
    "landscapeCount": count(*[_type == "photo" && category == "landscape"]),
    "wildlifeCount": count(*[_type == "photo" && category == "wildlife"]),
    "featuredCount": count(*[_type == "photo" && featured == true]),
    "heroCount": count(*[_type == "photo" && heroCarousel == true]),
    "locations": array::unique(*[_type == "photo" && defined(location)].location),
    "species": array::unique(*[_type == "photo" && defined(species)].species)
  }`)

    return {
        ...stats,
        locationCount: stats.locations?.length || 0,
        speciesCount: stats.species?.length || 0
    }
}

// Additional helper functions
export const getImagesByTag = async (tag) => {
    return client.fetch(`
    *[_type == "photo" && $tag in tags] {
      _id,
      title,
      description,
      image,
      location,
      species,
      category,
      tags
    }
  `, { tag })
}

export const getImagesByLocation = async (location) => {
    return client.fetch(`
    *[_type == "photo" && location match $searchLocation] {
      _id,
      title,
      description,
      image,
      location,
      species,
      category
    }
  `, { searchLocation: `*${location}*` })
}