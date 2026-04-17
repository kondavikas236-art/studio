
import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kidsyee - Smart Screen Guardian',
    short_name: 'Kidsyee',
    description: 'Protect your child\'s vision and digital wellness with AI-powered habits.',
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
    categories: ['education', 'parenting', 'health'],
    screenshots: [
      {
        src: 'https://picsum.photos/seed/kidsyee-ss1/1080/1920',
        sizes: '1080x1920',
        type: 'image/png',
        label: 'Kidsyee Dashboard'
      }
    ]
  }
}
