import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getListings, createListing, updateListing, deleteListing } from '../../api/api';
import ListingFormModal from './ListingFormModal';
import './AdminDashboard.css';

// ── Helpers ────────────────────────────────────────────────────────────────
function getFirstImage(listing) {
  if (Array.isArray(listing.images) && listing.images.length > 0) return listing.images[0];
  if (listing.image) return listing.image;
  return null;
}

// ── Dashboard overview card ────────────────────────────────────────────────
function StatCard({ label, value, sub, onClick, clickable }) {
  return (
    <div className={`stat-card ${clickable ? 'stat-card--clickable' : ''}`} onClick={onClick}>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
      {sub && <p className="stat-card__sub">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // 'dashboard' | 'listings'
  const [view, setView] = useState('dashboard');

  const [modalState, setModalState] = useState({ open: false, mode: 'create', listing: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getListings();
      setListings(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load listings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const flashNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const openCreateModal = () => setModalState({ open: true, mode: 'create', listing: null });
  const openEditModal = (listing) => setModalState({ open: true, mode: 'edit', listing });
  const closeModal = () => setModalState({ open: false, mode: 'create', listing: null });

  const handleSave = async (formData) => {
    if (modalState.mode === 'create') {
      await createListing(formData);
      flashNotice('Listing created successfully.');
    } else {
      await updateListing(modalState.listing.id, formData);
      flashNotice('Listing updated successfully.');
    }
    closeModal();
    loadListings();
  };

  const confirmDelete = (listing) => setDeleteTarget(listing);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteListing(deleteTarget.id);
      flashNotice('Listing deleted.');
      setDeleteTarget(null);
      loadListings();
    } catch (err) {
      setError(err.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────
  const totalListings = listings.length;
  const avgRating = totalListings
    ? (listings.reduce((sum, l) => sum + (Number(l.rating) || 0), 0) / totalListings).toFixed(1)
    : '—';
  const listingsWithImages = listings.filter(
    (l) => (Array.isArray(l.images) && l.images.length > 0) || l.image
  ).length;
  const platformSet = new Set(listings.flatMap((l) => l.platforms || []));

  // ── Views ─────────────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <header className="admin-dashboard__topbar">
        <div className="admin-dashboard__topbar-left">
          <p className="admin-dashboard__eyebrow">Curatd Concepts</p>
          <h1 className="admin-dashboard__title">
            {view === 'dashboard' ? 'Dashboard' : 'Property Listings'}
          </h1>
        </div>
        <div className="admin-dashboard__topbar-actions">
          {view === 'listings' && (
            <button className="btn-outline admin-dashboard__back-btn" onClick={() => setView('dashboard')}>
              ← Dashboard
            </button>
          )}
          <span className="admin-dashboard__admin-name">Signed in as {admin?.username}</span>
          <button className="btn-outline admin-dashboard__logout" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      {/* Notices */}
      {notice && <div className="admin-dashboard__notice">{notice}</div>}
      {error && <div className="admin-dashboard__error">{error}</div>}

      {/* ── DASHBOARD VIEW ── */}
      {view === 'dashboard' && (
        <div className="admin-overview">
          <p className="admin-overview__intro">
            Welcome back, <strong>{admin?.username}</strong>. Here's a snapshot of your property portfolio.
          </p>

          {isLoading ? (
            <p className="admin-dashboard__empty">Loading…</p>
          ) : (
            <>
              <div className="admin-overview__stats">
                <StatCard
                  label="Total Listings"
                  value={totalListings}
                  sub="Click to manage"
                  clickable
                  onClick={() => setView('listings')}
                />
                <StatCard
                  label="Avg. Rating"
                  value={avgRating === '—' ? '—' : `${avgRating} ★`}
                  sub="Across all properties"
                />
                <StatCard
                  label="With Photos"
                  value={listingsWithImages}
                  sub={`of ${totalListings} have images`}
                />
                <StatCard
                  label="Platforms"
                  value={platformSet.size}
                  sub="Booking channels active"
                />
              </div>

              <div className="admin-overview__actions">
                <button className="btn-primary admin-overview__action-btn" onClick={() => { setView('listings'); openCreateModal(); }}>
                  + Add New Listing
                </button>
                <button className="btn-outline admin-overview__action-btn" onClick={() => setView('listings')}>
                  Manage Listings →
                </button>
              </div>

              {totalListings > 0 && (
                <div className="admin-overview__recent">
                  <h3 className="admin-overview__recent-title">Recent Listings</h3>
                  <div className="admin-overview__recent-grid">
                    {listings.slice(0, 3).map((l) => {
                      const img = getFirstImage(l);
                      return (
                        <div key={l.id} className="admin-overview__recent-card" onClick={() => { setView('listings'); openEditModal(l); }}>
                          <div className="admin-overview__recent-img">
                            {img ? (
                              <img src={img} alt={l.name} />
                            ) : (
                              <div className="admin-overview__recent-img--empty">No Image</div>
                            )}
                          </div>
                          <div className="admin-overview__recent-info">
                            <p className="admin-overview__recent-name">{l.name}</p>
                            <p className="admin-overview__recent-loc">📍 {l.location}</p>
                            <p className="admin-overview__recent-price">₹{Number(l.price).toLocaleString('en-IN')} / night</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── LISTINGS TABLE VIEW ── */}
      {view === 'listings' && (
        <>
          <div className="admin-dashboard__toolbar">
            <p className="admin-dashboard__count">
              {isLoading ? 'Loading…' : `${listings.length} listing${listings.length === 1 ? '' : 's'}`}
            </p>
            <button className="btn-primary" onClick={openCreateModal}>
              + Add Listing
            </button>
          </div>

          {isLoading ? (
            <p className="admin-dashboard__empty">Loading listings…</p>
          ) : listings.length === 0 ? (
            <p className="admin-dashboard__empty">No listings yet. Click "Add Listing" to create one.</p>
          ) : (
            <div className="admin-dashboard__table-wrap">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>Images</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Price/night</th>
                    <th>Rating</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => {
                    const firstImg = getFirstImage(listing);
                    const imgCount = Array.isArray(listing.images) ? listing.images.length : (listing.image ? 1 : 0);
                    return (
                      <tr key={listing.id}>
                        <td>
                          <div className="admin-dashboard__thumb-wrap">
                            {firstImg ? (
                              <img className="admin-dashboard__thumb" src={firstImg} alt={listing.name} />
                            ) : (
                              <div className="admin-dashboard__thumb admin-dashboard__thumb--empty">No image</div>
                            )}
                            {imgCount > 1 && (
                              <span className="admin-dashboard__img-count">+{imgCount - 1}</span>
                            )}
                          </div>
                        </td>
                        <td>{listing.name}</td>
                        <td>{listing.type}</td>
                        <td>{listing.location}</td>
                        <td>₹{Number(listing.price).toLocaleString('en-IN')}</td>
                        <td>{listing.rating} ★</td>
                        <td className="admin-dashboard__row-actions">
                          <button className="admin-dashboard__action-btn" onClick={() => openEditModal(listing)}>
                            Edit
                          </button>
                          <button
                            className="admin-dashboard__action-btn admin-dashboard__action-btn--danger"
                            onClick={() => confirmDelete(listing)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Modals ── */}
      {modalState.open && (
        <ListingFormModal
          mode={modalState.mode}
          listing={modalState.listing}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={cancelDelete}>
          <div className="admin-modal admin-modal--small" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">Delete listing?</h2>
            <p className="admin-modal__text">
              This will permanently remove <strong>{deleteTarget.name}</strong> from the site. This
              action cannot be undone.
            </p>
            <div className="admin-modal__actions">
              <button className="btn-outline" onClick={cancelDelete} disabled={isDeleting}>
                Cancel
              </button>
              <button
                className="admin-dashboard__action-btn admin-dashboard__action-btn--danger admin-dashboard__action-btn--solid"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
