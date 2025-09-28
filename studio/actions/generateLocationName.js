// Document action to generate location name from coordinates
export function generateLocationNameAction(props) {
    const {draft, published, onComplete} = props
    const doc = draft || published

    // Only show for photos that have coordinates
    if (doc?._type !== 'photo' || !doc?.location?.lat || !doc?.location?.lng) {
        return null
    }

    return {
        label: 'Generate Location Name',
        icon: () => '📍',
        onHandle: async () => {
            try {
                // Use Google Maps Geocoder if available
                if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = {
                        lat: doc.location.lat,
                        lng: doc.location.lng,
                    }

                    geocoder.geocode({location: latlng}, async (results, status) => {
                        if (status === 'OK' && results[0]) {
                            const locationName = results[0].formatted_address

                            // Patch the document
                            await props.patch.execute([
                                {
                                    patch: {
                                        set: {locationName},
                                    },
                                },
                            ])

                            onComplete()
                        } else {
                            console.error('Geocoding failed:', status)
                        }
                    })
                } else {
                    console.error('Google Maps not available')
                }
            } catch (error) {
                console.error('Error generating location name:', error)
            }
        },
    }
}
