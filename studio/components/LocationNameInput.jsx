import { useState, useEffect, useRef } from 'react'
import { Stack, Button, Card, Text, TextInput, Flex } from '@sanity/ui'
import { useFormValue, PatchEvent, set } from 'sanity'

export function LocationNameInput(props) {
  const documentData = useFormValue([]) // Get the current document
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [mode, setMode] = useState('generate') // 'generate' or 'search'
  const [searchValue, setSearchValue] = useState('')
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load Google Maps API with Places library
  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve()
        return
      }

      const apiKey = process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        reject(new Error('Google Maps API key not configured'))
        return
      }

      const script = globalThis.document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
      script.onload = resolve
      script.onerror = reject
      globalThis.document.head.appendChild(script)
    })
  }

  // Initialize Places Autocomplete
  useEffect(() => {
    if (mode === 'search' && isClient && inputRef.current) {
      loadGoogleMapsAPI().then(() => {
        if (autocompleteRef.current) {
          autocompleteRef.current = null
        }

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['establishment', 'geocode'], // Include businesses and geographic locations
            fields: ['place_id', 'formatted_address', 'name', 'geometry', 'types']
          }
        )

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace()

          if (place.geometry) {
            // Update both location name and coordinates
            const locationName = place.name || place.formatted_address
            const coordinates = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }

            // Update location name field
            props.onChange(PatchEvent.from(set(locationName)))

            // Update coordinates field (need to access the parent document's location field)
            const parentPath = props.path.slice(0, -1) // Remove 'locationName' from path
            const locationPath = [...parentPath, 'location']

            // Trigger update to location coordinates
            // This is a bit tricky in Sanity - we'll need to use a different approach
            // Location selected and processed
            alert(`Location set to: ${locationName}\nCoordinates: ${coordinates.lat}, ${coordinates.lng}\n\nPlease manually set the coordinates in the location field above.`)
          }
        })
      }).catch(() => {
        alert('Failed to load Google Maps Places API')
      })
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [mode, isClient])

  const handleGenerate = () => {
    if (!isClient || isGenerating) return

    if (!documentData?.location?.lat || !documentData?.location?.lng) {
      alert('Please set location coordinates first')
      return
    }

    setIsGenerating(true)

    loadGoogleMapsAPI().then(() => {
      const geocoder = new window.google.maps.Geocoder()
      const latlng = new window.google.maps.LatLng(documentData.location.lat, documentData.location.lng)

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          // Smart selection - prioritise parks and natural areas
          let bestResult = results[0]

          // First look for parks or natural features
          for (const result of results) {
            if (result.types?.includes('park') ||
                result.types?.includes('natural_feature') ||
                result.formatted_address.toLowerCase().includes('national park') ||
                result.formatted_address.toLowerCase().includes('provincial park')) {
              bestResult = result
              break
            }
          }

          // If no park found, look for administrative area level 2 (city/town)
          if (bestResult === results[0]) {
            for (const result of results) {
              if (result.types?.includes('administrative_area_level_2')) {
                bestResult = result
                break
              }
            }
          }

          // Update the location name field
          props.onChange(PatchEvent.from(set(bestResult.formatted_address)))
        } else {
          alert('Could not find location name for these coordinates')
        }
        setIsGenerating(false)
      })
    }).catch(() => {
      alert('Failed to load Google Maps')
      setIsGenerating(false)
    })
  }

  return (
    <Stack space={3}>
      {/* Render the default string input */}
      {props.renderDefault(props)}

      {/* Mode selection */}
      <Card padding={3} radius={2} tone="primary">
        <Stack space={3}>
          <Text size={1} weight="medium">Location Input Options:</Text>
          <Flex gap={2}>
            <Button
              mode={mode === 'generate' ? 'default' : 'ghost'}
              tone={mode === 'generate' ? 'primary' : 'default'}
              text="🗺️ Map → Generate"
              onClick={() => setMode('generate')}
              fontSize={1}
            />
            <Button
              mode={mode === 'search' ? 'default' : 'ghost'}
              tone={mode === 'search' ? 'primary' : 'default'}
              text="🔍 Search Places"
              onClick={() => setMode('search')}
              fontSize={1}
            />
          </Flex>
        </Stack>
      </Card>

      {/* Generate mode */}
      {mode === 'generate' && (
        <Button
          mode="ghost"
          tone="primary"
          text={isGenerating ? "🔄 Generating..." : "🔍 Generate from coordinates"}
          onClick={handleGenerate}
          disabled={!isClient || !documentData?.location?.lat || !documentData?.location?.lng || isGenerating}
        />
      )}

      {/* Search mode */}
      {mode === 'search' && isClient && (
        <Card padding={3} radius={2} tone="caution">
          <Stack space={2}>
            <Text size={1} weight="medium">Search for a place:</Text>
            <TextInput
              ref={inputRef}
              placeholder="Type a place name (e.g., 'Jasper National Park')"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
            />
            <Text size={1} muted>
              Select from dropdown to auto-fill name and coordinates
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}