import React, { useState, useRef } from 'react';
import { uploadImages } from '../../api/api';

const TYPE_OPTIONS = ['Villa', 'Homestay', 'Beach Villa', 'Bungalow', 'Luxury Camp', 'Chalet', 'Other'];
const PLATFORM_OPTIONS = ['Airbnb', 'Booking.com', 'Agoda', 'MakeMyTrip'];

function toFormState(listing) {
  // Normalize: support both legacy `image` string and new `images` array
  let images = [];
  if (Array.isArray(listing?.images) && listing.images.length > 0) {
    images = listing.images;
  } else if (listing?.image) {
    images = [listing.image];
  }

  return {
    name: listing?.name || '',
    type: listing?.type || TYPE_OPTIONS[0],
    location: listing?.location || '',
    guests: listing?.guests ?? '',
    bedrooms: listing?.bedrooms ?? '',
    bathrooms: listing?.bathrooms ?? '',
    price: listing?.price ?? '',
    rating: listing?.rating ?? '',
    reviews: listing?.reviews ?? '',
    images,
    imageInput: '',        // current URL being typed in the "add image" box
    amenities: (listing?.amenities || []).join(', '),
    platforms: listing?.platforms || [],
    platformLinks: listing?.platformLinks || {},
    description: listing?.description || '',
  };
}

export default function ListingFormModal({ mode, listing, onClose, onSave }) {
  const [form, setForm] = useState(toFormState(listing));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ── Image list management ──────────────────────────────────────────────
  const addImage = () => {
    const url = form.imageInput.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
      imageInput: '',
    }));
  };

  const handleFilesSelected = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setIsUploading(true);
    try {
      const res = await uploadImages(files);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...(res.urls || [])],
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload image(s).');
    } finally {
      setIsUploading(false);
      // reset so selecting the same file again still fires onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleImageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  // ── Platform toggles & links ───────────────────────────────────────────
  const togglePlatform = (platform) => {
    setForm((prev) => {
      const has = prev.platforms.includes(platform);
      const platforms = has
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];

      // Clean up link if platform is deselected
      const platformLinks = { ...prev.platformLinks };
      if (has) delete platformLinks[platform];

      return { ...prev, platforms, platformLinks };
    });
  };

  const handlePlatformLinkChange = (platform) => (e) => {
    setForm((prev) => ({
      ...prev,
      platformLinks: { ...prev.platformLinks, [platform]: e.target.value },
    }));
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.type || !form.location || !form.price) {
      setError('Name, type, location, and price are required.');
      return;
    }

    const payload = {
      name: form.name,
      type: form.type,
      location: form.location,
      guests: form.guests === '' ? 0 : Number(form.guests),
      bedrooms: form.bedrooms === '' ? 0 : Number(form.bedrooms),
      bathrooms: form.bathrooms === '' ? 0 : Number(form.bathrooms),
      price: Number(form.price),
      rating: form.rating === '' ? 5 : Number(form.rating),
      reviews: form.reviews === '' ? 0 : Number(form.reviews),
      images: form.images,
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      platforms: form.platforms,
      platformLinks: form.platformLinks,
      description: form.description,
    };

    setIsSaving(true);
    try {
      await onSave(payload);
    } catch (err) {
      setError(err.message || 'Failed to save listing.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal__title">{mode === 'create' ? 'Add Listing' : 'Edit Listing'}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">

            {/* Basic fields */}
            <div className="admin-form__field">
              <label>Name *</label>
              <input value={form.name} onChange={handleChange('name')} />
            </div>

            <div className="admin-form__field">
              <label>Type *</label>
              <select value={form.type} onChange={handleChange('type')}>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="admin-form__field admin-form__field--full">
              <label>Location *</label>
              <input value={form.location} onChange={handleChange('location')} placeholder="City, State" />
            </div>

            <div className="admin-form__field">
              <label>Guests</label>
              <input type="number" min="0" value={form.guests} onChange={handleChange('guests')} />
            </div>

            <div className="admin-form__field">
              <label>Bedrooms</label>
              <input type="number" min="0" value={form.bedrooms} onChange={handleChange('bedrooms')} />
            </div>

            <div className="admin-form__field">
              <label>Bathrooms</label>
              <input type="number" min="0" value={form.bathrooms} onChange={handleChange('bathrooms')} />
            </div>

            <div className="admin-form__field">
              <label>Price / night (₹) *</label>
              <input type="number" min="0" value={form.price} onChange={handleChange('price')} />
            </div>

            <div className="admin-form__field">
              <label>Rating</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange('rating')} />
            </div>

            <div className="admin-form__field">
              <label>Reviews count</label>
              <input type="number" min="0" value={form.reviews} onChange={handleChange('reviews')} />
            </div>

            {/* ── Multiple Images ── */}
            <div className="admin-form__field admin-form__field--full">
              <label>Property Images</label>
              <div className="admin-form__image-manager">
                {/* Upload from computer */}
                <div className="admin-form__image-upload-row">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFilesSelected}
                    disabled={isUploading}
                    id="listing-image-upload"
                    className="admin-form__image-file-input"
                  />
                  <label
                    htmlFor="listing-image-upload"
                    className={`btn-primary admin-form__image-upload-btn ${isUploading ? 'is-disabled' : ''}`}
                  >
                    {isUploading ? 'Uploading…' : '⬆ Upload from computer'}
                  </label>
                  <span className="admin-form__image-hint-inline">JPG, PNG, WEBP or GIF — up to 8MB each</span>
                </div>

                {/* Add new image by URL (optional fallback) */}
                <div className="admin-form__image-add-row">
                  <input
                    type="url"
                    value={form.imageInput}
                    onChange={handleChange('imageInput')}
                    onKeyDown={handleImageInputKeyDown}
                    placeholder="Or paste an image URL and press Add (or Enter)"
                    className="admin-form__image-input"
                  />
                  <button type="button" className="btn-outline admin-form__image-add-btn" onClick={addImage}>
                    Add
                  </button>
                </div>

                {/* Image list */}
                {form.images.length > 0 && (
                  <div className="admin-form__image-list">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="admin-form__image-item">
                        <img src={url} alt={`Property ${idx + 1}`} className="admin-form__image-thumb" />
                        <span className="admin-form__image-url" title={url}>{url}</span>
                        {idx === 0 && <span className="admin-form__image-primary-badge">Cover</span>}
                        <button
                          type="button"
                          className="admin-form__image-remove"
                          onClick={() => removeImage(idx)}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {form.images.length === 0 && (
                  <p className="admin-form__image-hint">
                    No images added yet. The first image will be used as the cover photo.
                  </p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="admin-form__field admin-form__field--full">
              <label>Amenities (comma-separated)</label>
              <input
                value={form.amenities}
                onChange={handleChange('amenities')}
                placeholder="Private Pool, WiFi, Parking"
              />
            </div>

            {/* ── Platforms + Links ── */}
            <div className="admin-form__field admin-form__field--full">
              <label>Booking Platforms</label>
              <div className="admin-form__chips">
                {PLATFORM_OPTIONS.map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`admin-form__chip ${form.platforms.includes(p) ? 'admin-form__chip--active' : ''}`}
                    onClick={() => togglePlatform(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Link inputs for selected platforms */}
              {form.platforms.length > 0 && (
                <div className="admin-form__platform-links">
                  {form.platforms.map((p) => (
                    <div key={p} className="admin-form__platform-link-row">
                      <span className="admin-form__platform-name">{p}</span>
                      <input
                        type="url"
                        value={form.platformLinks[p] || ''}
                        onChange={handlePlatformLinkChange(p)}
                        placeholder={`${p} listing URL (optional)`}
                        className="admin-form__platform-link-input"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="admin-form__field admin-form__field--full">
              <label>Description</label>
              <textarea rows={4} value={form.description} onChange={handleChange('description')} />
            </div>
          </div>

          {error && <p className="admin-form__error">{error}</p>}

          <div className="admin-modal__actions">
            <button type="button" className="btn-outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving || isUploading}>
              {isSaving ? 'Saving…' : mode === 'create' ? 'Create Listing' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
