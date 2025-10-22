// website/lib/sanity.js - This replaces your old portfolio-data.js

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === 'true';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    requestTimeout: 30000, // 30 second timeout to prevent hanging requests
    // Add token for authenticated requests if needed
    token: process.env.SANITY_API_TOKEN, // Optional: for authenticated requests
});

// Create a separate client for server-side operations
export const serverClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false, // Disable CDN for server-side operations for fresh data
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    requestTimeout: 30000,
    token: process.env.SANITY_API_TOKEN, // Server-side token
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
    return builder.image(source);
}

/**
 * Professional EXIF Data Parser
 *
 * This parser is designed to work with Sanity's EXIF extraction system
 * and follows the EXIF 2.3 standard field names and conventions.
 *
 * Based on analysis of actual EXIF data from modern cameras,
 * prioritizing the most reliable and standard field names.
 */

// EXIF field mappings based on EXIF 2.3 standard
const EXIF_FIELDS = {
    // Camera identification
    MAKE: 'Make', // Standard EXIF field for camera manufacturer
    MODEL: 'Model', // Standard EXIF field for camera model
    LENS_MODEL: 'LensModel', // Standard EXIF field for lens identification

    // Exposure settings (using standard EXIF names)
    F_NUMBER: 'FNumber', // Aperture as F-number (e.g., 6.3)
    APERTURE_VALUE: 'ApertureValue', // APEX aperture value (needs conversion)
    EXPOSURE_TIME: 'ExposureTime', // Shutter speed as decimal (e.g., 0.0008)
    SHUTTER_SPEED_VALUE: 'ShutterSpeedValue', // APEX shutter speed value
    ISO: 'ISO', // ISO sensitivity rating
    ISO_SPEED_RATINGS: 'ISOSpeedRatings', // Alternative ISO field
    FOCAL_LENGTH: 'FocalLength', // Focal length in millimeters
    FOCAL_LENGTH_35MM: 'FocalLengthIn35mmFormat', // 35mm equivalent focal length

    // Date and time
    DATE_TIME_ORIGINAL: 'DateTimeOriginal', // When photo was taken
    DATE_TIME_DIGITIZED: 'DateTimeDigitized', // When photo was digitized
};

/**
 * Convert APEX aperture value to F-number
 * Formula: F-number = sqrt(2)^ApertureValue
 */
function apexApertureToFNumber(apexValue) {
    return Math.round(Math.pow(Math.sqrt(2), apexValue) * 10) / 10;
}

/**
 * Convert decimal exposure time to readable shutter speed
 * e.g., 0.0008 -> "1/1250s", 2.5 -> "2.5s"
 */
function formatShutterSpeed(exposureTime) {
    if (exposureTime >= 1) {
        return `${exposureTime}s`;
    } else {
        return `1/${Math.round(1 / exposureTime)}s`;
    }
}

/**
 * Extract and format camera data from EXIF metadata
 */
export function getCameraData(image, manualOverrides = null) {
    if (!image?.asset?.metadata?.exif) {
        return null;
    }

    const exif = image.asset.metadata.exif;
    const manual = manualOverrides || image?.cameraData || null;

    // Camera identification
    const make = manual?.camera || exif[EXIF_FIELDS.MAKE] || null;
    const model = exif[EXIF_FIELDS.MODEL] || null;
    const camera =
        make && model ? `${make} ${model}`.trim() : make || model || null;

    // Lens information
    const lens = manual?.lens || exif[EXIF_FIELDS.LENS_MODEL] || null;

    // Exposure settings with proper EXIF standard fields
    let aperture = manual?.settings?.aperture || null;
    if (!aperture && exif[EXIF_FIELDS.F_NUMBER]) {
        aperture = `f/${exif[EXIF_FIELDS.F_NUMBER]}`;
    } else if (!aperture && exif[EXIF_FIELDS.APERTURE_VALUE]) {
        const fNumber = apexApertureToFNumber(exif[EXIF_FIELDS.APERTURE_VALUE]);
        aperture = `f/${fNumber}`;
    }

    let shutterSpeed = manual?.settings?.shutterSpeed || null;
    if (!shutterSpeed && exif[EXIF_FIELDS.EXPOSURE_TIME]) {
        shutterSpeed = formatShutterSpeed(exif[EXIF_FIELDS.EXPOSURE_TIME]);
    }

    const iso =
        manual?.settings?.iso ||
        exif[EXIF_FIELDS.ISO] ||
        exif[EXIF_FIELDS.ISO_SPEED_RATINGS] ||
        null;

    let focalLength = manual?.settings?.focalLength || null;
    if (!focalLength && exif[EXIF_FIELDS.FOCAL_LENGTH]) {
        focalLength = `${exif[EXIF_FIELDS.FOCAL_LENGTH]}mm`;
    } else if (!focalLength && exif[EXIF_FIELDS.FOCAL_LENGTH_35MM]) {
        focalLength = `${exif[EXIF_FIELDS.FOCAL_LENGTH_35MM]}mm`;
    }

    // Date information
    const captureDate =
        manual?.captureDate ||
        exif[EXIF_FIELDS.DATE_TIME_ORIGINAL] ||
        exif[EXIF_FIELDS.DATE_TIME_DIGITIZED] ||
        null;

    return {
        camera,
        lens,
        captureDate,
        settings: {
            aperture,
            shutterSpeed,
            iso,
            focalLength,
        },
    };
}

// Helper function to get GPS location from EXIF
export function getExifLocation(image) {
    if (!image?.asset?.metadata?.location) return null;

    const location = image.asset.metadata.location;
    if (location.lat && location.lng) {
        return {
            latitude: location.lat,
            longitude: location.lng,
            // Convert to readable format if needed
            coordinates: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
        };
    }

    return null;
}

// Fetch functions that replace your old static data
export async function getAllPhotos() {
    return client.fetch(`
    *[_type == "photo"] | order(_createdAt desc) {
      _id,
      title,
      description,
      image{
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            },
            lqip,
            exif,
            location
          }
        }
      },
      location,
      locationData,
      species[]->{name, category},
      category,
      featured,
      heroCarousel,
      cameraData,
      tags[]->{name},
      slug,
      _createdAt
    }
  `);
}

export async function getHeroImages() {
    return client.fetch(`
    *[_type == "photo" && heroCarousel == true] | order(_createdAt desc) {
      _id,
      title,
      description,
      image,
      location,
      category,
      slug
    }
  `);
}

export async function getFeaturedImages() {
    return serverClient.fetch(`
    *[_type == "photo" && featured == true] | order(_createdAt desc) [0...3] {
      _id,
      title,
      description,
      image,
      location,
      category,
      species,
      slug
    }
  `);
}

export async function getImagesByCategory(category) {
    return client.fetch(
        `
    *[_type == "photo" && category == $category] | order(_createdAt desc) {
      _id,
      title,
      description,
      image{
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            },
            lqip,
            exif,
            location
          }
        }
      },
      location,
      locationData,
      species[]->{name, category},
      category,
      featured,
      cameraData,
      tags[]->{name},
      slug
    }
  `,
        { category }
    );
}

export async function getPortfolioStats() {
    const stats = await client.fetch(`{
    "totalImages": count(*[_type == "photo"]),
    "landscapeCount": count(*[_type == "photo" && category == "landscape"]),
    "wildlifeCount": count(*[_type == "photo" && category == "wildlife"]),
    "featuredCount": count(*[_type == "photo" && featured == true]),
    "heroCount": count(*[_type == "photo" && heroCarousel == true]),
    "locations": array::unique(*[_type == "photo" && defined(locationData.locationName)].locationData.locationName),
    "species": array::unique(*[_type == "photo" && defined(species)].species[]->.name),
    "coordinateLocations": *[_type == "photo" && defined(locationData.coordinates.lat) && defined(locationData.coordinates.lng)].locationData.coordinates,
    "countries": array::unique(*[_type == "photo" && defined(locationData.country)].locationData.country)
  }`);

    // Helper function to group coordinates by ~100m precision for unique location counting
    const getUniqueCoordinateLocations = (coordinates) => {
        if (!coordinates || coordinates.length === 0) return [];

        const uniqueCoords = coordinates
            .map((coord) => {
                const lat = Math.round(coord.lat * 1000) / 1000;
                const lng = Math.round(coord.lng * 1000) / 1000;
                return `${lat},${lng}`;
            })
            .filter((coord, index, arr) => arr.indexOf(coord) === index);

        return uniqueCoords;
    };

    const uniqueCoordinateLocations = getUniqueCoordinateLocations(
        stats.coordinateLocations
    );

    return {
        ...stats,
        locationCount:
            uniqueCoordinateLocations.length > 0
                ? uniqueCoordinateLocations.length
                : stats.locations?.length || 0,
        speciesCount: stats.species?.length || 0,
        countryCount: stats.countries?.length || 0,
        countries: stats.countries || [], // Return the country list for use in other pages
    };
}

// Helper function to get display location name (only shows locationName, never coordinates)
export function getLocationDisplay(photo) {
    // Only return location name if it exists, never show coordinates on cards
    return photo?.locationData?.locationName || null;
}

// Additional helper functions
export const getImagesByTag = async (tag) => {
    return client.fetch(
        `
    *[_type == "photo" && $tag in tags[]->name] {
      _id,
      title,
      description,
      image,
      location,
      species[]->{name, category},
      category,
      tags[]->{name}
    }
  `,
        { tag }
    );
};

export const getImagesByLocation = async (location) => {
    return client.fetch(
        `
    *[_type == "photo" && locationData.locationName match $searchLocation] {
      _id,
      title,
      description,
      image,
      location,
      locationData,
      species[]->{name, category},
      category
    }
  `,
        { searchLocation: `*${location}*` }
    );
};

export const getPhotoBySlug = async (slug) => {
    return client.fetch(
        `
    *[_type == "photo" && slug.current == $slug][0] {
      _id,
      title,
      description,
      image{
        asset->{
          _id,
          url,
          metadata {
            exif,
            location
          }
        }
      },
      location,
      locationData,
      species[]->{name, category},
      category,
      featured,
      cameraData,
      tags[]->{name},
      slug,
      _createdAt
    }
  `,
        { slug }
    );
};
