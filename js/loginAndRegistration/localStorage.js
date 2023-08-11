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

    // Validar que las contraseñas sean iguales
    if (password !== passwordVerify) {
        alert('Las contraseñas no coinciden.');
        throw new Error(`Las contraseñas no coinciden`);
    }

    // Valida si ya existe el usuario que se quiere registrar
    const storedUser = localStorage.getItem('userData');
    const parsedUser = JSON.parse(storedUser);
    if (username === parsedUser.username || email === parsedUser.email) {
        alert('Ya estás registrado. Puedes iniciar sesión o crear un nuevo usuario para continuar (Eliminará la sesión local del usuario anterior)')
        throw new Error(`No es posible registrarse porque el usuario ya ha sido registrado anteriormente`);
    }

    // Registra el usuario en el localStorage en caso de que pase la validación anterior
    const user = {
        username,
        email,
        password
    };

    localStorage.setItem('userData', JSON.stringify(user));
    alert('Usuario registrado exitosamente.');
    // Redirige al usuario al index.html
    window.location.replace("loginAndRegistration.html");
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
        // Validar usuario y contraseña
        if (parsedUser.username === username && parsedUser.password === password) {
            alert('Inicio de sesión exitoso.');
            window.location.replace("index.html");
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    } else {
        alert('Usuario no encontrado.');
    }
});
