const demoForms = document.querySelectorAll(".demo-form");

demoForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = form.querySelector(".form-message");
        message.textContent = form.dataset.successMessage;
        message.hidden = false;
        message.focus();
    });
});