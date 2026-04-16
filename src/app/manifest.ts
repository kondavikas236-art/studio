
import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kidsyee',
    short_name: 'Kidsyee',
    description: 'The Smart Screen Time Guardian',
    start_url: '/',
    display: 'standalone',
    background_color: '#F0F3F5',
    theme_color: '#2E8AB8',
    icons: [
      {
        src: 'https://picsum.photos/seed/kidsyee-icon-1/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/kidsyee-icon-1/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
