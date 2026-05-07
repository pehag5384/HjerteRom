
let googleMapsLoaderPromise = null;

function loadGoogleMaps(apiKey) {
    if (window.google?.maps) {
        return Promise.resolve(window.google.maps);
    }

    if (!googleMapsLoaderPromise) {
        googleMapsLoaderPromise = new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[data-google-maps]');

            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(window.google.maps), { once: true });
                existingScript.addEventListener('error', () => reject(new Error('Kunne ikke laste Google Maps API.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.dataset.googleMaps = 'true';
            script.async = true;
            script.defer = true;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
            script.addEventListener('load', () => resolve(window.google.maps), { once: true });
            script.addEventListener('error', () => reject(new Error('Kunne ikke laste Google Maps API.')), { once: true });
            document.head.appendChild(script);
        });
    }

    return googleMapsLoaderPromise;
}

function hasValidCoordinates(city) {
    return typeof city?.coordinates?.lat === 'number' && typeof city?.coordinates?.lng === 'number';
}

function buildInfoContent(city) {
    return `
        <div style="min-width: 180px; font-family: Arial, sans-serif; line-height: 1.4;">
            <strong>${city.name}</strong><br />
            <span>${city.county}</span><br />
            <span>${city.coordinates.lat.toFixed(4)}, ${city.coordinates.lng.toFixed(4)}</span>
        </div>
    `;
}

export async function initCitiesMap(container, cities, options = {}) {
    const apiKey = options.apiKey;

    if (!container) {
        throw new Error('Mangler kartcontainer.');
    }

    if (!apiKey) {
        throw new Error('Mangler Google Maps API-nøkkel.');
    }

    const maps = await loadGoogleMaps(apiKey);
    const validCities = Array.isArray(cities) ? cities.filter(hasValidCoordinates) : [];
    const fallbackCenter = options.center ?? { lat: 62.0, lng: 10.0 };
    const map = new maps.Map(container, {
        center: validCities[0]?.coordinates ?? fallbackCenter,
        zoom: options.zoom ?? 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });
    const infoWindow = new maps.InfoWindow();
    const points = [];
    const bounds = new maps.LatLngBounds();

    validCities.forEach((city, index) => {
        const marker = new maps.Marker({
            position: city.coordinates,
            map,
            title: city.name,
            label: String(index + 1)
        });

        marker.addListener('click', () => {
            infoWindow.setContent(buildInfoContent(city));
            infoWindow.open({ map, anchor: marker });
        });

        points.push({ city, marker });
        bounds.extend(city.coordinates);
    });

    if (points.length === 1) {
        map.setCenter(points[0].city.coordinates);
        map.setZoom(options.singleCityZoom ?? 10);
    } else if (points.length > 1) {
        map.fitBounds(bounds);
    }

    return {
        map,
        points,
        infoWindow
    };
}
