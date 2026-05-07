

export function PreferenceCard({ title = "", description = "", icon = "" }) {
    return `
        <div class="card border-0 shadow-sm mb-3 preference-card">
            <div class="card-body d-flex align-items-center">

                <div class="preference-icon me-3">
                    <i class="bi ${icon}"></i>
                </div>

                <div>
                    <h6 class="mb-1 fw-semibold">${title}</h6>
                    <p class="mb-0 text-muted small">${description}</p>
                </div>

            </div>
        </div>
    `;
}



export function GridCard({ title = "", icon = "" }) {
    return `
        <div class="card border-0 shadow-sm text-center grid-card h-100">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">

            <div class="grid-icon mb-2">
                <i class="bi ${icon}"></i>
            </div>

            <p class="mb-0 small fw-semibold">${title}</p>

            </div>
        </div>
    `;
}

export function FeatureCard({ title = "", description = "", icon = "" }) {
    return `
        <div class="card border-0 shadow-sm feature-card p-3 h-100">
            <div class="d-flex align-items-start">

                <div class="feature-icon me-3">
                    <i class="bi ${icon}"></i>
                </div>

                <div class="flex-grow-1">
                    <h6 class="fw-semibold mb-1">${title}</h6>
                    <p class="text-muted small mb-2">${description}</p>
                </div>

                <div class="feature-arrow">
                    <i class="bi bi-arrow-right"></i>
                </div>

            </div>
        </div>
    `;
}


export function CareCenterCard({ name = "", image = "" }) {
    return `
        <div class="card border-0 shadow-sm care-card h-100">

            <img src="${image}" class="card-img-top care-image" alt="${name}" />

            <div class="card-body">
                <h6 class="fw-semibold mb-0">${name}</h6>
            </div>
        </div>
    `;
}


export function ActivityCard({ title = "", description = "", image = "" }) {
    return `
        <div class="card border-0 shadow-sm activity-card h-100">

            <img src="${image}" class="activity-image" alt="${title}" />

            <div class="card-body">
                <h6 class="fw-semibold">${title}</h6>
                <p class="text-muted small mb-0">${description}</p>
            </div>

        </div>
    `;
}



export function CareListCard({
    name = "",
    location = "",
    rating = "",
    beds = "",
    waitTime = "",
    tags = []
}) {
    return `
        <div class="card border-0 shadow-sm care-list-card p-3 mb-3">

            <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
                <h6 class="fw-semibold mb-0">${name}</h6>
                <small class="text-muted">${location}</small>
            </div>
            <span class="badge bg-light text-dark">⭐ ${rating}</span>
            </div>

            <div class="d-flex gap-2 mb-2">
                <div class="info-box">
                <small>Senger</small>
                <div class="fw-semibold">${beds}</div>
            </div>

            <div class="info-box flex-grow-1">
                <small>Ventetid</small>
                <div class="fw-semibold">${waitTime}</div>
            </div>
            </div>

            <div class="mb-2">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
        </div>
    `;
}