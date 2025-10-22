import {useState, useEffect, useRef, useCallback} from 'react'
import {Stack, Card, Text, TextInput, Box, Button} from '@sanity/ui'
import {PatchEvent, set, setIfMissing} from 'sanity'

export function UnifiedLocationInput(props) {
    // State management
    const [isClient, setIsClient] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [mapsError, setMapsError] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [lastSelectedValue, setLastSelectedValue] = useState('')

    // Refs for DOM elements and Google Maps instances
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markerRef = useRef(null)

    // Extract current values
    const currentValue = props.value || {}
    const coordinates = currentValue.coordinates
    const locationName = currentValue.locationName
    const country = currentValue.country

    // Set client-side rendering flag
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Update location data in Sanity
    const updateLocation = useCallback(
        (newLocationData) => {
            const patches = [
                setIfMissing({}),
                set(newLocationData.coordinates, ['coordinates']),
                set(newLocationData.locationName, ['locationName']),
            ]

            // Only set country if it's provided
            if (newLocationData.country) {
                patches.push(set(newLocationData.country, ['country']))
            }

            props.onChange(PatchEvent.from(patches))
        },
        [props],
    )

    // Load Google Maps API (modern version only)
    const loadGoogleMapsAPI = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (window.google?.maps?.Map) {
                resolve()
                return
            }

            const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
            if (existingScript) {
                existingScript.onload = () => setTimeout(resolve, 500)
                existingScript.onerror = reject
                return
            }

            const apiKey = process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY
            if (!apiKey || apiKey === 'disabled') {
                reject(new Error('Google Maps API key not configured or disabled'))
                return
            }

            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&v=weekly&loading=async`
            script.async = true
            script.onload = () => setTimeout(resolve, 500)
            script.onerror = reject
            document.head.appendChild(script)
        })
    }, [])

    // Handle autocomplete using Google Places Autocomplete Service
    const handleAutocomplete = useCallback((value) => {
        if (!value || value.length < 2 || !window.google?.maps?.places?.AutocompleteService) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        try {
            const service = new window.google.maps.places.AutocompleteService()

            service.getPlacePredictions(
                {
                    input: value,
                    types: ['establishment', 'geocode'], // Include both specific places and general locations
                },
                (predictions, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        predictions
                    ) {
                        setSuggestions(predictions.slice(0, 8))
                        setShowSuggestions(true)
                    } else {
                        setSuggestions([])
                        setShowSuggestions(false)
                    }
                },
            )
        } catch (error) {
            console.warn('Places autocomplete error:', error)
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [])

    // Helper function to update map with new location
    const updateMapLocation = useCallback(
        (coordinates, locationName) => {
            if (!mapInstanceRef.current) return

            mapInstanceRef.current.setCenter(coordinates)
            mapInstanceRef.current.setZoom(14)

            // Remove existing marker
            if (markerRef.current) {
                markerRef.current.setMap(null)
            }

            // Create new marker
            markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                position: coordinates,
                map: mapInstanceRef.current,
                gmpDraggable: true,
                title: locationName,
            })

            // Add drag listener
            markerRef.current.addListener('dragend', () => {
                const draggedCoordinates = {
                    lat: markerRef.current.position.lat,
                    lng: markerRef.current.position.lng,
                }
                updateLocation({
                    coordinates: draggedCoordinates,
                    locationName: locationName,
                })
            })
        },
        [updateLocation],
    )

    // Helper function to extract country from address components using geocoder
    const extractCountryFromCoordinates = useCallback((coordinates) => {
        return new Promise((resolve) => {
            if (!window.google?.maps?.Geocoder) {
                resolve(null)
                return
            }

            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({location: coordinates}, (results, status) => {
                if (status === 'OK' && results?.length > 0) {
                    // Find country component in any result
                    for (const result of results) {
                        const countryComponent = result.address_components?.find((component) =>
                            component.types?.includes('country'),
                        )
                        if (countryComponent) {
                            resolve(countryComponent.long_name)
                            return
                        }
                    }
                }
                resolve(null)
            })
        })
    }, [])

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback(
        async (prediction) => {
            if (!window.google?.maps?.places?.PlacesService) return

            // Use Places Service to get detailed information about the selected place
            const service = new window.google.maps.places.PlacesService(
                document.createElement('div'),
            )

            service.getDetails(
                {
                    placeId: prediction.place_id,
                    fields: ['geometry', 'name', 'formatted_address', 'address_components'],
                },
                async (place, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        place.geometry
                    ) {
                        const newCoordinates = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        }

                        const newLocationName =
                            place.name ||
                            prediction.structured_formatting?.main_text ||
                            prediction.description.split(',')[0]

                        // Extract country from address components
                        let country = null
                        const countryComponent = place.address_components?.find((component) =>
                            component.types?.includes('country'),
                        )
                        if (countryComponent) {
                            country = countryComponent.long_name
                        } else {
                            // Fallback: use geocoder with coordinates
                            country = await extractCountryFromCoordinates(newCoordinates)
                        }

                        updateLocation({
                            coordinates: newCoordinates,
                            locationName: newLocationName,
                            country: country,
                        })

                        // Set flag to prevent autocomplete from triggering
                        setIsSelecting(true)
                        setSearchValue(newLocationName)
                        setSuggestions([])
                        setShowSuggestions(false)
                        setLastSelectedValue(newLocationName)

                        // Update map with new location
                        updateMapLocation(newCoordinates, newLocationName)

                        // Reset the flag after a short delay
                        setTimeout(() => setIsSelecting(false), 100)
                    }
                },
            )
        },
        [updateLocation, updateMapLocation, extractCountryFromCoordinates],
    )

    // Debounced autocomplete effect
    useEffect(() => {
        // Don't trigger autocomplete if we're in the middle of selecting
        if (isSelecting) return
        if (searchValue && searchValue === lastSelectedValue) {
            return
        }

        const timeout = setTimeout(() => {
            if (searchValue && searchValue.length >= 2) {
                handleAutocomplete(searchValue)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchValue, handleAutocomplete, isSelecting, lastSelectedValue])

    // Initialise Google Maps API
    useEffect(() => {
        if (!isClient) return

        loadGoogleMapsAPI()
            .then(() => {
                setMapsError(null)
            })
            .catch((error) => {
                setMapsError(error.message || 'Failed to load Google Maps')
            })
    }, [isClient, loadGoogleMapsAPI])

    // Initialise map
    useEffect(() => {
        if (!isClient || !mapRef.current || mapsError) return

        loadGoogleMapsAPI()
            .then(() => {
                setTimeout(() => {
                    if (!window.google?.maps?.Map) return

                    const defaultCentre = coordinates || {lat: 54.7024, lng: -3.2766} // Centre of UK

                    try {
                        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                            center: defaultCentre,
                            zoom: coordinates ? 12 : 5,
                            mapTypeId: 'terrain',
                            mapId: 'LOCATION_MAP',
                        })

                        // Add existing marker if coordinates exist
                        if (coordinates) {
                            updateMapLocation(coordinates, locationName || 'Photo location')
                        }

                        // Add click listener for new markers
                        mapInstanceRef.current.addListener('click', async (event) => {
                            const newCoordinates = {
                                lat: event.latLng.lat(),
                                lng: event.latLng.lng(),
                            }
                            updateMapLocation(newCoordinates, locationName || 'Photo location')

                            // Extract country from coordinates
                            const country = await extractCountryFromCoordinates(newCoordinates)

                            updateLocation({
                                coordinates: newCoordinates,
                                locationName: locationName,
                                country: country,
                            })
                        })
                    } catch (error) {
                        console.warn('Map initialisation failed:', error)
                    }
                }, 100)
            })
            .catch(() => {
                // Error already handled above
            })
    }, [
        isClient,
        coordinates,
        locationName,
        updateLocation,
        updateMapLocation,
        loadGoogleMapsAPI,
        mapsError,
        extractCountryFromCoordinates,
    ])

    // Generate location name from coordinates
    const handleGenerateFromCoordinates = useCallback(async () => {
        if (!isClient || isGenerating || !coordinates || !window.google?.maps?.Geocoder) return

        setIsGenerating(true)

        try {
            const geocoder = new window.google.maps.Geocoder()

            geocoder.geocode(
                {
                    location: {lat: coordinates.lat, lng: coordinates.lng},
                },
                (results, status) => {
                    if (status === 'OK' && results?.length > 0) {
                        // Filter out unwanted result types
                        const filteredResults = results.filter((result) => {
                            const types = result.types || []
                            const address = result.formatted_address || ''

                            const unwantedTypes = [
                                'street_address',
                                'route',
                                'street_number',
                                'postal_code',
                                'postal_code_prefix',
                                'plus_code',
                                'premise',
                                'subpremise',
                                'floor',
                                'room',
                            ]

                            const isStreetAddress =
                                /^\d+/.test(address) ||
                                /\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|court|ct|circle|cir|boulevard|blvd)\b/i.test(
                                    address.split(',')[0],
                                ) ||
                                /^[A-Z0-9]{4,8}\+[A-Z0-9]{2,3}/.test(address.split(',')[0].trim())

                            return !types.some((t) => unwantedTypes.includes(t)) && !isStreetAddress
                        })

                        const resultsToCheck =
                            filteredResults.length > 0 ? filteredResults : results

                        // Find best result using scoring system
                        let bestResult = null
                        let bestScore = -1

                        for (const result of resultsToCheck) {
                            const types = result.types || []
                            let score = 0

                            // Score based on location type preference
                            if (types.includes('natural_feature')) score += 1000
                            if (types.includes('zoo')) score += 950
                            if (types.includes('park')) score += 900
                            if (types.includes('aquarium')) score += 880
                            if (types.includes('airport')) score += 850
                            if (types.includes('tourist_attraction')) score += 800
                            if (types.includes('establishment')) score += 600
                            if (types.includes('point_of_interest')) score += 550
                            if (types.includes('sublocality')) score += 400
                            if (types.includes('locality')) score += 300
                            if (types.includes('administrative_area_level_2')) score += 200
                            if (types.includes('administrative_area_level_1')) score += 100

                            if (score > bestScore) {
                                bestScore = score
                                bestResult = result
                            }
                        }

                        const selectedResult = bestResult || resultsToCheck[0]
                        const components = selectedResult.address_components || []

                        const primaryName =
                            selectedResult.name ||
                            selectedResult.structured_formatting?.main_text ||
                            null

                        const preferredComponentOrders = [
                            ['establishment'],
                            ['point_of_interest'],
                            ['tourist_attraction'],
                            ['natural_feature'],
                            ['park'],
                            ['zoo'],
                            ['aquarium'],
                            ['museum'],
                            ['art_gallery'],
                            ['stadium'],
                            ['amusement_park'],
                            ['theme_park'],
                            ['campground'],
                            ['church', 'place_of_worship'],
                            ['premise'],
                            ['subpremise'],
                            ['neighborhood'],
                            ['colloquial_area'],
                            ['locality'],
                            ['sublocality'],
                            ['administrative_area_level_3'],
                            ['administrative_area_level_2'],
                            ['administrative_area_level_1'],
                            ['country'],
                        ]

                        const preferredNearbyTypes = new Set([
                            'establishment',
                            'point_of_interest',
                            'tourist_attraction',
                            'natural_feature',
                            'park',
                            'zoo',
                            'aquarium',
                            'museum',
                            'art_gallery',
                            'stadium',
                            'amusement_park',
                            'theme_park',
                            'campground',
                        ])

                        const buildComponentName = () => {
                            if (primaryName) {
                                return primaryName
                            }

                            for (const types of preferredComponentOrders) {
                                const match = components.find((component) =>
                                    types.some((type) => component.types?.includes(type)),
                                )
                                if (match?.long_name) {
                                    return match.long_name
                                }
                                if (match?.short_name) {
                                    return match.short_name
                                }
                            }

                            if (
                                selectedResult.types?.some((t) =>
                                    [
                                        'locality',
                                        'sublocality',
                                        'administrative_area_level_3',
                                        'administrative_area_level_2',
                                    ].includes(t),
                                )
                            ) {
                                const locality = components.find((c) =>
                                    c.types.includes('locality'),
                                )?.long_name
                                const sublocality = components.find((c) =>
                                    c.types.includes('sublocality'),
                                )?.long_name
                                const admin3 = components.find((c) =>
                                    c.types.includes('administrative_area_level_3'),
                                )?.long_name
                                const admin2 = components.find((c) =>
                                    c.types.includes('administrative_area_level_2'),
                                )?.long_name
                                const admin1 = components.find((c) =>
                                    c.types.includes('administrative_area_level_1'),
                                )?.short_name
                                const country = components.find((c) =>
                                    c.types.includes('country'),
                                )?.short_name

                                if (sublocality && locality && sublocality !== locality) {
                                    return `${sublocality}, ${locality}`
                                } else if (locality && admin1 && locality !== admin1) {
                                    return `${locality}, ${admin1}`
                                } else if (admin2 && admin1 && admin2 !== admin1) {
                                    return `${admin2}, ${admin1}`
                                } else if (admin3 && admin1 && admin3 !== admin1) {
                                    return `${admin3}, ${admin1}`
                                } else if (locality) {
                                    return admin1 ? `${locality}, ${admin1}` : locality
                                } else if (admin2) {
                                    return country ? `${admin2}, ${country}` : admin2
                                }
                            }

                            const formatted = selectedResult.formatted_address || ''
                            if (formatted) {
                                return formatted.split(',')[0].trim()
                            }
                            return null
                        }

                        const fallbackName = buildComponentName() || 'Unknown location'

                        // Extract country from address components
                        const countryComponent = components.find((c) => c.types?.includes('country'))
                        const extractedCountry = countryComponent?.long_name || null

                        const finish = (finalName) => {
                            updateLocation({
                                coordinates: coordinates,
                                locationName: finalName,
                                country: extractedCountry,
                            })
                            setIsGenerating(false)
                        }

                        const tryNearbySearch = (placeService) => {
                            if (!window.google?.maps?.places?.PlacesService || !placeService) {
                                finish(fallbackName)
                                return
                            }

                            try {
                                placeService.nearbySearch(
                                    {
                                        location: {lat: coordinates.lat, lng: coordinates.lng},
                                        radius: 1500,
                                        type: ['point_of_interest'],
                                    },
                                    (nearbyResults, nearbyStatus) => {
                                        if (
                                            nearbyStatus ===
                                                window.google.maps.places.PlacesServiceStatus.OK &&
                                            nearbyResults?.length
                                        ) {
                                            let chosen =
                                                nearbyResults.find((result) =>
                                                    result.types?.some((type) =>
                                                        preferredNearbyTypes.has(type),
                                                    ),
                                                ) || nearbyResults[0]
                                            const nearbyName =
                                                chosen?.name || chosen?.vicinity || fallbackName
                                            finish(nearbyName || fallbackName)
                                        } else {
                                            finish(fallbackName)
                                        }
                                    },
                                )
                            } catch (nearbyError) {
                                console.warn('Places nearby lookup failed:', nearbyError)
                                finish(fallbackName)
                            }
                        }

                        if (selectedResult.place_id && window.google?.maps?.places?.PlacesService) {
                            try {
                                const placeService = new window.google.maps.places.PlacesService(
                                    document.createElement('div'),
                                )
                                placeService.getDetails(
                                    {placeId: selectedResult.place_id, fields: ['name', 'types']},
                                    (placeDetails, placeStatus) => {
                                        if (
                                            placeStatus ===
                                                window.google.maps.places.PlacesServiceStatus.OK &&
                                            placeDetails?.name
                                        ) {
                                            finish(placeDetails.name)
                                        } else {
                                            tryNearbySearch(placeService)
                                        }
                                    },
                                )
                                return
                            } catch (detailsError) {
                                console.warn('Place details lookup failed:', detailsError)
                            }
                        }

                        finish(fallbackName)
                    } else {
                        // Fallback to coordinate-based name
                        const lat = coordinates.lat.toFixed(4)
                        const lng = coordinates.lng.toFixed(4)
                        updateLocation({
                            coordinates: coordinates,
                            locationName: `Location ${lat}, ${lng}`,
                        })
                        setIsGenerating(false)
                    }
                },
            )
        } catch (error) {
            console.error('Generate location error:', error)
            const lat = coordinates.lat.toFixed(4)
            const lng = coordinates.lng.toFixed(4)
            updateLocation({
                coordinates: coordinates,
                locationName: `Location ${lat}, ${lng}`,
            })
            setIsGenerating(false)
        }
    }, [isClient, isGenerating, coordinates, updateLocation])

    return (
        <Stack space={4}>
            {/* Error message */}
            {mapsError && (
                <Card padding={3} radius={2} tone="caution">
                    <Stack space={2}>
                        <Text size={1} weight="medium">
                            ⚠️ Google Maps Unavailable
                        </Text>
                        <Text size={1}>{mapsError}</Text>
                        <Text size={1} muted>
                            You can still manually enter coordinates if needed.
                        </Text>
                    </Stack>
                </Card>
            )}

            {/* Search section */}
            {!mapsError && (
                <Card padding={3} radius={2} tone="primary">
                    <Stack space={3}>
                        <Text size={1} weight="medium">
                            🔍 Search for a location:
                        </Text>
                        {isClient && (
                            <TextInput
                                placeholder="Type a place name (e.g., 'Lake District')"
                                value={searchValue}
                                onChange={(event) => {
                                    setLastSelectedValue('')
                                    setSearchValue(event.currentTarget.value)
                                }}
                                onBlur={() =>
                                    setTimeout(() => {
                                        if (!isSelecting) setShowSuggestions(false)
                                    }, 300)
                                }
                                onFocus={() => {
                                    if (suggestions.length > 0 && searchValue.length >= 2) {
                                        setShowSuggestions(true)
                                    }
                                }}
                            />
                        )}

                        {/* Suggestions dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <Box style={{position: 'relative'}}>
                                <Card
                                    padding={1}
                                    radius={2}
                                    tone="default"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        zIndex: 1000,
                                        border: '1px solid #e1e8ed',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Stack space={1}>
                                        {suggestions.map((suggestion, index) => (
                                            <Box
                                                key={suggestion.place_id || index}
                                                padding={2}
                                                style={{
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    ':hover': {backgroundColor: '#f6f8fa'},
                                                }}
                                                onClick={() => {
                                                    setIsSelecting(true)
                                                    setShowSuggestions(false)
                                                    handleSuggestionSelect(suggestion)
                                                }}
                                            >
                                                <Text size={1}>
                                                    <strong>
                                                        {suggestion.structured_formatting
                                                            ?.main_text ||
                                                            suggestion.description.split(',')[0]}
                                                    </strong>
                                                    {suggestion.structured_formatting
                                                        ?.secondary_text && (
                                                        <span
                                                            style={{
                                                                color: '#666',
                                                                marginLeft: '8px',
                                                            }}
                                                        >
                                                            {
                                                                suggestion.structured_formatting
                                                                    .secondary_text
                                                            }
                                                        </span>
                                                    )}
                                                </Text>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Card>
                            </Box>
                        )}

                        <Text size={1} muted>
                            Search above or click to drop pins on the map below
                        </Text>
                    </Stack>
                </Card>
            )}

            {/* Interactive map */}
            {!mapsError && (
                <Card padding={3} radius={2}>
                    <Stack space={3}>
                        <Text size={1} weight="medium">
                            🗺️ Interactive Map:
                        </Text>
                        {isClient && (
                            <Box style={{height: '350px', width: '100%'}}>
                                <div ref={mapRef} style={{height: '100%', width: '100%'}} />
                            </Box>
                        )}
                        <Text size={1} muted>
                            Click to drop a pin • Drag markers to adjust • Search above to jump to
                            locations
                        </Text>
                        {coordinates && (
                            <Button
                                mode="ghost"
                                tone="primary"
                                text={
                                    isGenerating
                                        ? '🔄 Generating...'
                                        : '🔍 Generate location name from coordinates'
                                }
                                onClick={handleGenerateFromCoordinates}
                                disabled={isGenerating}
                            />
                        )}
                    </Stack>
                </Card>
            )}

            {/* Current location display */}
            {(locationName || coordinates) && (
                <Card padding={3} radius={2} tone="positive">
                    <Stack space={2}>
                        <Text size={1} weight="medium">
                            📍 Current Location:
                        </Text>
                        {locationName && (
                            <Text size={1}>
                                <strong>Name:</strong> {locationName}
                            </Text>
                        )}
                        {country && (
                            <Text size={1}>
                                <strong>Country:</strong> {country}
                            </Text>
                        )}
                        {coordinates && (
                            <Text size={1}>
                                <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)},{' '}
                                {coordinates.lng.toFixed(6)}
                            </Text>
                        )}
                    </Stack>
                </Card>
            )}
        </Stack>
    )
}
