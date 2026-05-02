import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kidsyee - Smart Screen Guardian',
    short_name: 'Kidsyee',
    description: 'Protect your child\'s vision and digital wellness with AI-powered habits, eye gym missions, and mindful tracking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#1996C5',
    icons: [
      {
        src: 'https://picsum.photos/seed/kidsyee-icon-1/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://picsum.photos/seed/kidsyee-icon-1/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
    orientation: 'portrait',
    scope: '/',
    categories: ['education', 'parenting', 'health', 'productivity'],
    display_override: ['standalone', 'window-controls-overlay'],
    screenshots: [
      {
        src: 'https://picsum.photos/seed/kidsyee-ss-mobile/1080/1920',
        sizes: '1080x1920',
        type: 'image/png',
        label: 'Kidsyee Wellness Dashboard',
        form_factor: 'narrow'
      },
      {
        src: 'https://picsum.photos/seed/kidsyee-ss-tablet/1920/1080',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Parent Control Center',
        form_factor: 'wide'
      }
    ],
    shortcuts: [
      {
        name: 'Eye Gym',
        short_name: 'Gym',
        description: 'Start a vision mission',
        url: '/kid/eye-health',
        icons: [{ src: 'https://picsum.photos/seed/gym-icon/192/192', sizes: '192x192' }]
      },
      {
        name: 'Diary Buddy',
        short_name: 'Diary',
        description: 'Talk to your buddy',
        url: '/kid/diary',
        icons: [{ src: 'https://picsum.photos/seed/diary-icon/192/192', sizes: '192x192' }]
      }
    ]
  }
}
