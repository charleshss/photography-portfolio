import { useState, useEffect, useRef } from 'react'
import { Stack, Card, Text, TextInput, Box, Button } from '@sanity/ui'
import { PatchEvent, set, setIfMissing } from 'sanity'

export function UnifiedLocationInput(props) {
  const [isClient, setIsClient] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  const currentValue = props.value || {}
  const coordinates = currentValue.coordinates
  const locationName = currentValue.locationName

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load Google Maps API with Places library (only once)
  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve()
        return
      }

      // Check if script is already loading
      const existingScript = globalThis.document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        existingScript.onload = resolve
        existingScript.onerror = reject
        return
      }

      const script = globalThis.document.createElement('script')
      const apiKey = process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        reject(new Error('Google Maps API key not configured'))
        return
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&loading=async&v=beta`
      script.async = true
      script.onload = resolve
      script.onerror = reject
      globalThis.document.head.appendChild(script)
    })
  }

  // Initialize Places Autocomplete (always active)
  useEffect(() => {
    if (isClient && inputRef.current) {
      loadGoogleMapsAPI()
        .then(() => {
          // Add small delay to ensure API is fully ready
          setTimeout(() => {
            if (autocompleteRef.current) {
              window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
            }

            if (window.google && window.google.maps && window.google.maps.places) {
              // Use legacy Autocomplete for now (new API is still in beta and has different syntax)
              autocompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                  types: ['establishment', 'geocode'],
                  fields: ['place_id', 'formatted_address', 'name', 'geometry', 'types']
                }
              )

              autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace()
                if (place.geometry) {
                  const newLocationName = place.name || place.formatted_address
                  const newCoordinates = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                  }

                  updateLocation({
                    coordinates: newCoordinates,
                    locationName: newLocationName
                  })

                  setSearchValue(newLocationName)

                  // Update map to show the selected location
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter(newCoordinates)
                    mapInstanceRef.current.setZoom(14)

                    // Remove existing marker
                    if (markerRef.current) {
                      markerRef.current.setMap(null)
                    }

                    // Add new marker using AdvancedMarkerElement if available
                    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                        position: newCoordinates,
                        map: mapInstanceRef.current,
                        gmpDraggable: true,
                        title: newLocationName
                      })
                    } else {
                      // Fallback to legacy Marker
                      markerRef.current = new window.google.maps.Marker({
                        position: newCoordinates,
                        map: mapInstanceRef.current,
                        draggable: true,
                        title: newLocationName
                      })
                    }

                    // Add drag listener
                    markerRef.current.addListener('dragend', (event) => {
                      let draggedCoordinates
                      if (event.latLng) {
                        // Legacy Marker API
                        draggedCoordinates = {
                          lat: event.latLng.lat(),
                          lng: event.latLng.lng()
                        }
                      } else if (markerRef.current.position) {
                        // AdvancedMarkerElement API
                        draggedCoordinates = {
                          lat: markerRef.current.position.lat,
                          lng: markerRef.current.position.lng
                        }
                      }

                      updateLocation({
                        coordinates: draggedCoordinates,
                        locationName: newLocationName // Keep the search result name
                      })
                    })
                  }
                } else {
                  console.error('Google Maps Places API not available')
                }
              })
            }
          }, 100) // 100ms delay
        })
        .catch(() => {
          console.error('Failed to load Google Maps Places API')
        })
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [isClient])

  // Initialize Map (always shown) — FIXED braces/parentheses here
  useEffect(() => {
    if (isClient && mapRef.current) {
      loadGoogleMapsAPI()
        .then(() => {
          // Add small delay to ensure API is fully ready
          setTimeout(() => {
            if (window.google && window.google.maps) {
              const defaultCenter = coordinates
                ? { lat: coordinates.lat, lng: coordinates.lng }
                : { lat: 51.1784, lng: -115.5708 } // Default to Jasper

              mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: coordinates ? 12 : 6,
                mapTypeId: 'terrain',
                mapId: 'DEMO_MAP_ID' // Required for AdvancedMarkerElement
              })

              // Add existing marker if coordinates exist
              if (coordinates) {
                if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                  markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                    position: coordinates,
                    map: mapInstanceRef.current,
                    gmpDraggable: true,
                    title: locationName || 'Photo location'
                  })
                } else {
                  // Fallback to legacy Marker
                  markerRef.current = new window.google.maps.Marker({
                    position: coordinates,
                    map: mapInstanceRef.current,
                    draggable: true,
                    title: locationName || 'Photo location'
                  })
                }

                // Update coordinates when marker is dragged
                markerRef.current.addListener('dragend', (event) => {
                  let newCoordinates
                  if (event.latLng) {
                    // Legacy Marker API
                    newCoordinates = {
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng()
                    }
                  } else if (markerRef.current.position) {
                    // AdvancedMarkerElement API
                    newCoordinates = {
                      lat: markerRef.current.position.lat,
                      lng: markerRef.current.position.lng
                    }
                  }

                  updateLocation({
                    coordinates: newCoordinates,
                    locationName: locationName // Keep existing name
                  })
                })
              }

              // Add click listener to create/move marker
              mapInstanceRef.current.addListener('click', (event) => {
                const newCoordinates = {
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng()
                }

                // Remove existing marker
                if (markerRef.current) {
                  markerRef.current.setMap(null)
                }

                // Create new marker
                if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                  markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                    position: newCoordinates,
                    map: mapInstanceRef.current,
                    gmpDraggable: true,
                    title: 'Photo location'
                  })
                } else {
                  // Fallback to legacy Marker
                  markerRef.current = new window.google.maps.Marker({
                    position: newCoordinates,
                    map: mapInstanceRef.current,
                    draggable: true,
                    title: 'Photo location'
                  })
                }

                // Add drag listener to new marker
                markerRef.current.addListener('dragend', (dragEvent) => {
                  let draggedCoordinates
                  if (dragEvent.latLng) {
                    // Legacy Marker API
                    draggedCoordinates = {
                      lat: dragEvent.latLng.lat(),
                      lng: dragEvent.latLng.lng()
                    }
                  } else if (markerRef.current.position) {
                    // AdvancedMarkerElement API
                    draggedCoordinates = {
                      lat: markerRef.current.position.lat,
                      lng: markerRef.current.position.lng
                    }
                  }

                  updateLocation({
                    coordinates: draggedCoordinates,
                    locationName: locationName // Keep existing name
                  })
                })

                updateLocation({
                  coordinates: newCoordinates,
                  locationName: locationName // Keep existing name
                })
              })
            }
          }, 100)
        })
        .catch(() => {
          console.error('Failed to load Google Maps')
        })
    }
  }, [isClient])

  const updateLocation = (newLocationData) => {
    props.onChange(
      PatchEvent.from([
        setIfMissing({}),
        set(newLocationData.coordinates, ['coordinates']),
        set(newLocationData.locationName, ['locationName'])
      ])
    )
  }

  const handleGenerateFromCoordinates = async () => {
    if (!isClient || isGenerating || !coordinates) return

    setIsGenerating(true)

    try {
      const baseUrl = process.env.SANITY_STUDIO_WEBSITE_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: coordinates.lat,
          lng: coordinates.lng
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        updateLocation({
          coordinates: coordinates,
          locationName: data.locationName
        })
      } else {
        if (data.error === 'API key restriction error') {
          alert(`API Configuration Issue:\n\n${data.details}\n\nPlease update your Google Cloud Console settings to allow server-side API access.`)
        } else {
          alert(`Error: ${data.error || 'Could not generate location name'}`)
        }
      }
    } catch (error) {
      console.error('Failed to generate location name:', error)
      alert('Failed to connect to location service. Please check your internet connection.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Stack space={4}>
      {/* Search at the top */}
      <Card padding={3} radius={2} tone="primary">
        <Stack space={3}>
          <Text size={1} weight="medium">🔍 Search for a location:</Text>
          {isClient && (
            <TextInput
              ref={inputRef}
              placeholder="Type a place name (e.g., 'Jasper National Park')"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
            />
          )}
          <Text size={1} muted>
            Search above or click/drop pins on the map below
          </Text>
        </Stack>
      </Card>

      {/* Interactive map underneath */}
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
