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

function getLocalStorageData() {

}

function showCartData(data) {
    const { articles, user } = data;
    const containerArticles = document.getElementById("data-container");
    console.log("user:" + user);

    articles.map((element, index) => {
        const row = document.createElement("tr");
        const { name, count, unitCost, currency, image } = element;
        const subtotal = unitCost * count;
        row.innerHTML += `
                <td><img width="120px" src="${image}" alt="Image ${name}"/></td>
                <td>${name}</td>
                <td>${currency} ${unitCost}</td>
                <td><input type="number" id="prodCount${index}" min="1" max="100" value="${count}"></td>
                <td id="subtotal">${currency} ${subtotal}</td>
            `;
        containerArticles.appendChild(row);

        // Controlador de eventos para actualizar el subtotal según lo que se ingrese en el input
        document.getElementById(`prodCount${index}`).addEventListener('change', (event) => {
            const newCount = event.target.value;
            const newSubtotal = unitCost * newCount;
            document.getElementById(`subtotal`).innerText = `${currency} ${newSubtotal}`;
        });


    });
}
