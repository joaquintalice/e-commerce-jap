const email = document.getElementById('email');
const pw = document.getElementById('pswrd');
const form = document.querySelector('form');
const checkbox = document.getElementById('checkbox-input');




console.log(email)
console.log(pw)
console.log(checkbox)
console.log(form)

form.addEventListener('submit', (e) => {
    e.preventDefault();



    if (!validateUser()) {

        alert('Datos inválidos')
        return;
    }

    window.location.replace("index.html")


});


function validateUser() {

    const storageEmail = localStorage.getItem('email');
    const storagePw = localStorage.getItem('password');

    return storageEmail === email.value && storagePw === pw.value

}