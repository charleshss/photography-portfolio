import photo from './photo'
import species from './species'
import tag from './tag'
import homePage from './homePage'
import portfolioPage from './portfolioPage'
import landscapePage from './landscapePage'
import wildlifePage from './wildlifePage'
import aboutPage from './aboutPage'
import contactPageNew from './contactPageNew'

// Ordered for better UX: images first, then pages
export const schemaTypes = [
    photo,
    species,
    tag,
    homePage,
    portfolioPage,
    landscapePage,
    wildlifePage,
    aboutPage,
    contactPageNew,
]
