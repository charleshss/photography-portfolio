// studio/schemas/species.js
export default {
    name: 'species',
    title: 'Wildlife Species Database',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Species Common Name',
            type: 'string',
            description:
                'The common name of the wildlife species as it will appear on your website. Type in any case - it will automatically be formatted to Title Case (e.g., "brown bear" becomes "Brown Bear").',
            placeholder:
                'e.g., "red fox", "great blue heron" (will become "Red Fox", "Great Blue Heron")',
            validation: (Rule) =>
                Rule.required()
                    .min(2)
                    .error('Species name must be at least 2 characters')
                    .max(50)
                    .error('Species name should be under 50 characters'),
            inputComponent: (props) => {
                const { onChange, value } = props
                const React = require('react')

                const handleChange = (event) => {
                    const inputValue = event.target.value
                    // Convert to Title Case: capitalize first letter of each word
                    const titleCased = inputValue
                        .toLowerCase()
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')

                    onChange(titleCased)
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
        {
            name: 'category',
            title: 'Species Category',
            type: 'string',
            description:
                'Select the category this species belongs to. This helps organise your wildlife photos and makes them easier to find. Choose the most specific category that applies.',
            options: {
                list: [
                    // ──────────── MAMMALS ────────────
                    { title: 'Big Cats (Lions, Tigers, Leopards, Cougars)', value: 'big-cats' },
                    { title: 'Bears (Brown, Black, Polar, Grizzly)', value: 'bears' },
                    { title: 'Canids (Wolves, Foxes, Coyotes)', value: 'canids' },
                    {
                        title: 'Large Herbivores (Deer, Elk, Moose, Bison)',
                        value: 'large-herbivores',
                    },
                    { title: 'Small Mammals (Squirrels, Rabbits)', value: 'small-mammals' },
                    { title: 'Primates (Monkeys, Apes)', value: 'primates' },
                    { title: 'Marine Mammals (Whales, Seals, Dolphins)', value: 'marine-mammals' },
                    { title: 'Hoofed Animals (Horses, Zebras, Rhinos)', value: 'hoofed-animals' },
                    { title: 'Marsupials (Kangaroos, Koalas, Opossums)', value: 'marsupials' },
                    { title: 'Bats (Flying Mammals)', value: 'bats' },
                    { title: 'Rodents (Mice, Rats, Beavers, Porcupines)', value: 'rodents' },

                    // ──────────── BIRDS ────────────
                    { title: 'Birds of Prey (Eagles, Hawks, Falcons)', value: 'birds-of-prey' },
                    { title: 'Waterfowl (Ducks, Geese, Swans)', value: 'waterfowl' },
                    { title: 'Shorebirds (Sandpipers, Plovers, Herons)', value: 'shorebirds' },
                    { title: 'Songbirds (Finches, Sparrows, Warblers)', value: 'songbirds' },
                    { title: 'Corvids (Ravens, Crows, Jays)', value: 'corvids' },
                    { title: 'Game Birds (Grouse, Pheasants, Quail)', value: 'game-birds' },
                    { title: 'Seabirds (Gulls, Terns, Puffins)', value: 'seabirds' },
                    { title: 'Hummingbirds', value: 'hummingbirds' },
                    { title: 'Woodpeckers', value: 'woodpeckers' },
                    { title: 'Parrots & Cockatoos', value: 'parrots' },
                    { title: 'Owls', value: 'owls' },
                    {
                        title: 'Flightless Birds (Ostriches, Emus, Penguins)',
                        value: 'flightless-birds',
                    },

                    // ──────────── REPTILES & AMPHIBIANS ────────────
                    { title: 'Snakes', value: 'snakes' },
                    { title: 'Lizards', value: 'lizards' },
                    { title: 'Turtles & Tortoises', value: 'turtles' },
                    { title: 'Frogs & Toads', value: 'amphibians' },
                    { title: 'Crocodilians (Alligators, Crocodiles)', value: 'crocodilians' },
                    { title: 'Salamanders & Newts', value: 'salamanders' },

                    // ──────────── AQUATIC LIFE ────────────
                    { title: 'Fish (Freshwater)', value: 'freshwater-fish' },
                    { title: 'Fish (Saltwater)', value: 'saltwater-fish' },
                    { title: 'Sharks & Rays', value: 'sharks-rays' },
                    {
                        title: 'Marine Invertebrates (Octopus, Jellyfish, Crabs)',
                        value: 'marine-invertebrates',
                    },
                    {
                        title: 'Freshwater Invertebrates (Crayfish, Water Insects)',
                        value: 'freshwater-invertebrates',
                    },

                    // ──────────── INSECTS & ARTHROPODS ────────────
                    { title: 'Butterflies & Moths', value: 'butterflies-moths' },
                    { title: 'Dragonflies & Damselflies', value: 'dragonflies' },
                    { title: 'Bees & Wasps', value: 'bees-wasps' },
                    { title: 'Beetles', value: 'beetles' },
                    { title: 'Spiders & Arachnids', value: 'spiders' },
                    { title: 'Ants', value: 'ants' },
                    { title: 'Other Insects', value: 'insects-other' },

                    // ──────────── SPECIALISED CATEGORIES ────────────
                    { title: 'Arctic Wildlife', value: 'arctic-wildlife' },
                    { title: 'Desert Wildlife', value: 'desert-wildlife' },
                    { title: 'Tropical Wildlife', value: 'tropical-wildlife' },
                    { title: 'Nocturnal Animals', value: 'nocturnal' },
                    { title: 'Endangered Species', value: 'endangered' },
                    { title: 'Domestic Animals', value: 'domestic' },
                    { title: 'Other Wildlife', value: 'other' },
                ],
                layout: 'dropdown',
            },
            validation: (Rule) =>
                Rule.required().error('Please select a category to help organise this species'),
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
        },
        prepare(selection) {
            const { title, subtitle } = selection
            const categoryMap = {
                // Mammals
                'big-cats': 'Big Cats',
                bears: 'Bears',
                canids: 'Canids',
                'large-herbivores': 'Large Herbivores',
                'small-mammals': 'Small Mammals',
                primates: 'Primates',
                'marine-mammals': 'Marine Mammals',
                'hoofed-animals': 'Hoofed Animals',
                marsupials: 'Marsupials',
                bats: 'Bats',
                rodents: 'Rodents',

                // Birds
                'birds-of-prey': 'Birds of Prey',
                waterfowl: 'Waterfowl',
                shorebirds: 'Shorebirds',
                songbirds: 'Songbirds',
                corvids: 'Corvids',
                'game-birds': 'Game Birds',
                seabirds: 'Seabirds',
                hummingbirds: 'Hummingbirds',
                woodpeckers: 'Woodpeckers',
                parrots: 'Parrots & Cockatoos',
                owls: 'Owls',
                'flightless-birds': 'Flightless Birds',

                // Reptiles & Amphibians
                snakes: 'Snakes',
                lizards: 'Lizards',
                turtles: 'Turtles & Tortoises',
                amphibians: 'Frogs & Toads',
                crocodilians: 'Crocodilians',
                salamanders: 'Salamanders & Newts',

                // Aquatic Life
                'freshwater-fish': 'Freshwater Fish',
                'saltwater-fish': 'Saltwater Fish',
                'sharks-rays': 'Sharks & Rays',
                'marine-invertebrates': 'Marine Invertebrates',
                'freshwater-invertebrates': 'Freshwater Invertebrates',

                // Insects & Arthropods
                'butterflies-moths': 'Butterflies & Moths',
                dragonflies: 'Dragonflies & Damselflies',
                'bees-wasps': 'Bees & Wasps',
                beetles: 'Beetles',
                spiders: 'Spiders & Arachnids',
                ants: 'Ants',
                'insects-other': 'Other Insects',

                // Specialised Categories
                'arctic-wildlife': 'Arctic Wildlife',
                'desert-wildlife': 'Desert Wildlife',
                'tropical-wildlife': 'Tropical Wildlife',
                nocturnal: 'Nocturnal Animals',
                endangered: 'Endangered Species',
                domestic: 'Domestic Animals',
                other: 'Other Wildlife',
            }

            return {
                title,
                subtitle: subtitle ? categoryMap[subtitle] : 'Uncategorized',
            }
        },
    },
}
