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
                <td><input type="number" id="prodCount${index}" min="1" max="50" value="${count}"></td>
                <td id="subtotal">${currency} ${subtotal}</td>
            `;
        containerArticles.appendChild(row);

        const prodCount = document.getElementById(`prodCount${index}`);

        // Controlador de eventos para actualizar el subtotal según lo que se ingrese en el input prodCount
        prodCount.addEventListener('change', (event) => {
            const newCount = event.target.value;
            const newSubtotal = unitCost * newCount;
            document.getElementById(`subtotal`).innerText = `${currency} ${newSubtotal}`;
        });

        // Establece el valor minimo y maximo del input prodCount e impide que se ingresen letras
        prodCount.addEventListener('input', function (e) {
            let max = parseInt(e.target.max);
            let min = parseInt(e.target.min);
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value > max) {
              e.target.value = max;
            }
            if (e.target.value < min) {
              e.target.value = ``;
            }
          });
          });
        }
