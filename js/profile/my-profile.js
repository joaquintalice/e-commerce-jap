document.addEventListener("DOMContentLoaded", () => {
    userProfile();
    userStorageData()
})

// input.addEventListener("change", updateImageDisplay);

function userProfile() {
    const FORM = document.getElementById("user-data");
    let uploadImgSrc = ''
    FORM.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        let userInfo = {
            ...data,
            img: './img/img_perfil.png'
        }

        const lsUserImg = JSON.parse(localStorage.getItem('userImg'));

        if (lsUserImg) {
            userInfo.img = lsUserImg
        }
        if (uploadImgSrc) {
            localStorage.setItem('userImg', JSON.stringify(uploadImgSrc))
            userInfo.img = uploadImgSrc;
        }


        const lsDataLogin = JSON.parse(localStorage.getItem("userData"));
        const userInfoLogin = {
            username: lsDataLogin.username,
            email: userInfo.email,
            password: lsDataLogin.password
        }


        localStorage.setItem("userData", JSON.stringify(userInfoLogin));
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

    })


    // Obten la referencia al input file y al div donde se mostrará la imagen
    const inputFile = document.getElementById("img");
    const imagenDiv = document.getElementById("img-profile");
    const errorDiv = document.getElementById('error-alert')
    // Agrega un evento para detectar el cambio en el input file
    inputFile.addEventListener("change", function (event) {
        const file = event.target.files[0]; // Obtiene el archivo seleccionado

        if (file) {
            const maxSize = 1000000; // Tamaño máximo en bytes (1 MB)

            if (file.size > maxSize) {
                errorDiv.classList.remove('d-none');
                errorDiv.classList.add('d-flex');
                setTimeout(() => {
                    errorDiv.classList.remove('d-flex');
                    errorDiv.classList.add('d-none');
                }, 3000);
                errorDiv.textContent = "El archivo seleccionado es demasiado grande. Por favor, seleccione un archivo más pequeño.";
                inputFile.value = ''; // Limpia el valor del input file
                return;
            }

            // Verifica si se seleccionó un archivo
            const reader = new FileReader();

            reader.onload = function (e) {
                // Cuando se carga la imagen, muestra la vista previa en el div
                const imgElement = document.createElement("img");
                imgElement.style = "object-fit: cover; width:150px; height:100px;"
                imgElement.alt = "Foto de Perfil del Usuario"
                imgElement.src = e.target.result; // Asigna la URL de la imagen

                // Limpia el contenido del div antes de agregar la nueva imagen
                imagenDiv.innerHTML = '';
                imagenDiv.appendChild(imgElement);

                uploadImgSrc = imgElement.src
                // console.log(uploadImgSrc)

            };

            // Lee el archivo como una URL de datos
            reader.readAsDataURL(file);
        } else {
            // Limpiar el div si no se selecciona un archivo
            imagenDiv.innerHTML = '';
        }
    });
}


function userStorageData() {
    const lsData = JSON.parse(localStorage.getItem('userInfo')) || JSON.parse(localStorage.getItem('userData'));
    if (!lsData) return

    const inputUserFirstName = document.getElementById("firstName");

    const inputUserSecondName = document.getElementById("secondName");
    const inputUserLastName = document.getElementById("firstLastName");

    const inputUserSecondLastName = document.getElementById("secondLastName");
    const inputUserEmail = document.getElementById("email");
    const inputUserTel = document.getElementById("tel");

    const Image = document.getElementById("user-img");

    const { email, firstName, firstLastName, img, secondName, tel, secondLastName } = lsData


    Image.src = img ?? "./img/img_perfil.png"
    inputUserFirstName.value = firstName ?? ""
    inputUserSecondName.value = secondName ?? ""
    inputUserLastName.value = firstLastName ?? ""
    inputUserSecondLastName.value = secondLastName ?? ""
    inputUserEmail.value = email ?? ""
    inputUserTel.value = tel ?? ""

}