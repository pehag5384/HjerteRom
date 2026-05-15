//funksjon for kartet i Stedinfo-siden (zoomer inn i byen du trykker på)

// Basiskart-funksjon
export function createMap(elementId, lat, lng, zoom = 12) {
    return new google.maps.Map(document.getElementById(elementId), {
        center: { lat, lng },
        zoom: zoom,
    });
}

// Tegn rute på kartet (renderer)
export function showRoute(map, start, end) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route({
        origin: start,
        destination: end,
        travelMode: "DRIVING",
    }, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            if (result.routes && result.routes[0] && result.routes[0].bounds) {
                map.fitBounds(result.routes[0].bounds);
            }
        }
    });
}

// Legg til markører
export function addMarkers(map, locations) {
    locations.forEach(loc => {
        new google.maps.Marker({
            position: loc,
            map: map,
        });
    });
}

// Beregn rute og returner distanse og varighet som en promise
export function getRouteInfo(map, start, end) {
    return new Promise((resolve, reject) => {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        directionsService.route({
            origin: start,
            destination: end,
            travelMode: "DRIVING",
        }, (result, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(result);
                if (result.routes && result.routes[0] && result.routes[0].bounds) {
                    map.fitBounds(result.routes[0].bounds);
                }
                try {
                    const leg = result.routes[0].legs[0];
                    const distanceMeters = leg.distance.value;
                    const durationSeconds = leg.duration.value;
                    const distanceText = leg.distance.text;
                    const durationText = leg.duration.text;
                    resolve({ distanceMeters, durationSeconds, distanceText, durationText, raw: result });
                } catch (e) {
                    resolve({ distanceMeters: null, durationSeconds: null, distanceText: null, durationText: null, raw: result });
                }
            } else {
                reject(new Error('Directions request failed: ' + status));
            }
        });
    });
}

/**
 * mapService.js
 *
 * Dette er et isolert grensesnitt mot Google Maps API.
 *
 * Hensikt:
 * - Skjule all kompleksitet rundt Google Maps
 * - Gi resten av appen enkle funksjoner å bruke
 *
 * Ingen andre filer enn denne
 * skal snakke direkte med Google Maps.
 */

/**
 * mapService.js skal:
 * - Initialisere kart i et gitt container-element
 * - Vise markører basert på ferdig strukturert data
 * - Beregne avstand og reisetid
 *
 * mapService.js skal ikke:
 * - velge HVA som vises på kartet
 * - lese brukerpreferanser direkte
 * - lagre state
 * - formatere tekst for UI
 * - ta beslutninger
 */

/**
 * Forventet input:
 * - steder med navn, type og koordinater
 *
 * Forventet output:
 * - referanser til kart / beregnet distanse / varighet
 *
 * mapService er en "dum tjeneste":
 * Den gjør kun det den blir bedt om.
 */

/**
 * VIKTIG:
 * Denne filen skal være mulig å bytte ut
 * (Google Maps → annen kartleverandør)
 * uten at resten av appen må endres.
 */
``
