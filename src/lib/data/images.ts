export const images = {
  murals: {
    artistPainting: '/images/murals/artist-painting-abstract.webp',
    ikeaWide: '/images/murals/ikea-murals-wide.webp',
    twoMurals: '/images/murals/two-murals-ikea.webp',
    buildingBlocks: '/images/murals/building-blocks-mural.webp'
  },
  team: {
    speakerFemale: '/images/team/speaker-female.webp',
    speakerMale: '/images/team/speaker-male.webp',
    groupPhoto: '/images/team/team-group-photo.webp'
  },
  community: {
    communityPainting: '/images/community/community-painting.webp',
    djShowroom: '/images/community/dj-showroom.webp',
    djPerforming: '/images/community/dj-performing.webp',
    groupPhotoMural: '/images/community/group-photo-mural.webp'
  },
  artTherapy: {
    screenprintDemo: '/images/art-therapy/screenprint-demo.webp',
    screenprintParticipant: '/images/art-therapy/screenprint-participant.webp',
    screenprintArtwork: '/images/art-therapy/screenprint-artwork.webp',
    rockPainting: '/images/art-therapy/rock-painting.webp',
    childPainting: '/images/art-therapy/child-painting.webp',
    girlPaintingMural: '/images/art-therapy/girl-painting-mural.webp'
  }
};

export const heroImages = [
  { src: images.murals.twoMurals, alt: 'Live mural painting at IKEA Art Therapy event' },
  { src: images.community.groupPhotoMural, alt: 'Community group photo with "How Are You Feeling" mural' }
];

export const aboutImages = [
  { src: images.team.speakerFemale, alt: 'Speaker at Art Therapy event' },
  { src: images.team.speakerMale, alt: 'Speaker addressing the community' },
  { src: images.team.groupPhoto, alt: 'Artist Safespaces team and volunteers' }
];

export const artTherapyImages = [
  { src: images.artTherapy.screenprintDemo, alt: 'Screenprinting workshop demonstration' },
  { src: images.artTherapy.screenprintParticipant, alt: 'Community member learning screenprinting' },
  { src: images.artTherapy.childPainting, alt: 'Child participating in community painting' },
  { src: images.artTherapy.girlPaintingMural, alt: 'Young artist painting colorful mural' },
  { src: images.artTherapy.rockPainting, alt: 'Rock painting activity' },
  { src: images.murals.artistPainting, alt: 'Artist creating live mural' }
];

export const galleryImages = [
  { src: images.murals.twoMurals, alt: 'Two large murals at IKEA', category: 'murals' },
  { src: images.murals.buildingBlocks, alt: 'Colorful building blocks mural', category: 'murals' },
  { src: images.murals.ikeaWide, alt: 'Artists painting at IKEA storefront', category: 'murals' },
  { src: images.community.djPerforming, alt: 'DJ performing at event', category: 'community' },
  { src: images.artTherapy.screenprintDemo, alt: 'Screenprinting workshop', category: 'workshop' },
  { src: images.community.groupPhotoMural, alt: 'Community gathering', category: 'community' }
];
