const slides = document.querySelectorAll('.slider img');
const slider = document.querySelector('.slider');
let currentSlide = 0;

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    const offset = currentSlide * -100;
    slider.style.transform = `translateX(${offset}%)`;
}

setInterval(nextSlide, 4500); // Cambia la imagen cada 3 segundos
