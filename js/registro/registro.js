const email = document.getElementById('email');
const pw1 = document.getElementById('pswrd');
const pw2 = document.getElementById('verify-pswrd');
const form = document.querySelector('form')
const checkbox = document.getElementById('checkbox-input')




console.log(email)
console.log(pw1)
console.log(pw2)
console.log(checkbox)
console.log(form)


form.addEventListener('submit', (e) => {
    e.preventDefault();



    if (!(validarContraseña() && validarCheckbox())) throw new Error(`Las validaciones no pasaron`);

    saveUser();
    alert('Las validaciones pasaron correctamente')
});


function validarCheckbox() {
    return checkbox.checked
}

function validarContraseña() {
    return pw1.value === pw2.value;
}



function saveUser() {


    const currentUser = localStorage.getItem('email');

    if (!currentUser) {
        localStorage.setItem('email', email.value);
        localStorage.setItem('password', pw1.value);
        window.location.replace("login.html");
        return;
    }

    alert('Ya estas registrado')
    window.location.replace("login.html")

}






// window.localStorage.removeItem("turn");

