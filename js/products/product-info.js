document.addEventListener("DOMContentLoaded", main);

const id = localStorage.getItem("productID");
const urlComments = `http://localhost:3005/products_comments/${id}`;

const dataContainer = document.getElementById('data-container');
const relProdContainer = document.getElementById('rel-prod-container');
const commentsContainer = document.getElementById('comments');

function main() {
    getProduct()

    showIndividualComment();
    commentEvents();

}

function getUserUsername() {
    const user = localStorage.getItem('userData');
    const { username } = JSON.parse(user)
    return username
}

// Muestra los comentarios, agrega la funcionalidad de ponerle puntaje mediante estrellas
function showIndividualComment() {
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
        const dateTime = new Date()

        const review = {
            id: id,
            user: username,
            dateTime: dateTime.toString(),
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
    const URL = `http://localhost:3005/products/${storedValue}`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Code error:${response.status}`);
    const data = await response.json();
    showProduct(data);
}

function goToRelatedProd(id) {
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
        showComments();
    });

    async function createTemplate(name, category, cost, currency, description, soldCount, images, relatedProducts) {
        const USD_COST = currency === 'UYU' ? parseFloat(cost / 39).toFixed(2) : cost
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
                        <h3>USD ${USD_COST}</h3>
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
                        <div class='col-12 col-md-6 my-5 cursor-active' onclick='goToRelatedProd(${id})'>
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
    data.map(element => {
        const dateProduct = new Date();
        const datosFecha = element.dateTime.split(" "); // ["año-mes-dia", "hora:minuto:segundo"]

        const fecha = datosFecha[0].split("-"); // año-mes-dia
        const hora = datosFecha[1].split(":"); // hora:minuto:segundo

        const year = fecha[0]
        const month = fecha[1]
        const day = fecha[2]

        const hours = hora[0];
        const minutes = hora[1];
        const seconds = hora[2];

        dateProduct.setFullYear(year)
        dateProduct.setMonth(month - 1) // de 0 a 11
        dateProduct.setDate(day)

        dateProduct.setHours(hours);
        dateProduct.setMinutes(minutes);
        dateProduct.setSeconds(seconds);

        element.dateTime = dateProduct.toString();
    })

    return data;
}

async function showComments() {
    const commentsArray = await getComments(); // Array de comentarios de la API
    const comment = JSON.parse(localStorage.getItem('comment')) // Array de comentarios del localStorage

    let allComments = [...commentsArray]

    if (comment) {
        const commentsFiltered = comment.filter((element) => element.id == id); // Array de comentarios filtrados por id
        allComments = [...commentsArray, ...commentsFiltered] // Array de todos los comentarios
    }


    let template = ``;
    if (allComments.length >= 1) {
        for (let product of allComments) {
            const { id, user, dateTime, score, description } = product

            const tiempoRelativo = relativeDate(dateTime);

            const scoreStars = commentScore(score)


            template +=
                `
                <div class="col-12  mt-5">
                    <div class="card product" >
                        <div class="card-body">
                            <h5 class="card-title"><i class="bi bi-person-circle"></i> ${user}</h5>
                            <p><i class="bi bi-clock"></i> ${tiempoRelativo}<p>
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
    applyDarkStyles()
}

function relativeDate(dateTime) {
    const rtf2 = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

    const dateNow = new Date();
    const dateProduct = new Date(dateTime);

    const differenceYear = dateProduct.getFullYear() - dateNow.getFullYear();
    const differenceMonth = dateProduct.getMonth() - dateNow.getMonth();
    const differenceDays = dateProduct.getDay() - dateNow.getDay();
    const differenceHours = dateProduct.getHours() - dateNow.getHours();
    const differenceMinutes = dateProduct.getMinutes() - dateNow.getMinutes();
    const differenceSeconds = dateProduct.getSeconds() - dateNow.getSeconds();

    if (differenceYear) {
        return rtf2.format(differenceYear, 'year')
    } else if (differenceMonth) {
        return rtf2.format(differenceMonth, 'month')
    } else if (differenceDays) {
        return rtf2.format(differenceDays, 'day')
    } else if (differenceHours) {
        return rtf2.format(differenceHours, 'hour')
    } else if (differenceMinutes) {
        return rtf2.format(differenceMinutes, 'minute')
    } else {
        return rtf2.format(differenceSeconds, 'second')
    }

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

        for (let i = 1; i <= posicion; i++) {
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

    starOption.addEventListener("mouseout", (e) => {
        // checkea si alguna estrella está clickeada
        let starIsClicked = arrHTML.some(element => element.classList.contains("clicked"));

        if (e.target.nodeName === "SPAN" && !starIsClicked) {
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

// const CART_URL = 'http://localhost:3005/cart';
// const res = await fetch(CART_URL);
// if(!res.ok) return
// const data = await res.json();
// console.log(data)

async function getJWTToken() {
    const TOKEN_URL = 'http://localhost:3005/login';
    try {
        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            body: JSON.stringify({
                username: 'admin',
                password: 'admin'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to retrieve JWT token');
        }

        const data = await res.json();
        console.log({ token: data });
        return data.token;  // Assuming the token is in the 'token' property of the response
    } catch (error) {
        console.error('Error while fetching JWT token:', error);
        throw error;
    }
}

async function saveCartProds(prodList) {
    const CART_URL = 'http://localhost:3005/cart';

    try {
        const token = await getJWTToken();

        const res = await fetch(CART_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': token
            },
            body: JSON.stringify({ products: prodList })
        });

        if (!res.ok) {
            throw new Error('Failed to save cart products');
        }

        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error while saving cart products:', error);
        throw error;
    }
}

// Agrega el producto seleccionado al carrito y si existe, incrementa la cantidad
function addToCart(producto) {
    const productWithCount = {
        currency: producto.currency,
        id: producto.id,
        image: producto.images[0],
        name: producto.name,
        count: 1,
        unitCost: producto.cost
    }
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


    localStorage.setItem('carrito', JSON.stringify([...filteredArray, productoExistente]));
    const prodList = JSON.parse(localStorage.getItem('carrito'));
    console.log(prodList)
    saveCartProds(prodList);

}






