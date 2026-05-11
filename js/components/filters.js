

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