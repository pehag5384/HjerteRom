

export function SearchBar({
    placeholder = "Søk..."
}) {
    return `
        <div class="search-bar">

            <i class="bi bi-search search-icon"></i>

            <input
                type="text"
                class="search-input"
                placeholder="${placeholder}"
            />

        </div>
    `;
}



import { Button } from "./buttons.js";



export function FilterChip({
    label = "",
    active = false
}) {
    return `
        <button
            type="button"
            class="
                filter-chip
                ${active ? "filter-chip-active" : ""}
            "
            data-filter-chip
        >
            ${label}
        </button>
    `;
}



export function FilterSection({
    title = "",
    chips = [],
    boxed = false
}) {
    return `
        <div class="
            filter-section
            mb-4
            ${boxed ? "filter-section-boxed" : ""}
        ">

            <h6 class="mb-3">${title}</h6>

            <div class="d-flex flex-wrap gap-2">
                ${chips.map(chip => FilterChip(chip)).join("")}
            </div>

        </div>
    `;
}



export function FilterPanel() {

    const reviewSection = FilterSection({
        title: "Brukeranmeldelser",
        chips: [
            { label: "1+ stjerner" },
            { label: "2+ stjerner" },
            { label: "3+ stjerner", active: true },
            { label: "4+ stjerner" },
            { label: "5 stjerner" }
        ]
    });

    const healthcareSection = FilterSection({
        title: "Helsehjelp kvalitet",
        chips: [
            { label: "Alle", active: true },
            { label: "Utmerket" },
            { label: "Bra" },
            { label: "Middels" }
        ]
    });

    const facilitySection = FilterSection({
        title: "Viktige fasiliteter",
        chips: [
            { label: "Kultur" },
            { label: "Dagligvarer" },
            { label: "Kollektivtransport" },
            { label: "Sosiale aktiviteter" }
        ]
    });

    const socialSection = FilterSection({
        title: "Sosialt miljø",
        chips: [
            { label: "Alle", active: true },
            { label: "Høy aktivitet" },
            { label: "Middels" },
            { label: "Rolig" }
        ]
    });

    const priceSection = FilterSection({
        title: "Prisnivå",
        chips: [
            { label: "Alle", active: true },
            { label: "Rimelig" },
            { label: "Middels" },
            { label: "Høy" }
        ]
    });



    return `
        <div class="filter-panel">

            <div class="d-flex justify-content-between align-items-center mb-4">

                <div class="d-flex align-items-center">
                    <i class="bi bi-funnel me-2"></i>
                    <h5 class="mb-0">Filter</h5>
                </div>

                <i class="bi bi-x-lg"></i>

            </div>

            ${reviewSection}

            ${healthcareSection}

            ${facilitySection}

            ${socialSection}

            ${priceSection}

            <div class="d-flex gap-3 mt-4">

                <div class="flex-grow-1">
                    ${Button({
                        label: "Nullstill",
                        variant: "secondary",
                        classname: "reset-filters"
                    })}
                </div>

                <div class="flex-grow-1">
                    ${Button({
                        label: "Lagre",
                        variant: "primary"
                    })}
                </div>

            </div>

        </div>
    `;
}