document.addEventListener("DOMContentLoaded", main);

const id = localStorage.getItem("productID");
const urlComments = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;

const dataContainer = document.getElementById('data-container');
const relProdContainer = document.getElementById('rel-prod-container');
const commentsContainer = document.getElementById('comments');

function main() {
    getProduct()
    showComments();
    showIndividualComent();
    commentEvents();
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
        const starOption = document.getElementById("starOption");
        const starOptionChildrens = starOption.children;
        let estrellitas = 0;

        for (let i = starOptionChildrens.length - 1; i > 0; i--) {
            if (starOptionChildrens[i].classList.contains("clicked")) {
                estrellitas = starOptionChildrens[i].getAttribute("data-index")
            }
        }

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

async function getProduct() {
    const storedValue = localStorage.getItem('productID');
    const URL = `https://japceibal.github.io/emercado-api/products/${storedValue}.json`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Code error:${response.status}`);
    const data = await response.json();
    showProduct(data);
}

function goToRelProd(id) {
    localStorage.setItem('productID', id);
    location.href = 'product-info.html';
}


function showProduct(objeto) {

    const { category, cost, currency, description, name, images, relatedProducts, soldCount } = objeto

    createTemplate(name, category, cost, currency, description, soldCount, images, relatedProducts).then(() => {
        const cartBtn = document.getElementById(`${name}`);
        cartBtn.addEventListener('click', () => {
            addToCart(objeto)
            alert('Producto agregado al carrito')
        }) 
    });

    async function createTemplate(name, category, cost, currency, description, soldCount, images, relatedProducts) {
        const prodTemplate = `
            <div class='col-12'>

                <div class="row">
                    <div class="col-12 text-center my-4">
                        <h1>${name}</h1>
                    </div>
                </div>
                        
                <div class='row text-center my-4'>
                    <div class='col-6'>
                        <p><i class="bi bi-bookmark"></i> <a style='text-decoration:none; color: gray'  href='categories.html'>Categoría</a> > <a style='text-decoration:none;' class='link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' href='products.html'><br><i class="bi bi-bookmark-fill"></i> ${category}</a></p>
                    </div>
                    <div class='col-6'>
                        <p><i class="bi bi-award"></i> +${soldCount} vendidos</p>
                    </div>
                </div>
                
                <div class='row my-4'>
                    <div class='col-12 text-center'>
                        <h3>${currency} ${cost}</h3>
                    </div>
                </div>

                <div class='row my-4'>
                    <div class='col-12 text-center'>
                        <p><i class="bi bi-info-square-fill"></i> ${description}</p>
                    </div>
                </div>
                
                <div class='row my-4'>
                    <div class='col-12 text-center'>
                        <button class="btn btn-dark" id="${name}"> Añadir al carrito
                            <i class="bi bi-cart-plus-fill"></i>
                        </button>
                    </div>
                </div>

            </div>
            `;

            let relProdTemplate = '';
            for (let prod of relatedProducts) {
                const { id, name, image } = prod
                relProdTemplate +=
                    `
                        <div class='col-12 col-md-6 my-5 cursor-active' onclick='goToRelProd(${id})'>
                            <div class="row">
                                <div class="card product">
                                    <img class="card-img-top" src="${image}" alt="Card image cap">
                                    <div class="card-body">
                                        <h3 class="card-title text-center">${name}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
            }

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

            dataContainer.innerHTML = prodTemplate;
            relProdContainer.innerHTML = relProdTemplate;

            return prodTemplate;
    }

}

async function getComments() {
    const response = await fetch(urlComments);
    if (!response.ok) throw new Error(`Code error:${response.status}`);
    const data = await response.json();
    return data;
}

async function showComments() {
    const commentsArray = await getComments(); // Array de comentarios de la API
    const comment = JSON.parse(localStorage.getItem('comment')) // Array de comentarios del localStorage

    let allComments = commentsArray

    if (comment) {
        const commentsFiltered = comment.filter((element) => element.id == id); // Array de comentarios filtrados por id
        allComments = [...commentsArray, ...commentsFiltered] // Array de todos los comentarios
    }


    let template = ``;
    if (allComments.length >= 1) {

        for (let product of allComments) {
            const { id, user, dateTime, score, description } = product
            const scoreStars = commentScore(score)


            template +=
                `
                <div onclick="setProductID(${id})" class="col-12  mt-5">
                    <div class="card product" >
                        <div class="card-body">
                            <h5 class="card-title"><i class="bi bi-person-circle"></i> ${user}</h5>
                            <p><i class="bi bi-clock"></i> ${dateTime}<p>
                            <p class="card-text">${description}</p>
                            <p class="card-text">${scoreStars}</p>
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

function commentEvents() {
    const starOption = document.getElementById("starOption");
    const starOptionChildrens = starOption.children; // HTMLCollection
    const arrHTML = [...starOptionChildrens]; // Array de HTMLCollection

    const checkHoverStar = (posicion) => {
        for (let i = 0; i <= 5; i++) {
            if (starOptionChildrens[i].classList.contains("checked")) {
                starOptionChildrens[i].classList.remove("checked");
            }
        }

        for (let i = 0; i <= posicion; i++) {
            starOptionChildrens[i].classList.add("checked");
        }
    }

    starOption.addEventListener("mouseover", (e) => {
        // checkea si alguna estrella está clickeada
        let starIsClicked = arrHTML.some(element => element.classList.contains("clicked"));

        if (e.target.nodeName === "SPAN" && !starIsClicked) {
            const spanEstrella = e.target.getAttribute("data-index");
            checkHoverStar(spanEstrella);
        }

    })

    starOption.addEventListener("mouseout", () => {
        // checkea si alguna estrella está clickeada
        let starIsClicked = arrHTML.some(element => element.classList.contains("clicked"));

        if (!starIsClicked) {
            arrHTML.map(element => {
                element.classList.remove("checked")
            })
        }

    })

    starOption.addEventListener("click", (e) => {
        const spanEstrella = e.target;
        if (spanEstrella.nodeName !== "SPAN") return;

        const spanIndice = spanEstrella.getAttribute("data-index");

        for (let i = 0; i <= 5; i++) {
            if (starOptionChildrens[i].classList.contains("clicked")) {
                starOptionChildrens[i].classList.remove("clicked");
            }
        }

        spanEstrella.classList.add("clicked")
        checkHoverStar(spanIndice);
    })
}


function addToCart(producto) {
    const productWithCount = {
        currency: producto.currency,
        id: producto.id,
        image: producto.images[0],
        name: producto.name,
        count: 1,
        unitCost: producto.cost
    }
    console.log(productWithCount)
    const localStorageData = JSON.parse(localStorage.getItem('carrito'));

    if (!localStorageData) {
        localStorage.setItem('carrito', JSON.stringify([productWithCount]));
        return;
    }

    const yaExisteElProducto = localStorageData.some((element) => {
        return producto.id === element.id;
    })


    if (!yaExisteElProducto) {
        localStorage.setItem('carrito', JSON.stringify([...localStorageData, productWithCount]));
        return;
    }

    const productoExistente = localStorageData.find(element => {
        return element.id === producto.id;
    })
    productoExistente.count += 1;

    const filteredArray = localStorageData.filter(elem => {
        return elem.id !== producto.id
    });

    localStorage.removeItem('carrito')
    localStorage.setItem('carrito', JSON.stringify([...filteredArray, productoExistente])); 

}






