export function getFirstImage(listing) {
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    return listing.images[0];
  }

  if (listing.image) {
    return listing.image;
  }

  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
}