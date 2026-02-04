import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, MessageSquare, Compass } from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { FeedbackCard } from '../components/FeedbackCard';
import { useTranslation } from 'react-i18next';
import { useTracks } from '../hooks/useTracks';
import { fetchReviews, fetchReviewStats, type ReviewRecord } from '../api/reviews';

export function HomePage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'et';
  const { data: tracks, loading, error } = useTracks(lang);

  useEffect(() => {
    if (error) {
      console.error('Error loading tracks:', error);
    }
    if (tracks.length > 0) {
      console.log('Tracks loaded:', tracks.length, tracks.slice(0, 2));
    }
  }, [tracks, error]);

  const [stats, setStats] = useState<{ review_count: number; avg_rating: number | null }>({ review_count: 0, avg_rating: null });
  const [randomFiveStar, setRandomFiveStar] = useState<ReviewRecord[]>([]);

  useEffect(() => {
    fetchReviewStats()
      .then(setStats)
      .catch(() => setStats({ review_count: 0, avg_rating: null }));

    fetchReviews({ rating: 5, random: true, limit: 5 })
      .then(setRandomFiveStar)
      .catch(() => setRandomFiveStar([]));
  }, []);

  const featuredTracks = useMemo(() => {
    const featured = tracks.filter((t) => t.featured).slice(0, 3);
    // Fallback to showing first 3 tracks if no featured tracks
    return featured.length > 0 ? featured : tracks.slice(0, 3);
  }, [tracks]);
  const trackById = useMemo(() => new Map(tracks.map((tr) => [tr.id, tr])), [tracks]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative">
        <div className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6, 78, 59, 0.55), rgba(6, 78, 59, 0.55)), url('/hero.jpg')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl mb-4">{t('home.heroTitle')}</h1>
                <p className="text-white/90 text-lg mb-6">{t('home.heroSubtitle')}</p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <MapPin className="size-5" />
                    {t('home.exploreMap')}
                  </Link>
                  <Link
                    to="/filter"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Compass className="size-5" />
                    {t('home.findYourTrail')}
                  </Link>
                </div>
              </div>

              {/* A small “preview card” to balance the hero like Google-style layouts */}
              <div className="hidden lg:block">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur shadow-sm">
                  <div className="text-xs uppercase tracking-wide text-white/70 mb-3">{t('home.featuredTitle')}</div>
                  {featuredTracks[0] ? (
                    <div className="flex gap-4 items-center">
                      <img
                        src={featuredTracks[0].image ?? `/api/tracks/${encodeURIComponent(featuredTracks[0].id)}/preview.svg`}
                        alt={featuredTracks[0].name}
                        className="w-24 h-24 rounded-xl object-cover border border-white/20"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold leading-snug line-clamp-2">{featuredTracks[0].name}</div>
                        {featuredTracks[0].location && (
                          <div className="mt-1 text-sm text-white/80 line-clamp-1">{featuredTracks[0].location}</div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/80">
                          {typeof featuredTracks[0].avgRating === 'number' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 border border-white/15">
                              <Star className="size-4 fill-current" />
                              {featuredTracks[0].avgRating.toFixed(1)}
                            </span>
                          )}
                          {featuredTracks[0].length != null && (
                            <span className="px-2 py-1 rounded-full bg-white/15 border border-white/15">{featuredTracks[0].length} km</span>
                          )}
                          {featuredTracks[0].difficulty && (
                            <span className="px-2 py-1 rounded-full bg-white/15 border border-white/15">
                              {t(`difficulty.${featuredTracks[0].difficulty}`)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-white/80">{t('app.loading')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 lg:-mt-10 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/95 backdrop-blur rounded-lg border p-5 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">{t('home.statsTrails')}</div>
              <div className="text-3xl">{loading ? '…' : tracks.length}</div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-lg border p-5 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">{t('home.statsReviews')}</div>
              <div className="text-3xl">{stats.review_count}</div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-lg border p-5 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">{t('home.statsAvgRating')}</div>
              <div className="text-3xl flex items-center gap-2">
                <Star className="size-6 text-yellow-500 fill-current" />
                <span>{stats.avg_rating != null ? stats.avg_rating.toFixed(1) : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{t('home.errorLoading')} {error}</p>
          </div>
        )}
        
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl mb-1">{t('home.featuredTitle')}</h2>
            <p className="text-gray-600">{t('home.featuredSubtitle')}</p>
          </div>
          <Link to="/filter" className="text-green-700 hover:underline">
            {t('home.viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-gray-500">{t('app.loading')}</div>
          ) : featuredTracks.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">{t('home.noTracks')}</div>
          ) : (
            featuredTracks.map((track) => (
              <TrackCard key={track.id} track={track} showViewOnMap />
            ))
          )}
        </div>
      </div>

      {/* Random 5-star reviews */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl mb-1">{t('home.recentTitle')}</h2>
              <p className="text-gray-600">{t('home.recentSubtitle')}</p>
            </div>
            <Link to="/feedback" className="text-green-700 hover:underline">
              {t('home.viewAllReviews')}
            </Link>
          </div>

          {randomFiveStar.length === 0 ? (
            <div className="bg-white rounded-lg border p-12 text-center">
              <MessageSquare className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">{t('feedback.noFeedbackTitle')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('feedback.noFeedbackSubtitle')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {randomFiveStar.map((fb) => {
                const track = trackById.get(fb.track_id);
                return (
                  <div key={fb.id}>
                    {track && <div className="mb-2 text-sm text-green-600">{track.name}</div>}
                    <FeedbackCard feedback={fb} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
