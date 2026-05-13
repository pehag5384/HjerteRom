//FOR CITIES-SIDEN
//Her er en funksjon for å hente én spesifikk kommune:

export const dataService = {
    async getMunicipalityById(id) {
        try {
            const response = await fetch('../data/cities.json');
            const data = await response.json();
            // Finner den kommunen som matcher ID-en i URL-en
            return data.municipalities.find(m => m.id === id);
        } catch (error) {
            console.error("Feil ved henting av kommunedata:", error);
        }
    }
};

//OMSORGSSENTER

export const dataService = {
    // Hjelpefunksjon for å laste JSON-filer
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Kunne ikke hente: ${url}`);
            return await response.json();
        } catch (error) {
            console.error("Datafeil:", error);
            return null;
        }
    },

//FOR CITY/CARECENTER-SIDEN
    
    // 1. Henter alle omsorgssentre i en spesifikk kommune
    async getCentersByMunicipality(municipalityId) {
        const data = await this.fetchData('../data/carecenters.json');
        if (!data) return [];
        // Filtrerer slik at vi bare får sentrene som hører til valgt by
        return data.care_centers.filter(center => center.municipality_id === municipalityId);
    },

    // 2. Henter ett spesifikt senter med ALL info (inkludert ratings)
    async getFullCenterDetails(centerId) {
        const [centersData, ratingsData] = await Promise.all([
            this.fetchData('../data/carecenters.json'),
            this.fetchData('../data/ratings.json')
        ]);

        if (!centersData || !ratingsData) return null;

        const center = centersData.care_centers.find(c => c.id === centerId);
        const rating = ratingsData.ratings.find(r => r.center_id === centerId);

        if (!center) return null;

        // Slår sammen dataene til ett objekt
        return {
            ...center,
            rating_info: rating || { average_rating: 0, user_reviews: [], scores: {} }
        };
    },

    // 3. Henter kun anmeldelser for et senter (hvis man trenger det separat)
    async getReviewsForCenter(centerId) {
        const data = await this.fetchData('../data/ratings.json');
        if (!data) return null;
        const rating = data.ratings.find(r => r.center_id === centerId);
        return rating ? rating.user_reviews : [];
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
