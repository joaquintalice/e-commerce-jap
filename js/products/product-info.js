document.addEventListener("DOMContentLoaded", main);

const id = localStorage.getItem("productID");
const urlComments = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;
const dataContainer = document.getElementById('data-container');
const commentsContainer = document.getElementById('comments');
let posicion = 0;



function main() {
    getProducts()
    showComments();
    showIndividualComent();
}



function dateTimeNow() {
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}



function getUserUsername() {
    const user = localStorage.getItem('userData');
    const { username } = JSON.parse(user)
    return username
}



function showIndividualComent() {
    const formulario = document.getElementById("review");

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const estrellitas = posicion;
        const comment = document.getElementById("commentary-container").value;

        const username = getUserUsername()
        const currentDateTime = dateTimeNow()


        const review = {
            id: id,
            user: username,
            dateTime: currentDateTime,
            description: comment,
            score: estrellitas
        }

        if (!localStorage.getItem('comment')) {
            localStorage.setItem('comment', JSON.stringify([review]));
        } else {
            let comment = JSON.parse(localStorage.getItem('comment'));
            comment = [...comment, review];
            localStorage.setItem('comment', JSON.stringify(comment));
        }
        showComments();
    })
}




async function getProducts() {
    const storedValue = localStorage.getItem('productID');
    const URL = `https://japceibal.github.io/emercado-api/products/${storedValue}.json`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Code error:${response.status}`);
    const data = await response.json();
    showProducts(data);
}



function showProducts(objeto) {
    const { category, cost, currency, description, name, images, relatedProducts, soldCount } = objeto

    const template =
        `
                <div class='col-12'>
    
                    <div class="row">
                        <div class="col-12">
                            <h3>Precio</h3>
                            <p>${currency} ${cost}</p>        
                        </div>
                        <div class="col-12">
                            <h3>Descripción</h3>
                            <p>${description}</p>    
                        </div>
                        <div class="col-12">
                            <h3>Categoría</h3>
                            <p>${category}</p>
                        </div>
                        <div class="col-12">
                            <h3>Vendidos</h3>
                            <p>${soldCount}</p>
                        </div>
                    </div>
                </div>
                `


    const imgCollection = document.getElementsByClassName('carousel-item'); // Aloja las img para el carousel
    Array.from(imgCollection).forEach((carouselItem, index) => {
        // Imagen dentro de cada .carousel-item
        const img = carouselItem.querySelector('img');

        // Verifica si aún hay elementos en images para asignar
        if (index < images.length) {
            // Asigna el path de la imagen desde el array de imágenes que se desestructuró
            img.src = images[index];
        }
    });


    dataContainer.innerHTML = template
    document.getElementById('title').innerHTML = name; // Le asigna el nombre del producto al h1 con el id 'title' del HTML
}



async function getComments() {
    const response = await fetch(urlComments);
    if (!response.ok) throw new Error(`Code error:${response.status}`);
    const data = await response.json();
    return data;
}



function commentScore(score) {
    let templateStars = ``;

    for (let i = 1; i <= 5; i++) {
        if (i <= score) {
            templateStars += `
                <span class="fa fa-star checked"></span>
                `
        } else {
            templateStars += `
                <span class="fa fa-star"></span>
                `
        }
    }

    return templateStars;
}



async function showComments() {
    const commentsArray = await getComments();
    const comment = JSON.parse(localStorage.getItem('comment'))

    let allComments = commentsArray

    if (comment) {
        const commentsFiltered = comment.filter((element) => element.id == id);
        allComments = [...commentsArray, ...commentsFiltered]
    }


    let template = ``;
    if (allComments.length >= 1) {

        for (let product of allComments) {
            const { id, user, dateTime, score, description } = product
            const scoreStars = commentScore(score)


            template +=
                `
                <div onclick="setProductID(${id})" class="col-12  mt-5">
                    <div class="card" >
                        <div class="card-body">
                            <h5 class="card-title">${user}</h5>
                            <p>${dateTime}</p>
                            <p>${scoreStars}<p>
                            <p class="card-text">${description}</p>
                            
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        template = `
                    <div class="col-12 mt-5 text-center text-danger">
                            <h5 class="my-5">Sé la primer persona en realizar un comentario.</h5>
                    </div>
            `
    }

    commentsContainer.innerHTML = template
}



const starOption = document.getElementById("starOption");
const starOptionChildrens = starOption.children;

const checkHoverStar = (posicion) => {
    for (let i = 0; i <= posicion; i++) {
        starOptionChildrens[i].classList.add("checked");
    }

    starOption.addEventListener("mouseout", (e) => {
        const arrHTML = [...starOptionChildrens];
        arrHTML.map(element => {
            element.classList.remove("checked")
        })
    })

}


starOption.addEventListener("mouseover", (e) => {
    const arrHTML = [...starOptionChildrens];
    if (e.target.nodeName == "SPAN") {
        const elementoActual = arrHTML.filter((element) => element == e.target);

        if (elementoActual.length > 0) {
            posicion = arrHTML.indexOf(elementoActual[0]);
            checkHoverStar(posicion);
        }
    }

})







