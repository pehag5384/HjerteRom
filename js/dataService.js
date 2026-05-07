const municipalitiesUrl = new URL('../data/cities.json', import.meta.url);
let municipalitiesPromise = null;

async function loadMunicipalities() {
    if (!municipalitiesPromise) {
        municipalitiesPromise = fetch(municipalitiesUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Kunne ikke hente cities.json (${response.status})`);
                }

                return response.json();
            })
            .then(data => Array.isArray(data.municipalities) ? data.municipalities : []);
    }

    return municipalitiesPromise;
}

export const dataService = {
    async getMunicipalities() {
        try {
            return await loadMunicipalities();
        } catch (error) {
            console.error('Feil ved henting av kommuneliste:', error);
            return [];
        }
    },

    async getMunicipalityById(id) {
        try {
            const municipalities = await loadMunicipalities();
            return municipalities.find(municipality => municipality.id === id);
        } catch (error) {
            console.error('Feil ved henting av kommunedata:', error);
            return undefined;
        }
    }
};

/**
 * dataService.js
 *
 * Dette er det ENESTE stedet i applikasjonen som:
 * - henter data (API eller lokal JSON)
 * - normaliserer datastruktur
 *
 * Resten av appen skal aldri:
 * - hente data direkte fra API
 * - lese JSON-filer direkte
 *
 * Alt går via dataService.
 */

/**
 * dataService skal:
 * - hente bydata
 * - hente aktivitetsdata
 * - hente omsorgssenter-data
 * - prioritere API-data hvis tilgjengelig
 * - bruke lokal JSON som fallback
 */

/**
 * VIKTIG PRINSIPP:
 * dataService returnerer ALLTID samme datastruktur
 * uansett om data kommer fra:
 * - Google Maps
 * - SSB
 * - OpenAI
 * - lokal JSON
 *
 * Dette gjør at resten av appen ikke bryr seg om datakilden.
 */

/**
 * dataService skal IKKE:
 * - filtrere basert på brukerpreferanser
 * - sortere eller rangere data
 * - formatere data for visning
 * - gjøre anbefalinger
 *
 * All slik logikk tilhører recommendation.js eller UI.
 */

/**
 * Forventede datatyper (konseptuelt):
 *
 * City:
 * - id
 * - name
 * - region
 * - coordinates
 * - metadata (kollektiv, kultur, størrelse osv.)
 *
 * Activity:
 * - id
 * - cityId
 * - category
 * - suitabilityTags
 *
 * CareCenter:
 * - id
 * - cityId
 * - coordinates
 * - services
 * - rating (API eller mock)
 */

/**
 * Tommelfingerregel:
 * Hvis du lurer på "hvor kommer denne dataen fra?"
 * → riktig svar er alltid: dataService.
 */
