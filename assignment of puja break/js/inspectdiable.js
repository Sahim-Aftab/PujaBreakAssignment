document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const isInspectorShortcut =
        key === "f12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && key === "u");

    if (isInspectorShortcut) {
        event.preventDefault();
    }
});