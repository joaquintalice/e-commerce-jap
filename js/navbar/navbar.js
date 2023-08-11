if (UserIsLogged()) {
    let loginLink = document.getElementById("login");
    loginLink.textContent = "Cerrar Sesión"
    loginLink.href = "";
    loginLink.addEventListener("click", deleteUserStorage);
}

function UserIsLogged() {
    return localStorage.getItem("userData");
}

function deleteUserStorage() {
    localStorage.removeItem("userData");
    window.location = "loginAndRegister.html" // Al eliminarse el usuario del localStorage, lo redirige al login
}