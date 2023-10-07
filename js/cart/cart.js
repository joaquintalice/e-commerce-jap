//endpoint https://japceibal.github.io/emercado-api/user_cart/25801.json

document.addEventListener("DOMContentLoaded", () => {
    getCartData().then(res => {
        showCartData(res);
    })
    //getLocalStorageData()
})

async function getCartData() {
    const response = await fetch("https://japceibal.github.io/emercado-api/user_cart/25801.json")
    const data = await response.json();
    return data
}

function showCartData(data) {
    const { articles, user } = data;
    const containerArticles = document.getElementById("data-container");
    const productsStorage = JSON.parse(localStorage.getItem("carrito"));
    console.log(productsStorage)

    const products = (productsStorage) ? [...articles, ...productsStorage] : [...articles]

    products.map((element, index) => {
        const row = document.createElement("tr");

        const { name, count, unitCost, currency, image, images, cost } = element;
        const subtotal = unitCost * count;
        const subtotal2je = cost * count;

        row.innerHTML += `
                <td><img width="120px" src="${image || images[0]}" alt="Image ${name}"/></td>
                <td>${name}</td>
                <td>${currency} ${unitCost || cost}</td>
                <td><input type="number" id="prodCount${index}" min="1" max="100" value="${count}"></td>
                <td id="subtotal${index}">${currency} ${subtotal || subtotal2je}</td>
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
            const newSubtotal = (cost || unitCost) * newCount;

            document.getElementById(`subtotal${index}`).innerText = `${currency} ${newSubtotal}`;
        });

    });

}
