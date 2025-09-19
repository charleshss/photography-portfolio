// lib/portfolio-data.js

/**
 * Image data structure:
 * {
 *   id: unique identifier
 *   src: image source URL
 *   alt: accessibility description
 *   title: display title
 *   description?: optional longer description
 *   location?: geographic location
 *   species?: for wildlife photos
 *   category: 'landscape' | 'wildlife' | 'hero'
 *   featured?: boolean for featured images
 *   tags?: array of tags for filtering
 *   captureDate?: when the photo was taken
 *   camera?: camera equipment used
 *   settings?: camera settings (ISO, aperture, etc.)
 * }
 */

export const portfolioImages = [
    // Hero Carousel Images
    {
        id: 'hero-1',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
        alt: 'Majestic mountain peaks during golden hour with dramatic clouds',
        title: 'Mountain Landscapes',
        description: "Capturing nature's majesty in the Swiss Alps",
        location: 'Alps, Switzerland',
        category: 'hero',
        featured: true,
        tags: ['mountains', 'golden-hour', 'dramatic'],
        captureDate: '2024-07-15',
        camera: 'Canon EOS R5',
        settings: { iso: 100, aperture: 'f/8', shutter: '1/125s' }
    },
    {
        id: 'hero-2',
        src: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&h=1080&fit=crop',
        alt: 'African lion in natural savanna habitat',
        title: 'Wildlife Photography',
        description: 'Animals in their natural habitat',
        location: 'Masai Mara, Kenya',
        species: 'African Lion',
        category: 'hero',
        featured: true,
        tags: ['wildlife', 'africa', 'big-cats'],
        captureDate: '2024-06-20',
        camera: 'Canon EOS R5',
        settings: { iso: 800, aperture: 'f/5.6', shutter: '1/500s' }
    },
    {
        id: 'hero-3',
        src: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&h=1080&fit=crop',
        alt: 'Serene lake reflecting surrounding forest',
        title: "Nature's Beauty",
        description: 'Moments frozen in time',
        location: 'Lake District, England',
        category: 'hero',
        featured: true,
        tags: ['lakes', 'reflections', 'peaceful'],
        captureDate: '2024-08-10',
        camera: 'Canon EOS R5',
        settings: { iso: 200, aperture: 'f/11', shutter: '1/60s' }
    },

    // Landscape Photography
    {
        id: 'landscape-1',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        alt: 'Mountain landscape at sunset with snow-capped peaks',
        title: 'Alpine Sunset',
        description: 'Golden hour light illuminating the majestic Alpine peaks',
        location: 'Alps, Switzerland',
        category: 'landscape',
        featured: true,
        tags: ['mountains', 'sunset', 'snow', 'dramatic'],
        captureDate: '2024-07-15'
    },
    {
        id: 'landscape-2',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        alt: 'Misty forest path through ancient woodland',
        title: 'Forest Path',
        description: 'A mystical journey through ancient English woodland',
        location: 'Peak District, England',
        category: 'landscape',
        tags: ['forest', 'mist', 'path', 'mystical'],
        captureDate: '2024-05-22'
    },
    {
        id: 'landscape-3',
        src: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop',
        alt: 'Crystal clear lake reflecting surrounding mountains',
        title: 'Mirror Lake',
        description: 'Perfect reflections in the tranquil waters of the Lake District',
        location: 'Lake District, England',
        category: 'landscape',
        featured: true,
        tags: ['lake', 'reflections', 'mountains', 'tranquil'],
        captureDate: '2024-08-10'
    },
    {
        id: 'landscape-4',
        src: 'https://images.unsplash.com/photo-1420593248178-d88870618ca0?w=800&h=600&fit=crop',
        alt: 'Rolling sand dunes in the Sahara Desert',
        title: 'Desert Dunes',
        description: 'The ever-changing patterns of wind-sculpted sand',
        location: 'Sahara Desert, Morocco',
        category: 'landscape',
        tags: ['desert', 'dunes', 'patterns', 'minimalist'],
        captureDate: '2024-03-18'
    },
    {
        id: 'landscape-5',
        src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
        alt: 'Rugged coastal cliffs with crashing waves',
        title: 'Rugged Coast',
        description: 'The dramatic meeting of land and sea on the Cornish coast',
        location: 'Cornwall, England',
        category: 'landscape',
        tags: ['coast', 'cliffs', 'waves', 'dramatic'],
        captureDate: '2024-09-05'
    },
    {
        id: 'landscape-6',
        src: 'https://images.unsplash.com/photo-1418879003684-a3d861c45d0c?w=800&h=600&fit=crop',
        alt: 'Golden valley with rolling hills and cypress trees',
        title: 'Tuscan Valley',
        description: 'The golden light of Tuscany illuminating cypress-lined hills',
        location: 'Tuscany, Italy',
        category: 'landscape',
        featured: true,
        tags: ['valley', 'hills', 'golden-hour', 'cyprus'],
        captureDate: '2024-04-12'
    },

    // Wildlife Photography
    {
        id: 'wildlife-1',
        src: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
        alt: 'Majestic male lion resting in savanna grassland',
        title: 'King of the Savanna',
        description: 'A magnificent male lion surveying his territory',
        location: 'Masai Mara, Kenya',
        species: 'African Lion (Panthera leo)',
        category: 'wildlife',
        featured: true,
        tags: ['big-cats', 'africa', 'savanna', 'portrait'],
        captureDate: '2024-06-20'
    },
    {
        id: 'wildlife-2',
        src: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop',
        alt: 'Golden eagle soaring with wings spread against mountain backdrop',
        title: 'Mountain Soarer',
        description: 'A golden eagle demonstrating the majesty of flight',
        location: 'Scottish Highlands',
        species: 'Golden Eagle (Aquila chrysaetos)',
        category: 'wildlife',
        featured: true,
        tags: ['birds', 'flight', 'mountains', 'majestic'],
        captureDate: '2024-07-08'
    },
    {
        id: 'wildlife-3',
        src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop',
        alt: 'Red fox in winter coat standing in snow',
        title: 'Winter Survivor',
        description: 'A red fox perfectly adapted to winter conditions',
        location: 'Yellowstone, USA',
        species: 'Red Fox (Vulpes vulpes)',
        category: 'wildlife',
        tags: ['mammals', 'winter', 'adaptation', 'portrait'],
        captureDate: '2024-01-15'
    },
    {
        id: 'wildlife-4',
        src: 'https://images.unsplash.com/photo-1582539436847-485e5d43c2b6?w=800&h=600&fit=crop',
        alt: 'African elephant family walking together',
        title: 'Family Bond',
        description: 'An elephant family demonstrating the strong bonds between generations',
        location: 'Serengeti, Tanzania',
        species: 'African Elephant (Loxodonta africana)',
        category: 'wildlife',
        featured: true,
        tags: ['elephants', 'family', 'africa', 'behaviour'],
        captureDate: '2024-08-25'
    },
    {
        id: 'wildlife-5',
        src: 'https://images.unsplash.com/photo-1571835782488-c21e3d7cebe0?w=800&h=600&fit=crop',
        alt: 'Brown bear catching salmon in rushing river',
        title: 'Forest Guardian',
        description: 'A brown bear demonstrating incredible fishing skills',
        location: 'Alaska, USA',
        species: 'Brown Bear (Ursus arctos)',
        category: 'wildlife',
        tags: ['bears', 'fishing', 'rivers', 'action'],
        captureDate: '2024-09-10'
    }
];

// Helper functions for data access
export const getImagesByCategory = (category) => {
    return portfolioImages.filter(image => image.category === category);
};

export const getFeaturedImages = (category = null) => {
    let images = portfolioImages.filter(image => image.featured);
    if (category) {
        images = images.filter(image => image.category === category);
    }
    return images;
};

export const getImageById = (id) => {
    return portfolioImages.find(image => image.id === id);
};

export const getImagesByTag = (tag) => {
    return portfolioImages.filter(image =>
        image.tags && image.tags.includes(tag)
    );
};

export const getImagesByLocation = (location) => {
    return portfolioImages.filter(image =>
        image.location && image.location.toLowerCase().includes(location.toLowerCase())
    );
};

export const getRandomImages = (count, category = null) => {
    let images = category ? getImagesByCategory(category) : portfolioImages;
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Statistics helpers
export const getPortfolioStats = () => {
    const landscapes = getImagesByCategory('landscape');
    const wildlife = getImagesByCategory('wildlife');

    const locations = [...new Set(portfolioImages
        .filter(img => img.location)
        .map(img => img.location)
    )];

    const species = [...new Set(portfolioImages
        .filter(img => img.species)
        .map(img => img.species)
    )];

    return {
        totalImages: portfolioImages.length,
        landscapeCount: landscapes.length,
        wildlifeCount: wildlife.length,
        locationCount: locations.length,
        speciesCount: species.length,
        featuredCount: getFeaturedImages().length
    };
};

// Export categories for easy access
export const CATEGORIES = {
    HERO: 'hero',
    LANDSCAPE: 'landscape',
    WILDLIFE: 'wildlife'
};

// Export default data structure for backward compatibility
export default {
    hero: getImagesByCategory('hero'),
    landscapes: getImagesByCategory('landscape'),
    wildlife: getImagesByCategory('wildlife'),
    featured: getFeaturedImages()
};
