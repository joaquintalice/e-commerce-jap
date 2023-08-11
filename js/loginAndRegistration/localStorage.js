// Login inputs
const userLogin = document.getElementById('user-login');
const pwLogin = document.getElementById('password-login');

// Register inputs
const userRegister = document.getElementById('user-register');
const emailRegister = document.getElementById('email-register');
const pwRegister = document.getElementById('password-register');
const pwRegisterVerify = document.getElementById('password-verify');

// Obtener los elementos del formulario de registro y login
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');


// Creamos la función que maneja el evento del formulario de registro
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    // Creamos una variable para cada input value para luego asignarlos a un objeto y guardarlo en el localStorage
    const username = userRegister.value;
    const email = emailRegister.value;
    const password = pwRegister.value;
    const passwordVerify = pwRegisterVerify.value;

    // Valida si ya existe el usuario que se quiere registrar
    const storedUser = localStorage.getItem('userData');

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (username === parsedUser.username || email === parsedUser.email) {
            showAlert('danger', 'Ya te encuentras registrado');
            return; // Si el usuario ya existe, no se ejecuta el resto del código
        }
    }

    // Validar que las contraseñas sean iguales
    if (password !== passwordVerify) {
        showAlert('danger', 'Las contraseñas no coinciden');
        return; // Si las contraseñas no coinciden, no se ejecuta el resto del código
    }


    // Registra el usuario en el localStorage en caso de que pase la validación anterior
    const user = {
        username,
        email,
        password
    };

    localStorage.setItem('userData', JSON.stringify(user));

    showAlert('success', 'Usuario registrado exitosamente.', "formRegistro");

    setTimeout(() => {
        window.location.replace("loginAndRegistration.html");
    }, 1500);

});

// Creamos la función que maneja el evento para el formulario de login
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    //Asigna los datos de los input a las variables correspondientes
    const username = userLogin.value;
    const password = pwLogin.value;

    // Obtener el usuario almacenado en localStorage
    const storedUser = localStorage.getItem('userData');

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username === username && parsedUser.password === password) {
            showAlert('success', 'Inicio de sesión exitoso.', "formLogin");
            setTimeout(() => {
                window.location.replace("index.html");
            }, 1500);
            return
        }
        showAlert('danger', 'Usuario o contraseña incorrectos.', "formLogin");
        return;
    }

    showAlert('danger', 'Usuario no encontrado.', "formLogin");

});

function showAlert(typeAlert, message, form) {
    let alert = document.getElementById("alert-message-register")

    if (form === "formLogin") {
        alert = document.getElementById("alert-message-login")
    }
    alert.className = ''; // Quita todas las clases que tenga el elemento, para que no se acumulen
    alert.style.display = 'block';
    alert.classList.add('alert', `alert-${typeAlert}`)
    alert.textContent = message
}
