'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const FALLBACK_CENTER = { lat: 40.7128, lng: -74.006 };
const MAP_LIBRARIES: ('drawing' | 'geometry' | 'places' | 'visualization')[] = [
  'places',
];

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location | null) => void;
  onRecenter?: (location: Location) => void;
}

export default function LocationMap({
  selectedLocation,
  onLocationSelect,
  onRecenter,
}: LocationMapProps) {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [initialCenter, setInitialCenter] = useState<Location | null>(null);

  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY ??
    '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsApiKey,
    libraries: MAP_LIBRARIES,
    id: 'citypulse-google-maps',
  });

  useEffect(() => {
    if (!isLoaded || initialCenter) {
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setInitialCenter(location);
      onLocationSelect(location);
      if (onRecenter) {
        onRecenter(location);
      }
    };

    const handleError = () => {
      setInitialCenter(FALLBACK_CENTER);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    } else {
      handleError();
    }
  }, [isLoaded, initialCenter, onLocationSelect, onRecenter]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const onClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (typeof lat === 'number' && typeof lng === 'number') {
        const location = { lat, lng };
        onLocationSelect(location);
      }
    },
    [onLocationSelect],
  );

  const handleUseMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onLocationSelect(location);
        if (mapInstance) {
          mapInstance.panTo(location);
          mapInstance.setZoom(16);
        }
        if (onRecenter) {
          onRecenter(location);
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [mapInstance, onLocationSelect, onRecenter]);

  const handleClearSelection = useCallback(() => {
    onLocationSelect(null);
    if (mapInstance) {
      mapInstance.panTo(FALLBACK_CENTER);
      mapInstance.setZoom(12);
    }
  }, [mapInstance, onLocationSelect]);

  const center = useMemo(() => {
    if (selectedLocation) {
      return selectedLocation;
    }
    if (initialCenter) {
      return initialCenter;
    }
    return FALLBACK_CENTER;
  }, [selectedLocation, initialCenter]);

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        We had trouble loading Google Maps. Please check your internet
        connection and try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isLoaded ? (
        <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">
            Warming up the map…
          </p>
        </div>
      ) : (
        <div className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 shadow-inner">
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={center}
            zoom={selectedLocation ? 16 : 12}
            onLoad={onMapLoad}
            onClick={onClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling: 'greedy',
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }],
                },
              ],
            }}
          >
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                draggable
                onDragEnd={(event) => {
                  const lat = event.latLng?.lat();
                  const lng = event.latLng?.lng();
                  if (typeof lat === 'number' && typeof lng === 'number') {
                    onLocationSelect({ lat, lng });
                  }
                }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                }}
              />
            )}
          </GoogleMap>

          <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-white/90 p-3 shadow-md">
            <p className="text-sm font-medium text-gray-700">
              Move the marker or click anywhere on the map to fine-tune the
              spot.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          <i className="ri-crosshair-line text-base" />
          <span>{isLocating ? 'Locating you…' : 'Use my current location'}</span>
        </button>
        <button
          type="button"
          onClick={handleClearSelection}
          className="inline-flex items-center space-x-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:text-gray-900"
        >
          <i className="ri-refresh-line text-base" />
          <span>Reset to default view</span>
        </button>
        {selectedLocation && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
          </span>
        )}
      </div>
    </div>
  );
}
