//endpoint https://japceibal.github.io/emercado-api/user_cart/25801.json

document.addEventListener("DOMContentLoaded", () => {
    getCartData().then(() => {
        showCartData();
        updateTotalPrice();
    });


})

// Obtiene el producto almacenado en el LocalStorage
async function getCartData() {
    const response = await fetch("https://japceibal.github.io/emercado-api/user_cart/25801.json")
    const data = await response.json();
    const lsData = localStorage.getItem('carrito');
    if (!lsData) {
        localStorage.setItem('carrito', JSON.stringify(data.articles))
    }
    return data
}

// Muestra los productos del carrito
function showCartData() {

    const containerArticles = document.getElementById("data-container");
    const productsStorage = JSON.parse(localStorage.getItem("carrito"));

    productsStorage.map((element, index) => {
        const row = document.createElement("tr");

        const { name, count, unitCost, currency, image, id } = element;
        const subtotal = unitCost * count;
        row.innerHTML += `
                <td><img width="120px" src="${image}" alt="Image ${name}"/></td>
                <td>${name}</td>
                <td>${currency} ${unitCost}</td>
                <td><input type="number" id="${id}" min="1" max="100" value="${count}"></td>
                <td id="subtotal${index}">${currency} ${subtotal}</td>
            `;
        containerArticles.appendChild(row);


        // Controlador de eventos para actualizar el subtotal según lo que se ingrese en el input
        document.getElementById(`${id}`).addEventListener('input', (event) => {

            const productsStorage = JSON.parse(localStorage.getItem("carrito"));

            if (event.target.value < 1) {
                event.target.value = 1;
            }
            if (event.target.value > 1000) {
                event.target.value = 1000;
            }
            let newCount = event.target.value;
            const je = document.getElementById(`${id}`)
            const newSubtotal = (unitCost) * newCount;


            const findProduct = productsStorage.find(element => +element.id === +event.target.id);
            const filteredProds = productsStorage.filter(elem => +elem.id != +event.target.id);

            const prodModified = {
                ...findProduct,
                count: +newCount
            }

            localStorage.setItem('carrito', JSON.stringify([...filteredProds, prodModified]));

            document.getElementById(`subtotal${index}`).innerText = `${currency} ${newSubtotal}`;

            updateTotalPrice();
        });

    });
}


function updateTotalPrice() {
    const subtotalHtml = document.getElementById('subtotal')
    const deliveryCostHtml = document.getElementById('costo-envio')
    const totalHtml = document.getElementById('total')

    const lsData = JSON.parse(localStorage.getItem('carrito'));
    console.log(lsData)
    let subtotal = 0;
    lsData.map(element => {
        subtotal += element.unitCost * element.count
    })

    const selectDelivery = document.getElementById('select-delivery');

    const total = {
        "Premium": subtotal * 1.15,
        "Express": subtotal * 1.07,
        "Standard": subtotal * 1.05
    }

    const deliveryCost = {
        "Premium": subtotal * 0.15,
        "Express": subtotal * 0.07,
        "Standard": subtotal * 0.05
    }

    const totalPrice = deliveryCost[selectDelivery.value];

    subtotalHtml.innerHTML = `USD ${!isNaN(+parseFloat(totalPrice)) ? +parseFloat(totalPrice).toFixed(2) : 0} `
    deliveryCostHtml.innerHTML = `USD ${subtotal} `
    totalHtml.innerHTML = `USD ${parseFloat(total[selectDelivery.value]).toFixed(2) ?? 0} `

    selectDelivery.addEventListener('change', () => {
        updateTotalPrice()
    })


    console.log({ costoEnvio: +parseFloat(totalPrice).toFixed(2) ?? 0 })
    console.log({ Subtotal: subtotal ?? 0 })
    console.log({ Total: total[selectDelivery.value] ?? 0 })
}
