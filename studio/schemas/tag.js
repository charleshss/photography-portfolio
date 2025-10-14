// studio/schemas/tag.js
export default {
    name: 'tag',
    title: 'Photo Tags & Keywords',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Tag Name',
            type: 'string',
            description:
                'Create descriptive keywords to help organise and categorise your photos. Type in any case - it will automatically be formatted to Title-Case-With-Hyphens (e.g., "golden hour" becomes "Golden-Hour").',
            placeholder:
                'e.g., "golden hour", "wildlife action" (will become "Golden-Hour", "Wildlife-Action")',
            validation: (Rule) =>
                Rule.required()
                    .min(2)
                    .error('Tag name must be at least 2 characters')
                    .max(30)
                    .error('Tag name should be under 30 characters for best usability')
                    .custom((name) => {
                        // Check for British spelling suggestions
                        const americanBritishPairs = {
                            color: 'colour',
                            favorite: 'favourite',
                            behavior: 'behaviour',
                            center: 'centre',
                            gray: 'grey',
                        }

                        const lowerName = name ? name.toLowerCase() : ''
                        for (const [american, british] of Object.entries(americanBritishPairs)) {
                            if (lowerName.includes(american)) {
                                const suggestion = lowerName.replace(american, british)
                                return `Consider using British spelling: "${suggestion}" instead of "${name}"`
                            }
                        }
                        return true
                    }),
            inputComponent: (props) => {
                const { onChange, value } = props
                const React = require('react')

                const handleChange = (event) => {
                    const inputValue = event.target.value

                    // Convert to Title-Case-With-Hyphens
                    const formatted = inputValue
                        .toLowerCase()
                        // Replace spaces with hyphens
                        .replace(/\s+/g, '-')
                        // Remove any characters that aren't letters, numbers, or hyphens
                        .replace(/[^a-z0-9-]/g, '')
                        // Split by hyphens and capitalize each word
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join('-')
                        // Remove any double hyphens
                        .replace(/--+/g, '-')
                        // Remove leading/trailing hyphens
                        .replace(/^-+|-+$/g, '')

                    onChange(formatted)
                }

                return React.createElement('input', {
                    ...props,
                    type: 'text',
                    value: value || '',
                    onChange: handleChange,
                    placeholder: props.placeholder,
                    style: {
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    },
                })
            },
        },
    ],
    preview: {
        select: {
            title: 'name',
        },
        prepare(selection) {
            const { title } = selection
            return {
                title: title,
                subtitle: 'Photo Tag',
            }
        },
    },
}
