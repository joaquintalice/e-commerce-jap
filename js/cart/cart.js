//endpoint https://japceibal.github.io/emercado-api/user_cart/25801.json

document.addEventListener("DOMContentLoaded", () => {
    getCartData().then(() => {
        showCartData();
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

        const { name, count, unitCost, currency, image } = element;
        const subtotal = unitCost * count;

        row.innerHTML += `
                <td><img width="120px" src="${image}" alt="Image ${name}"/></td>
                <td>${name}</td>
                <td>${currency} ${unitCost}</td>
                <td><input type="number" id="prodCount${index}" min="1" max="100" value="${count}"></td>
                <td id="subtotal${index}">${currency} ${subtotal}</td>
            `;
        containerArticles.appendChild(row);


        // Controlador de eventos para actualizar el subtotal según lo que se ingrese en el input
        document.getElementById(`prodCount${index}`).addEventListener('input', (event) => {
            if (event.target.value < 1) {
                event.target.value = 1;
            }
            if (event.target.value > 1000) {
                event.target.value = 1000;
            }
            let newCount = event.target.value;
            const newSubtotal = (unitCost) * newCount;

            document.getElementById(`subtotal${index}`).innerText = `${currency} ${newSubtotal}`;
        });

    });
}
