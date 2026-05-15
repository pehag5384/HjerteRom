import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { dataService } from './dataService.js';
import { appState } from './state.js';
import * as mapService from './mapService.js';


// Laster Google Maps dynamisk ved runtime fra lokal assets/APIkey.txt
// Trengs flere steder, så må lastes først
async function loadGoogleMapsScriptFromAsset(timeout = 10000) {
    try {
        const resp = await fetch('../assets/APIkey.txt');
        const text = await resp.text();
        const match = text.match(/AIza[0-9A-Za-z\-_]+/);
        const apiKey = match ? match[0] : null;
        if (!apiKey) throw new Error('API key not found in assets/APIkey.txt');

        return await new Promise((resolve, reject) => {
            if (window.google && window.google.maps) return resolve(true);
            const callbackName = '__hjerteromGoogleMapsReady';
            window[callbackName] = () => {
                delete window[callbackName];
                resolve(true);
            };
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                delete window[callbackName];
                reject(new Error('Google Maps failed to load'));
            };
            document.head.appendChild(script);
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    reject(new Error('Google Maps load timed out'));
                }
            }, timeout);
        });
    } catch (err) {
        console.warn('Could not load Google Maps script from asset:', err);
        return false;
    }
}

// Kjør alltid header og footer
document.getElementById("header").innerHTML = Header();
document.getElementById("footer").innerHTML = Footer();

// Finn ut hvilken side vi er på
const page = window.location.pathname;

// ── ACTIVITIES ──────────────────────────────
if (page.includes("activities")) {
    const { ActivityCard } = await import("./components/cards.js");

    document.getElementById("activityAreaName").textContent = "Bergen";
    document.getElementById("introAreaName").textContent = "Bergen";

    try {

        const response = await fetch("../data/activities.json");

        const data = await response.json();
        document.getElementById("activityList").innerHTML =
            data.activities.map(activity =>
                ActivityCard({
                    title: activity.title,
                    description: activity.description,
                    image: activity.image || "images/default-activity.jpg"
                })
            ).join("");
    } catch (error) {
        console.error("Kunne ikke hente aktiviteter:", error);
    }
}

// ── CARECENTER ──────────────────────────────
if (page.includes("carecenter")) {
    const state = appState.getState();
    const municipalityId = state.results?.city?.id || state.preferences?.municipalityId || "bergen";
    const municipality = await dataService.getMunicipalityById(municipalityId);
    const careCenters = await dataService.getCentersByMunicipality(municipalityId);
    const selectedCenterId = state.results?.careCenters?.[0]?.id || careCenters[0]?.id || "sotra-omsorgssenter";
    const center = await dataService.getFullCenterDetails(selectedCenterId);

    document.getElementById("centerName").textContent = center.name;
    document.getElementById("nearestHospital").textContent = center.nearest_hospital;
    document.getElementById("centerAddress").textContent = center.address;
    // Sett midlertidig tekst mens kartet lastes
    document.getElementById("distanceToCenter").textContent = "– km";
    document.getElementById("travelTime").textContent = "–";
    const endPos = center.map_info.coordinates;
    const startPos = municipality?.coordinates || endPos;

    // Forsøk å laste Google Maps dynamisk. Hvis det feiler brukes fallback-data.
    const mapsOk = await loadGoogleMapsScriptFromAsset();
    if (mapsOk) {
        try {
            const map = mapService.createMap('routeMap', startPos.lat, startPos.lng, 12);
            const info = await mapService.getRouteInfo(map, startPos, endPos);
            if (info && info.distanceText) {
                document.getElementById("distanceToCenter").textContent = info.distanceText;
            }
            if (info && info.durationText) {
                document.getElementById("travelTime").textContent = info.durationText;
            }
        } catch (err) {
            console.warn('Kunne ikke hente ruteinfo etter at Maps ble lastet:', err);
            const mapEl = document.getElementById('routeMap');
            if (mapEl) mapEl.style.display = 'none';
            document.getElementById("distanceToCenter").textContent = center.map_info.distance_km + " km";
            document.getElementById("travelTime").textContent = center.map_info.travel_time_min + " min";
        }
    } else {
        // Skjul kartet om det ikke kan lastes for å fjerne feilmelding-UI
        const mapEl = document.getElementById('routeMap');
        if (mapEl) mapEl.style.display = 'none';
        document.getElementById("distanceToCenter").textContent = center.map_info.distance_km + " km";
        document.getElementById("travelTime").textContent = center.map_info.travel_time_min + " min";
    }
    document.getElementById("overallScore").textContent = center.rating_info.scores.overall;
    document.getElementById("facilityScore").textContent = center.rating_info.scores.facilities;
    document.getElementById("satisfactionScore").textContent = center.rating_info.scores.satisfaction;
    document.getElementById("centerDescription").textContent = center.about;

    document.getElementById("serviceList").innerHTML =
        center.services.map(s => `<li>${s}</li>`).join("");

    document.getElementById("openingHours").innerHTML = `
        <p>Mandag - Fredag: ${center.opening_hours.weekday}</p>
        <p>Lørdag - Søndag: ${center.opening_hours.weekend}</p>
        <p><em>${center.opening_hours.note}</em></p>
    `;

    document.getElementById("practicalInfoList").innerHTML = `
        <p>Pris pr. måned: ${center.practical_info.price_per_month} kr</p>
        <p>Ventetid: ${center.quick_info.waiting_time}</p>
        <p>Type omsorg: ${center.practical_info.care_type}</p>
        <p>Antall plasser: ${center.practical_info.room_count}</p>
        <p>Etablert: ${center.practical_info.established_year}</p>
        <p>Måltider: ${center.practical_info.meals}</p>
        <p>Spesialisering: ${center.practical_info.specialization}</p>
    `;

    document.getElementById("reviewList").innerHTML =
        center.rating_info.user_reviews.map(r => `
            <div class="review-card">
                <p><strong>${r.author}</strong></p>
                <p>${r.text}</p>
            </div>
        `).join("");


    const facilityLabels = {
        garden: "Hage/uteplass",
        library: "Bibliotek",
        gym: "Treningsrom",
        wifi: "WiFi",
        pets_allowed: "Kjæledyr tillatt",
        common_room: "Felles stue",
        kitchen: "Kjøkken",
        hairdresser: "Frisør",
        pool: "Svømmebasseng",
        parking: "Parkering",
        elevator: "Heis"
    };

    document.getElementById("facilityList").innerHTML =
        Object.entries(center.facilities)
            .map(([key, value]) => `<div class="facility-item">
                    <span>${value ? "✓" : "✗"}</span>
                    <span>${facilityLabels[key]}</span>
                </div>
            `).join("");
}


if (page.includes("home")) {
    const state = appState.getState();

    // Hilsen og område (hardkodet midlertidig)
    document.getElementById("homegreeting").textContent = "Hei Arild!";
    document.getElementById("currentArea").textContent = "Bergen!";

    // Snarveier
    document.getElementById("shortcutGrid").innerHTML = `
        <div class="feature-card p-3 mb-2">
            <div class="feature-icon"><i class="bi bi-house"></i></div>
            <div>
                <h6>Finn omsorgssentre</h6>
                <p>Se oversikt over omsorgssentere i ditt område.</p>
            </div>
        </div>
        <div class="feature-card p-3 mb-2">
            <div class="feature-icon"><i class="bi bi-arrow-left-right"></i></div>
            <div>
                <h6>Sammenlign tilbud</h6>
                <p>Sammenlign kvalitet, fasiliteter og vurderinger enkelt.</p>
            </div>
        </div>
        <div class="feature-card p-3 mb-2">
            <div class="feature-icon"><i class="bi bi-bus-front"></i></div>
            <div>
                <h6>Transport og aktiviteter</h6>
                <p>Finn aktiviteter, turer og transportmuligheter nær deg.</p>
            </div>
        </div>
        <div class="feature-card p-3 mb-2">
            <div class="feature-icon"><i class="bi bi-geo-alt"></i></div>
            <div>
                <h6>Tjenester nær deg</h6>
                <p>Utforsk tjenester som matbutikk, helsetjenester og mer.</p>
            </div>
        </div>
    `;

    // Populære sentre
    const centers = await dataService.getCentersByMunicipality("bergen");
    document.getElementById("popularCenters").innerHTML =
        centers.slice(0, 2).map(c => `
            <div class="care-card mb-2">
                <img class="care-image w-100" src="${c.image_url}" alt="${c.name}" />
                <div class="p-2">
                    <h6>${c.name}</h6>
                </div>
            </div>
        `).join("");
}

//--- compare----
if (page.includes("compare")) {

    const {
        CareListCard
    } = await import("./components/cards.js");

    const {
        FilterChip
    } = await import("./components/filters.js");

    document.getElementById("careCenterAreaName").textContent =
        "Bergen";

    

    const filters = [
        "Alle",
        "Langtidsopphold",
        "Korttidsopphold",
        "Demensomsorg"
    ];

    document.getElementById("filterTabs").innerHTML =
        filters.map((filter, index) =>

            FilterChip({
                label: filter,
                active: index === 0
            })

        ).join("");



    document.getElementById("sortInfo").innerHTML = `
        <div class="sort-box">
            ⭐ Rangert etter rating
        </div>
    `;



    try {

        const [centerResponse, ratingResponse] =
            await Promise.all([

                fetch("../data/carecenters.json"),

                fetch("../data/ratings.json")

            ]);

        const centerData =
            await centerResponse.json();

        const ratingData =
            await ratingResponse.json();

    

        const sortedCenters = centerData.care_centers

            .filter(center =>
                center.municipality_id === "bergen"
            )

            .map(center => {

                const rating =
                    ratingData.ratings.find(
                        r => r.center_id === center.id
                    );

                return {
                    ...center,

                    averageRating:
                        rating?.average_rating || 0
                };

            })

            .sort((a, b) =>
                b.averageRating - a.averageRating
            );

document.getElementById("careCenterList").innerHTML =

    sortedCenters.map(center =>

        CareListCard({

            name: center.name,

            location: center.location_summary,

            rating: center.averageRating,

            beds: center.quick_info.beds,

            waitTime: center.quick_info.waiting_time,

            tags: center.quick_info.tags

        })

    ).join("");
    } catch (error) {

        console.error(
            "Kunne ikke hente omsorgssentre:",
            error
        );

    }
}

const { HelperCard } =
    await import("./components/cards.js");

const helpers = [

    {
        name: "Chanel",
        phone: "+47 463 73483",
        image: "../images/chanel.jpg"
    },

    {
        name: "Markus",
        phone: "+47 950 45 574",
        image: "../images/markus.jpg"
    },

    {
        name: "Marit",
        phone: "+47 973 45 234",
        image: "../images/marit.jpg"
    }
];

const helperContainer =
    document.getElementById("helperList");

if (helperContainer) {

    helperContainer.innerHTML =

        helpers.map(helper =>
            HelperCard(helper)
        ).join("");
}






/**
 * app.js har ansvar for:
 * - initialisering av applikasjonen
 * - avgjøre hvilken side som vises
 * - kalle riktige moduler i riktig rekkefølge
 *
 * Typisk flyt:
 * 1. Hent state
 * 2. Hvis state mangler → onboarding
 * 3. Hvis state finnes → home
 */

/**
 * app.js skal:
 * - lese fra state
 * - kalle dataService for data
 * - bruke recommendation.js ved behov
 * - trigge rendering via komponenter
 */

/**
 * app.js skal IKKE:
 * - lagre brukerdata direkte
 * - inneholde anbefalingslogikk
 * - manipulere Google Maps direkte
 * - definere HTML-struktur (kun koble til)
 */

/**
 * Forventede ansvarsområder i app.js:
 * - Navigasjon mellom pages
 * - Oppstart etter refresh
 * - Enkel kontrollflyt (if/else basert på state)
 *
 * app.js er bevisst "tynn":
 * Den delegerer ALL logikk videre til riktige moduler.
 */

/**
 * Tommelfingerregel:
 * Hvis app.js begynner å bli komplisert,
 * har for mye ansvar havnet her.
 */