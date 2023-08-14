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
    e.preventDefault(); // Hace que al enviar el formulario, no recargue la pag y se pierdan los datos ingresados

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

    // Guarda el usuario en formato de JSON.
    // Con JSON.stringify convierte el objeto anterior (user) y lo pasa a JSON. De lo contrario, no podría ser guardado en localStorage
    //Va a mostrar la alerta también porque si el código en esta función llega a este punto, quiere decir que todo está correcto y hay data para guardar
    localStorage.setItem('userData', JSON.stringify(user));

    showAlert('success', 'Usuario registrado exitosamente.', "formRegistro");

    setTimeout(() => {
        window.location.replace("loginAndRegistration.html");
    }, 1500);
    // Hace que hayan 1.5 segundos entre el click del botón de submit en el formulario de registro y la ejecución de esa función
    // La cual, se encarga de redirigir al usuario nuevamente al mismo html, pero al recargarse la página, va a volver a aparecer en la parte
    // de login, entonces, le da la sensación de que tocó en registrarse y fue redirigido al apartado de login para que ingrese.
});

// Creamos la función que maneja el evento para el formulario de login
formLogin.addEventListener('submit', (e) => {
    e.preventDefault(); // Hace que al enviar el formulario, no recargue la pag y se pierdan los datos ingresados

    //Asigna los datos de los input a las variables correspondientes
    const username = userLogin.value;
    const password = pwLogin.value;

    // Obtener el usuario almacenado en localStorage
    const storedUser = localStorage.getItem('userData');

    //Si hay algo en el localStorage, va a entrar al if
    if (storedUser) {
        // Los datos JSON del localStorage, los convierte a Objeto nuevamente con JSON.parse(storedUser)
        const parsedUser = JSON.parse(storedUser);
        // Una vez convertidos nuevamente a objetos, comparamos si la contraseña y el usuario ingresados por el usuario
        // son iguales a los que teníamos almacenados en el localStorage
        // Si es el caso, va a tirar la alerta de login exitoso y va a redirigir al index luego de 1.5 segundos
        if (parsedUser.username === username && parsedUser.password === password) {
            showAlert('success', 'Inicio de sesión exitoso.', "formLogin");
            setTimeout(() => {
                window.location.replace("index.html");
            }, 1500);
            return
        }
        // De ser que la contraseña o el usuario sean distintos a los que teníamos en el localStorage, va a tirar la alerta de que los datos están incorrectos
        // Y más nada
        showAlert('danger', 'Usuario o contraseña incorrectos.', "formLogin");
        return;
    }

    // En caso de que el if(storedUser) sea falso, o sea, que no entre a ese if porque no hay ninguna data en el localStorage, va a mostrar esa alerta
    showAlert('danger', 'Usuario no encontrado.', "formLogin");

});

// Función que maneja las alertas
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
