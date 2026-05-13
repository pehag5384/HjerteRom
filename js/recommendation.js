/**
 * recommendation.js
 *
 * Denne filen inneholder ALL anbefalings- og sorteringslogikk.
 *
 * Dette er ren forretningslogikk:
 * - Tar inn data
*/

// Minimal recommendation pipeline
// Input: preferences { municipalityId, interests: [] }
//        datasets { activities: [], cities: [], careCenters: [] }
// Output: { city: {...}, activities: [...], careCenters: [...] }

export function recommend(preferences = {}, datasets = {}) {
	const municipalityId = preferences.municipalityId || null;
	const interests = Array.isArray(preferences.interests) ? preferences.interests : [];

	const cities = datasets.cities || [];
	const allActivities = datasets.activities || [];
	const allCareCenters = datasets.careCenters || [];

	// find city object (if available)
	const city = municipalityId ? cities.find(c => c.id === municipalityId) || { id: municipalityId } : null;

	// Simple filter: keep activities in the municipality and matching any interest string
	const activities = allActivities.filter(act => {
		if (!municipalityId || act.municipality_id !== municipalityId) return false;
		if (interests.length === 0) return true;
		const text = (act.category + ' ' + (act.title || '')).toLowerCase();
		return interests.some(i => text.includes(i.toLowerCase()));
	});

	// For now, careCenters is an empty or filtered list (will be populated later)
	const careCenters = allCareCenters.filter(cc => cc.municipality_id === municipalityId);

	return {
		city,
		activities,
		careCenters
	};
}

/*
 * - Returnerer resultater
 *
 * Prinsipper:
 * - Ingen state lagres her
 * - Leser ikke fra DOM
 * - Leser ikke direkte fra globale variabler
 * - Henter ikke data selv
 */

/**
 * Denne filen skal:
 * - Bestemme anbefalt by basert på preferanser og bydata
 * - Rangere og filtrere omsorgssentre
 * - Returnere strukturerte resultater (ikke formatert tekst)
 *
 * Denne filen skal IKKE:
 * - vite hvilken side den brukes på
 * - manipulere HTML
 * - lagre noe i state direkte
 * - bruke Google Maps eller andre API-er
 */

/**
 * Forventet input (konseptuelt):
 * - brukerpreferanser (fra state)
 * - datasett (fra dataService)
 *
 * Forventet output:
 * - objekt(er) med score, prioriteringer og anbefalinger
 *
 * UI-laget bestemmer hvordan dette vises.
 */

/**
 * Tommelfingerregel:
 * Hvis denne filen kunne kjørt i Node uten browser,
 * er ansvaret riktig plassert.
 */
