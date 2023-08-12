document.addEventListener('DOMContentLoaded', () => {
    let loginLink = document.getElementById("login");
    const localStorageData = localStorage.getItem("userData");

    if (!localStorageData) {
        window.location = "loginAndRegistration.html" // Al eliminarse el usuario del localStorage, lo redirige al login
    }

    if (localStorageData) {
        loginLink.textContent = "Cerrar Sesión"
        loginLink.href = "";
    }

    loginLink.addEventListener("click", deleteUserStorage);

    function deleteUserStorage() {
        localStorage.removeItem("userData");
        window.location = "loginAndRegistration.html" // Al eliminarse el usuario del localStorage, lo redirige al login
    }
})