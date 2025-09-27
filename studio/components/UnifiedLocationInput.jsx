import { useState, useEffect, useRef, useCallback } from 'react'
import { Stack, Card, Text, TextInput, Box, Button } from '@sanity/ui'
import { PatchEvent, set, setIfMissing } from 'sanity'

export function UnifiedLocationInput(props) {
  // State management
  const [isClient, setIsClient] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [mapsError, setMapsError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Refs for DOM elements and Google Maps instances
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  // Extract current values
  const currentValue = props.value || {}
  const coordinates = currentValue.coordinates
  const locationName = currentValue.locationName

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update location data in Sanity
  const updateLocation = useCallback((newLocationData) => {
    props.onChange(
      PatchEvent.from([
        setIfMissing({}),
        set(newLocationData.coordinates, ['coordinates']),
        set(newLocationData.locationName, ['locationName'])
      ])
    )
  }, [props])

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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly&loading=async`
      script.async = true
      script.onload = () => setTimeout(resolve, 500)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }, [])

  // Handle autocomplete using geocoding with multiple search strategies
  const handleAutocomplete = useCallback(async (value) => {
    if (!value || value.length < 2 || !window.google?.maps?.Geocoder) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const geocoder = new window.google.maps.Geocoder()

      // Multiple search strategies for better results
      const searchPromises = [
        // Direct search
        new Promise((resolve) => {
          geocoder.geocode({ address: value }, (results, status) => {
            resolve(status === 'OK' ? results : [])
          })
        }),
        // Enhanced searches with common location types
        ...['park', 'national park', 'airport', 'mountain', 'lake', 'beach', 'city'].map(suffix =>
          new Promise((resolve) => {
            geocoder.geocode({ address: `${value} ${suffix}` }, (results, status) => {
              resolve(status === 'OK' ? results.slice(0, 2) : [])
            })
          })
        )
      ]

      const searchResults = await Promise.all(searchPromises)
      const allResults = searchResults.flat()

      // Remove duplicates based on place_id
      const uniqueResults = allResults.filter((result, index, self) =>
        index === self.findIndex(r => r.place_id === result.place_id)
      )

      if (uniqueResults.length > 0) {
        const predictions = uniqueResults.slice(0, 8).map(result => {
          // Extract the best display name
          let mainText = result.formatted_address.split(',')[0]

          // Look for proper place names in address components
          const components = result.address_components || []
          for (const component of components) {
            const types = component.types || []
            if (types.some(type => [
              'establishment', 'point_of_interest', 'natural_feature',
              'park', 'tourist_attraction'
            ].includes(type))) {
              mainText = component.long_name
              break
            }
          }

          return {
            place_id: result.place_id,
            description: result.formatted_address,
            structured_formatting: { main_text: mainText },
            geometry: result.geometry
          }
        })

        setSuggestions(predictions)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.warn('Geocoding autocomplete error:', error)
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((prediction) => {
    if (!prediction.geometry) return

    const newCoordinates = {
      lat: prediction.geometry.location.lat(),
      lng: prediction.geometry.location.lng()
    }

    const newLocationName = prediction.structured_formatting.main_text ||
                           prediction.description.split(',')[0]

    updateLocation({
      coordinates: newCoordinates,
      locationName: newLocationName
    })

    setSearchValue(newLocationName)
    setSuggestions([])
    setShowSuggestions(false)

    // Update map with new location
    updateMapLocation(newCoordinates, newLocationName)
  }, [updateLocation])

  // Helper function to update map with new location
  const updateMapLocation = useCallback((coordinates, locationName) => {
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
      title: locationName
    })

    // Add drag listener
    markerRef.current.addListener('dragend', () => {
      const draggedCoordinates = {
        lat: markerRef.current.position.lat,
        lng: markerRef.current.position.lng
      }
      updateLocation({
        coordinates: draggedCoordinates,
        locationName: locationName
      })
    })
  }, [updateLocation])

  // Debounced autocomplete effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue && searchValue.length >= 2) {
        handleAutocomplete(searchValue)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue, handleAutocomplete])

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

          const defaultCentre = coordinates || { lat: 54.7024, lng: -3.2766 } // Centre of UK

          try {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
              center: defaultCentre,
              zoom: coordinates ? 12 : 5,
              mapTypeId: 'terrain',
              mapId: 'LOCATION_MAP'
            })

            // Add existing marker if coordinates exist
            if (coordinates) {
              updateMapLocation(coordinates, locationName || 'Photo location')
            }

            // Add click listener for new markers
            mapInstanceRef.current.addListener('click', (event) => {
              const newCoordinates = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              }
              updateMapLocation(newCoordinates, locationName || 'Photo location')
              updateLocation({
                coordinates: newCoordinates,
                locationName: locationName
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
  }, [isClient, coordinates, locationName, updateLocation, updateMapLocation, loadGoogleMapsAPI, mapsError])

  // Generate location name from coordinates
  const handleGenerateFromCoordinates = useCallback(async () => {
    if (!isClient || isGenerating || !coordinates || !window.google?.maps?.Geocoder) return

    setIsGenerating(true)

    try {
      const geocoder = new window.google.maps.Geocoder()

      geocoder.geocode({
        location: { lat: coordinates.lat, lng: coordinates.lng }
      }, (results, status) => {
        if (status === 'OK' && results?.length > 0) {
          // Filter out unwanted result types
          const filteredResults = results.filter(result => {
            const types = result.types || []
            const address = result.formatted_address || ''

            const unwantedTypes = [
              'street_address', 'route', 'street_number', 'postal_code',
              'postal_code_prefix', 'plus_code', 'premise', 'subpremise',
              'floor', 'room'
            ]

            const isStreetAddress = /^\d+/.test(address) ||
              /\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|court|ct|circle|cir|boulevard|blvd)\b/i.test(address.split(',')[0]) ||
              /^[A-Z0-9]{4,8}\+[A-Z0-9]{2,3}/.test(address.split(',')[0].trim())

            return !types.some(t => unwantedTypes.includes(t)) && !isStreetAddress
          })

          const resultsToCheck = filteredResults.length > 0 ? filteredResults : results

          // Find best result using scoring system
          let bestResult = null
          let bestScore = -1

          for (const result of resultsToCheck) {
            const types = result.types || []
            let score = 0

            // Score based on location type preference
            if (types.includes('natural_feature')) score += 1000
            if (types.includes('park')) score += 900
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
          let locationName = selectedResult.formatted_address

          // Create clean location name for areas
          if (selectedResult.types?.some(t => ['locality', 'sublocality', 'administrative_area_level_2'].includes(t))) {
            const components = selectedResult.address_components || []
            const locality = components.find(c => c.types.includes('locality'))?.long_name
            const sublocality = components.find(c => c.types.includes('sublocality'))?.long_name
            const admin2 = components.find(c => c.types.includes('administrative_area_level_2'))?.long_name
            const admin1 = components.find(c => c.types.includes('administrative_area_level_1'))?.short_name

            if (sublocality && locality && sublocality !== locality) {
              locationName = `${sublocality}, ${locality}`
            } else if (locality && admin1 && locality !== admin1) {
              locationName = `${locality}, ${admin1}`
            } else if (admin2 && admin1 && admin2 !== admin1) {
              locationName = `${admin2}, ${admin1}`
            } else if (locality) {
              locationName = locality
            } else if (admin2) {
              locationName = admin2
            } else {
              locationName = selectedResult.formatted_address.split(',')[0].trim()
            }
          } else {
            locationName = selectedResult.formatted_address.split(',')[0].trim()
          }

          updateLocation({
            coordinates: coordinates,
            locationName: locationName
          })
        } else {
          // Fallback to coordinate-based name
          const lat = coordinates.lat.toFixed(4)
          const lng = coordinates.lng.toFixed(4)
          updateLocation({
            coordinates: coordinates,
            locationName: `Location ${lat}, ${lng}`
          })
        }
        setIsGenerating(false)
      })
    } catch (error) {
      console.error('Generate location error:', error)
      const lat = coordinates.lat.toFixed(4)
      const lng = coordinates.lng.toFixed(4)
      updateLocation({
        coordinates: coordinates,
        locationName: `Location ${lat}, ${lng}`
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
            <Text size={1} weight="medium">⚠️ Google Maps Unavailable</Text>
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
            <Text size={1} weight="medium">🔍 Search for a location:</Text>
            {isClient && (
              <TextInput
                placeholder="Type a place name (e.g., 'Lake District')"
                value={searchValue}
                onChange={(event) => setSearchValue(event.currentTarget.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => {
                  if (suggestions.length > 0 && searchValue.length >= 2) {
                    setShowSuggestions(true)
                  }
                }}
              />
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <Box style={{ position: 'relative' }}>
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
                          ':hover': { backgroundColor: '#f6f8fa' }
                        }}
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <Text size={1}>{suggestion.description}</Text>
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
            <Text size={1} weight="medium">🗺️ Interactive Map:</Text>
            {isClient && (
              <Box style={{ height: '350px', width: '100%' }}>
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
              </Box>
            )}
            <Text size={1} muted>
              Click to drop a pin • Drag markers to adjust • Search above to jump to locations
            </Text>
            {coordinates && (
              <Button
                mode="ghost"
                tone="primary"
                text={isGenerating ? "🔄 Generating..." : "🔍 Generate location name from coordinates"}
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
            <Text size={1} weight="medium">📍 Current Location:</Text>
            {locationName && <Text size={1}><strong>Name:</strong> {locationName}</Text>}
            {coordinates && (
              <Text size={1}>
                <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </Text>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  )
}