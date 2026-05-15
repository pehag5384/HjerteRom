import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { ActivityCard } from "./components/cards.js";

document.getElementById("header").innerHTML = Header();

document.getElementById("footer").innerHTML = Footer();

document.getElementById("activityAreaName").textContent = "Bergen";

document.getElementById("introAreaName").textContent = "Bergen";

async function loadActivities() {

    try {

        const response = await fetch("./activities.json");

        const data = await response.json();

        const activities = data.activities;

        document.getElementById("activityList").innerHTML =
            activities.map(activity =>

                ActivityCard({
                    title: activity.title,
                    description: activity.description,

                    image:
                        activity.image ||
                        "images/default-activity.jpg"
                })

            ).join("");

    } catch (error) {

        console.error("Kunne ikke hente aktiviteter:", error);

    }
}

loadActivities();



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