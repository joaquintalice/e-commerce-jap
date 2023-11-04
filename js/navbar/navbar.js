document.addEventListener('DOMContentLoaded', () => {
    let loginLink = document.getElementById("login");
    const localStorageData = localStorage.getItem("userData");

    validateStorageData(localStorageData)
    loginLink.addEventListener("click", showUserMenu);

})

function showUserMenu(e) {
    e.preventDefault();
    const menuLogout = document.getElementById("menuLogout");
    const buttonLogout = document.getElementById("logout");
    menuLogout.classList.toggle("user-logout-d-block");
    buttonLogout.addEventListener("click", deleteUserStorage);
}

function deleteUserStorage(e) {
    e.preventDefault();
    localStorage.removeItem("userData");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userImg");
    window.location = "loginAndRegistration.html" // Al eliminarse el usuario del localStorage, lo redirige al login
}

function validateStorageData(data) {
    let loginLink = document.getElementById("login");

    if (!data) {
        window.location = "loginAndRegistration.html" // Al eliminarse el usuario del localStorage, lo redirige al login
    }

    if (data) {
        const userData = JSON.parse(data);
        const { email } = userData; // Destructuring del objeto userData para obtener el email
        loginLink.textContent = email;
        loginLink.href = "";
    }
}

