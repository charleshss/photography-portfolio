// studio/schemas/species.js
export default {
  name: 'species',
  title: 'Wildlife Species',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Species Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Common name of the species (e.g., "Brown Bear", "Bald Eagle")'
    },
    {
      name: 'category',
      title: 'Species Category',
      type: 'string',
      options: {
        list: [
          // ──────────── MAMMALS ────────────
          { title: '🦁 Big Cats (Lions, Tigers, Leopards, Cougars)', value: 'big-cats' },
          { title: '🐻 Bears (Brown, Black, Polar, Grizzly)', value: 'bears' },
          { title: '🐺 Canids (Wolves, Foxes, Coyotes)', value: 'canids' },
          { title: '🦌 Large Herbivores (Deer, Elk, Moose, Bison)', value: 'large-herbivores' },
          { title: '🐿️ Small Mammals (Squirrels, Rabbits)', value: 'small-mammals' },
          { title: '🐒 Primates (Monkeys, Apes)', value: 'primates' },
          { title: '🐋 Marine Mammals (Whales, Seals, Dolphins)', value: 'marine-mammals' },
          { title: '🦓 Hoofed Animals (Horses, Zebras, Rhinos)', value: 'hoofed-animals' },
          { title: '🦘 Marsupials (Kangaroos, Koalas, Opossums)', value: 'marsupials' },
          { title: '🦇 Bats (Flying Mammals)', value: 'bats' },
          { title: '🐭 Rodents (Mice, Rats, Beavers, Porcupines)', value: 'rodents' },

          // ──────────── BIRDS ────────────
          { title: '🦅 Birds of Prey (Eagles, Hawks, Falcons)', value: 'birds-of-prey' },
          { title: '🦆 Waterfowl (Ducks, Geese, Swans)', value: 'waterfowl' },
          { title: '🦢 Shorebirds (Sandpipers, Plovers, Herons)', value: 'shorebirds' },
          { title: '🐦 Songbirds (Finches, Sparrows, Warblers)', value: 'songbirds' },
          { title: '🐦‍⬛ Corvids (Ravens, Crows, Jays)', value: 'corvids' },
          { title: '🦃 Game Birds (Grouse, Pheasants, Quail)', value: 'game-birds' },
          { title: '🐧 Seabirds (Gulls, Terns, Puffins)', value: 'seabirds' },
          { title: '🔴 Hummingbirds', value: 'hummingbirds' },
          { title: '🔨 Woodpeckers', value: 'woodpeckers' },
          { title: '🦜 Parrots & Cockatoos', value: 'parrots' },
          { title: '🦉 Owls', value: 'owls' },
          { title: '🐧 Flightless Birds (Ostriches, Emus, Penguins)', value: 'flightless-birds' },

          // ──────────── REPTILES & AMPHIBIANS ────────────
          { title: '🐍 Snakes', value: 'snakes' },
          { title: '🦎 Lizards', value: 'lizards' },
          { title: '🐢 Turtles & Tortoises', value: 'turtles' },
          { title: '🐸 Frogs & Toads', value: 'amphibians' },
          { title: '🐊 Crocodilians (Alligators, Crocodiles)', value: 'crocodilians' },
          { title: '🦎 Salamanders & Newts', value: 'salamanders' },

          // ──────────── AQUATIC LIFE ────────────
          { title: '🐟 Fish (Freshwater)', value: 'freshwater-fish' },
          { title: '🐠 Fish (Saltwater)', value: 'saltwater-fish' },
          { title: '🦈 Sharks & Rays', value: 'sharks-rays' },
          { title: '🐙 Marine Invertebrates (Octopus, Jellyfish, Crabs)', value: 'marine-invertebrates' },
          { title: '🦐 Freshwater Invertebrates (Crayfish, Water Insects)', value: 'freshwater-invertebrates' },

          // ──────────── INSECTS & ARTHROPODS ────────────
          { title: '🦋 Butterflies & Moths', value: 'butterflies-moths' },
          { title: '🪲 Dragonflies & Damselflies', value: 'dragonflies' },
          { title: '🐝 Bees & Wasps', value: 'bees-wasps' },
          { title: '🪲 Beetles', value: 'beetles' },
          { title: '🕷️ Spiders & Arachnids', value: 'spiders' },
          { title: '🐜 Ants', value: 'ants' },
          { title: '🦗 Other Insects', value: 'insects-other' },

          // ──────────── SPECIALIZED CATEGORIES ────────────
          { title: '🧊 Arctic Wildlife', value: 'arctic-wildlife' },
          { title: '🏜️ Desert Wildlife', value: 'desert-wildlife' },
          { title: '🌴 Tropical Wildlife', value: 'tropical-wildlife' },
          { title: '🌙 Nocturnal Animals', value: 'nocturnal' },
          { title: '⚠️ Endangered Species', value: 'endangered' },
          { title: '🏠 Domestic Animals', value: 'domestic' },
          { title: '❓ Other Wildlife', value: 'other' }
        ],
        layout: 'dropdown'
      },
      description: 'Select the category this species belongs to'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      const categoryMap = {
        // Mammals
        'big-cats': 'Big Cats',
        'bears': 'Bears',
        'canids': 'Canids',
        'large-herbivores': 'Large Herbivores',
        'small-mammals': 'Small Mammals',
        'primates': 'Primates',
        'marine-mammals': 'Marine Mammals',
        'hoofed-animals': 'Hoofed Animals',
        'marsupials': 'Marsupials',
        'bats': 'Bats',
        'rodents': 'Rodents',

        // Birds
        'birds-of-prey': 'Birds of Prey',
        'waterfowl': 'Waterfowl',
        'shorebirds': 'Shorebirds',
        'songbirds': 'Songbirds',
        'corvids': 'Corvids',
        'game-birds': 'Game Birds',
        'seabirds': 'Seabirds',
        'hummingbirds': 'Hummingbirds',
        'woodpeckers': 'Woodpeckers',
        'parrots': 'Parrots & Cockatoos',
        'owls': 'Owls',
        'flightless-birds': 'Flightless Birds',

        // Reptiles & Amphibians
        'snakes': 'Snakes',
        'lizards': 'Lizards',
        'turtles': 'Turtles & Tortoises',
        'amphibians': 'Frogs & Toads',
        'crocodilians': 'Crocodilians',
        'salamanders': 'Salamanders & Newts',

        // Aquatic Life
        'freshwater-fish': 'Freshwater Fish',
        'saltwater-fish': 'Saltwater Fish',
        'sharks-rays': 'Sharks & Rays',
        'marine-invertebrates': 'Marine Invertebrates',
        'freshwater-invertebrates': 'Freshwater Invertebrates',

        // Insects & Arthropods
        'butterflies-moths': 'Butterflies & Moths',
        'dragonflies': 'Dragonflies & Damselflies',
        'bees-wasps': 'Bees & Wasps',
        'beetles': 'Beetles',
        'spiders': 'Spiders & Arachnids',
        'ants': 'Ants',
        'insects-other': 'Other Insects',

        // Specialized Categories
        'arctic-wildlife': 'Arctic Wildlife',
        'desert-wildlife': 'Desert Wildlife',
        'tropical-wildlife': 'Tropical Wildlife',
        'nocturnal': 'Nocturnal Animals',
        'endangered': 'Endangered Species',
        'domestic': 'Domestic Animals',
        'other': 'Other Wildlife'
      }

      return {
        title,
        subtitle: subtitle ? categoryMap[subtitle] : 'Uncategorized'
      }
    }
  }
}