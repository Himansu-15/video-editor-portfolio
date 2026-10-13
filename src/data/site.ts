export const site = {
  name: 'Abhijeet', // DUMMY
  tagline: 'Places, cut into cinema.',
  subline: 'Video Editor: Cuts. Colour. Motion.',
  bio: 'Cinematic video editor specializing in transforming raw footage of places into immersive visual stories. With an eye for rhythm, color, and motion, I craft edits that transport viewers. Every cut serves the narrative. Every grade sets the mood. Every motion graphic elevates the moment.', // DUMMY

  services: [
    {
      id: 'cinematic-cuts',
      title: 'Cinematic Cuts',
      description: 'Precision editing that finds the story in every frame. Rhythmic pacing, seamless transitions, and narrative structure that turns footage into cinema.', // DUMMY
    },
    {
      id: 'color-grading',
      title: 'Color Grading',
      description: 'Cinematic color science that defines mood and atmosphere. From naturalistic enhancement to stylized looks — each grade serves the story.', // DUMMY
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics',
      description: 'Custom motion design that integrates seamlessly with footage. Titles, overlays, and visual elements that elevate without distracting.', // DUMMY
    },
  ],

  software: [
    { name: 'Premiere Pro', level: 'Expert', percent: 95 }, // DUMMY
    { name: 'After Effects', level: 'Advanced', percent: 88 }, // DUMMY
    { name: 'DaVinci Resolve', level: 'Expert', percent: 98 }, // DUMMY
  ],

  aboutNarrative: [
    'When editing footage of places, the camera captures light and geography — but the edit creates emotion. I approach every project by finding the heartbeat of the location: the natural pauses, the rush of movement, and the subtle tonal shifts that immerse the audience.', // DUMMY
    'From commercial travel reels to long-form documentaries, every cut is rhythmically musical, every color grade is atmosphere-defining, and every motion graphic elevates the frame without distraction.', // DUMMY
  ],

  process: [
    {
      step: 1,
      title: 'Ingest and Selects', // DUMMY
      shortCode: 'INGEST',
      description: 'Review raw takes, catalog location sound, and assemble the most striking moments into a selects reel.', // DUMMY
      timecode: '00:00:12:00',
    },
    {
      step: 2,
      title: 'Rough Cut', // DUMMY
      shortCode: 'ROUGH CUT',
      description: 'Establish narrative rhythm, cut to music beats, and build emotional momentum across every transition.', // DUMMY
      timecode: '00:00:26:00',
    },
    {
      step: 3,
      title: 'Color Grade', // DUMMY
      shortCode: 'COLOR',
      description: 'Conform log footage, balance exposure, and sculpt an atmospheric cinematic palette with bespoke show LUTs.', // DUMMY
      timecode: '00:00:40:00',
    },
    {
      step: 4,
      title: 'Motion Graphics', // DUMMY
      shortCode: 'MOTION',
      description: 'Design elegant location tags, subtle kinetic lower thirds, and optical overlays that enhance the world.', // DUMMY
      timecode: '00:00:52:00',
    },
    {
      step: 5,
      title: 'Sound and Export', // DUMMY
      shortCode: 'MASTER',
      description: 'Layer spatial Foley, master dialogue and musical balance, and render uncompressed master cinema deliveries.', // DUMMY
      timecode: '00:01:00:00',
    },
  ],

  testimonials: [
    {
      id: 1,
      quote: 'Abhijeet transformed our travel footage into something that feels like a feature film. The pacing, the color, the emotion — everything landed perfectly.', // DUMMY
      author: 'Sarah Chen', // DUMMY
      role: 'Creative Director, Wanderlust Co.', // DUMMY
    },
    {
      id: 2,
      quote: 'The best color grading I have seen in years. He understands that grade is not a filter — it is a language.', // DUMMY
      author: 'Marcus Webb', // DUMMY
      role: 'DP / Director', // DUMMY
    },
    {
      id: 3,
      quote: 'Motion graphics that actually serve the story. Subtle, elegant, and exactly what the project needed.', // DUMMY
      author: 'Elena Rossi', // DUMMY
      role: 'Brand Strategist, Luma', // DUMMY
    },
  ],

  clients: [
    'Wanderlust Co.', // DUMMY
    'Luma', // DUMMY
    'Aperture Films', // DUMMY
    'Nomad Collective', // DUMMY
    'Horizon Studios', // DUMMY
    'Terra Media', // DUMMY
  ],

  contact: {
    email: 'hello@abhijeet.example', // DUMMY
  },

  social: {
    youtube: 'https://youtube.com/@abhijeet', // DUMMY
    instagram: 'https://instagram.com/abhijeet', // DUMMY
    twitter: 'https://twitter.com/abhijeet', // DUMMY
    linkedin: 'https://linkedin.com/in/abhijeet', // DUMMY
  },

  videos: [
    { id: 'S14dA5Ybuvk', title: 'Cinematic Japan' }, // DUMMY
    { id: 'LsQ_RyC1sLw', title: 'Iceland Dreams' }, // DUMMY
    { id: 'FCfU-iuUDPE', title: 'Morocco Textures' }, // DUMMY
    { id: 'VL3aANLPGNA', title: 'Norway Light' }, // DUMMY
    { id: 'n3dAaPGhiuU', title: 'Bali Rhythms' }, // DUMMY
  ],
} as const