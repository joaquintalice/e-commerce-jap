document.addEventListener("DOMContentLoaded", () => {

    const id = localStorage.getItem("productID")
    const urlComments = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`
    const dataContainer = document.getElementById('data-container');

    getProducts()
    async function getProducts() {

        const storedValue = localStorage.getItem('productID');
        const URL = `https://japceibal.github.io/emercado-api/products/${storedValue}.json`;

        const response = await fetch(URL);

        if (!response.ok) throw new Error(`Code error:${response.status}`);

        const data = await response.json();

        console.log(data)


        showProducts(data);


    }

    function showProducts(objeto) {

        const { id, category, cost, currency, description, name, images, relatedProducts, soldCount } = objeto

        console.log(images)

        const img1 = images[0]

        const img2 = images[1]

        const img3 = images[2]

        const img4 = images[3]

        let template =
            `
                <div class='col-12'>
    
                    <div class="row">
                        <div class="col-12 text-center my-5">
                            <h1>${name}</h1>
                        </div>
                    </div>
    
                    <div class="row">
                        <div class="col-12">
                            <h3>Precio</h3>
                            <p>${cost}</p>        
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
                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-4 my-3">
                            <img src="${img1}" alt="Imagenes representativas de ${name}">
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 my-3">
                            <img src="${img2}" alt="Imagenes representativas de ${name}">
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 my-3">
                            <img src="${img3}" alt="Imagenes representativas de ${name}">
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 my-3">
                            <img src="${img4}" alt="Imagenes representativas de ${name}">
                        </div>
                    </div>
    
                </div>
                `

        dataContainer.innerHTML = template


    }

    async function getComments() {
        const response = await fetch(urlComments);
        if (!response.ok) throw new Error(`Code error:${response.status}`);
        const data = await response.json();
        console.log(data);
        return data;

    }

    async function showComments() {
        const commentsArray = await getComments();
        const comments = document.getElementById('comments');

        const commentScore = (score) => {
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

        let template = ``;
        if (commentsArray.length >= 1) {
            console.log(commentsArray);

            for (let product of commentsArray) {

                template +=
                    `
                <div onclick="setProductID(${product.id})" class="col-12  mt-5">
                    <div class="card cursor-active" >
                        <div class="card-body">
                            <h5 class="card-title">${product.user}</h5>
                            <p>${product.dateTime}</p>
                            <p>${commentScore(product.score)}<p>
                            <p class="card-text">${product.description}</p>
                            
                        </div>
                    </div>
                </div>
            `;
            }
        } else {
            template = `
                    <div class="col-12 mt-5 text-center text-danger">
                            <h5 style="margin-top:2rem;">Se el primero en realizar un comentario:</h5>
                    </div>
            `
        }

        comments.innerHTML = template


    }
    showComments();


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
            let posicion = 0;

            if (elementoActual.length > 0) {
                posicion = arrHTML.indexOf(elementoActual[0]);
                checkHoverStar(posicion);
            }
        }

    })



});



