/* eslint-env browser */
import { useState, useEffect } from 'react'
import { Card, Stack, Text, Grid, Box, TextInput, Button } from '@sanity/ui'
import { useClient, useFormValue } from 'sanity'
import { set, PatchEvent } from 'sanity'

// Helper functions defined before component
const formatDate = (dateString) => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return dateString
  }
}

export function ExifDisplay(props) {
  const [exifData, setExifData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editableData, setEditableData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const client = useClient({ apiVersion: '2023-01-01' })

  // Use useFormValue to get the entire document
  const document = useFormValue([])
  const imageAsset = useFormValue(['image', 'asset'])
  const currentCameraData = useFormValue(['cameraData']) || {}

  useEffect(() => {
    if (imageAsset?._ref) {
      // Fetch the asset details to get EXIF data
      client
        .fetch('*[_type == "sanity.imageAsset" && _id == $assetId][0]{ metadata }', {
          assetId: imageAsset._ref
        })
        .then((asset) => {
          const exif = asset?.metadata?.exif || null
          setExifData(exif)

          // Only initialize editable data once
          if (exif && !initialized) {
            setEditableData({
              camera: currentCameraData.camera || (exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : exif.Model || exif.Make) || '',
              lens: currentCameraData.lens || exif.LensModel || exif.LensMake || '',
              captureDate: currentCameraData.captureDate || formatDate(exif.DateTimeOriginal || exif.DateTime) || '',
              aperture: currentCameraData.settings?.aperture || (exif.FNumber || exif.ApertureValue ? `f/${exif.FNumber || exif.ApertureValue}` : '') || '',
              shutterSpeed: currentCameraData.settings?.shutterSpeed || (exif.ExposureTime ? (exif.ExposureTime >= 1 ? `${exif.ExposureTime}s` : `1/${Math.round(1/exif.ExposureTime)}s`) : '') || '',
              iso: currentCameraData.settings?.iso || exif.ISO || exif.ISOSpeedRatings || '',
              focalLength: currentCameraData.settings?.focalLength || (exif.FocalLength ? `${exif.FocalLength}mm` : '') || ''
            })
            setInitialized(true)
          }
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching EXIF data:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [imageAsset, client]) // Removed currentCameraData from dependencies

  if (loading) {
    return (
      <Card padding={3} tone="transparent">
        <Text size={1} muted>Loading EXIF data...</Text>
      </Card>
    )
  }

  const handleSave = () => {
    // Save the editable data to the document's cameraData field
    const cameraDataToSave = {
      camera: editableData.camera,
      lens: editableData.lens,
      captureDate: editableData.captureDate,
      settings: {
        aperture: editableData.aperture,
        shutterSpeed: editableData.shutterSpeed,
        iso: editableData.iso ? parseInt(editableData.iso.toString().replace(/\D/g, '')) : null,
        focalLength: editableData.focalLength
      }
    }

    props.onChange(
      PatchEvent.from([
        set(cameraDataToSave, ['cameraData'])
      ])
    )
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original values
    if (exifData) {
      setEditableData({
        camera: currentCameraData.camera || (exifData.Make && exifData.Model ? `${exifData.Make} ${exifData.Model}` : exifData.Model || exifData.Make) || '',
        lens: currentCameraData.lens || exifData.LensModel || exifData.LensMake || '',
        captureDate: currentCameraData.captureDate || formatDate(exifData.DateTimeOriginal || exifData.DateTime) || '',
        aperture: currentCameraData.settings?.aperture || (exifData.FNumber || exifData.ApertureValue ? `f/${exifData.FNumber || exifData.ApertureValue}` : '') || '',
        shutterSpeed: currentCameraData.settings?.shutterSpeed || (exifData.ExposureTime ? (exifData.ExposureTime >= 1 ? `${exifData.ExposureTime}s` : `1/${Math.round(1/exifData.ExposureTime)}s`) : '') || '',
        iso: currentCameraData.settings?.iso || exifData.ISO || exifData.ISOSpeedRatings || '',
        focalLength: currentCameraData.settings?.focalLength || (exifData.FocalLength ? `${exifData.FocalLength}mm` : '') || ''
      })
    }
    setIsEditing(false)
  }

  if (!exifData) {
    return (
      <Card padding={3} tone="caution" border>
        <Stack space={2}>
          <Text size={1} weight="medium">📷 No EXIF Data Available</Text>
          <Text size={1} muted>
            Upload an image with embedded camera data to see automatic EXIF information here.
          </Text>
        </Stack>
      </Card>
    )
  }


  const fields = [
    { key: 'camera', label: '📸 Camera', icon: '📷' },
    { key: 'lens', label: '🔍 Lens', icon: '🔍' },
    { key: 'captureDate', label: '📅 Date Taken', icon: '📅' },
    { key: 'aperture', label: '⚪ Aperture', icon: '⚪' },
    { key: 'shutterSpeed', label: '⚡ Shutter Speed', icon: '⚡' },
    { key: 'iso', label: '🎞️ ISO', icon: '🎞️' },
    { key: 'focalLength', label: '🔭 Focal Length', icon: '🔭' }
  ].filter(field => field.key === 'camera' || editableData[field.key]) // Always show camera field

  return (
    <Card padding={3} tone="positive" border>
      <Stack space={4}>
        <Stack space={2} direction="row" align="center">
          <Text size={1} weight="medium">📷 Camera Data</Text>
          {!isEditing ? (
            <Button
              mode="ghost"
              tone="primary"
              text="✏️ Edit"
              onClick={() => setIsEditing(true)}
              size={0}
            />
          ) : (
            <Stack space={1} direction="row">
              <Button
                mode="ghost"
                tone="positive"
                text="✅ Save"
                onClick={handleSave}
                size={0}
              />
              <Button
                mode="ghost"
                tone="caution"
                text="❌ Cancel"
                onClick={handleCancel}
                size={0}
              />
            </Stack>
          )}
        </Stack>

        {fields.length > 0 ? (
          <Grid columns={[1, 2]} gap={3}>
            {fields.map((field) => (
              <Box key={field.key}>
                <Card padding={2} tone="transparent" border radius={2}>
                  <Stack space={2}>
                    <Text size={0} weight="medium" muted>{field.label}</Text>
                    {isEditing ? (
                      <TextInput
                        value={editableData[field.key] || ''}
                        onChange={(event) => {
                          const value = event.target?.value || event.currentTarget?.value || ''
                          setEditableData(prev => ({
                            ...prev,
                            [field.key]: value
                          }))
                        }}
                        placeholder={`Enter ${field.label.replace(/[^\w\s]/g, '').toLowerCase()}`}
                      />
                    ) : (
                      <Text size={1} weight="medium">
                        {editableData[field.key] || '—'}
                        {currentCameraData[field.key] && (
                          <Text size={0} muted> (edited)</Text>
                        )}
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Box>
            ))}
          </Grid>
        ) : (
          <Text size={1} muted>No camera data found in this image's EXIF information.</Text>
        )}

        <Text size={0} muted>
          💡 Data automatically extracted from your uploaded image. Click "Edit" to make corrections if needed.
        </Text>
      </Stack>
    </Card>
  )
}