/**
 * app.js
 *
 * Dette er applikasjonens "orkestrator".
 *
 * app.js inneholder:
 * - oppstartslogikk
 * - enkel rute-/sidekontroll
 * - koordinering mellom state, data og UI
 *
 * app.js inneholder IKKE:
 * - avansert forretningslogikk
 * - anbefalingsregler
 * - tegnelogikk for komponenter
 */

import { dataService } from './dataService.js';
import { recommend } from './recommendation.js';
import { appState } from './state.js';

// Midlertidig testflyt (dag 1–2)
// 1) Hardkodet preferanse for én kommune
// 2) Hent aktiviteter fra dataService
// 3) Kjør anbefaling
// 4) Lagre i state og logg resultatet
    export async function runRecommendationTest() {
        const preferences = {
            municipalityId: 'bergen',
            interests: ['kultur', 'trening', 'musikk']
        };

        appState.setPreferences(preferences);

        // Hent aktiviteter og byliste
        const [activitiesData, citiesData, carecentersData] = await Promise.all([
            dataService.fetchData('../data/activities.json'),
            dataService.fetchData('../data/cities.json'),
            dataService.fetchData('../data/carecenters.json')
        ]);

        const activities = activitiesData ? activitiesData.activities : [];
        const cities = citiesData ? citiesData.municipalities : [];
        const careCenters = carecentersData ? carecentersData.care_centers : [];

        const result = recommend(preferences, { activities, cities, careCenters });

        appState.setRecommendation(result);

        console.log('Recommendation result:', result);

        return result;
    }

// Run automatically during development for quick verification
// Remove or guard behind feature-flag later.
runRecommendationTest().catch(err => console.error('Test run failed:', err));

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