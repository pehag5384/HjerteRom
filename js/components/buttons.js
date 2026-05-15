

export function Button({
    label = "",
    variant = "primary",
    icon = "",
    classname=""
}) {

    const classes = {
        primary: "btn-primary-custom",
        secondary: "btn-secondary-custom"
    };

    return `
        <button class="btn ${classes[variant]} ${classname}">

            ${icon ? `<i class="bi ${icon} me-2"></i>` : ""}

            ${label}

        </button>
    `;
}