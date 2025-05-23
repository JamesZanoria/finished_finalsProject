const menuIcon = document.getElementById('menuIcon');
const navbar = document.querySelector('.nav_links');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

const sliderImages = document.querySelector('.slider-images');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const slideWidth = 240;
let currentSlide = 0;

nextBtn.addEventListener('click', () => {
    if(currentSlide < sliderImages.children.length - 3){
        currentSlide++;
        updateSlidePosition();
    }
});

prevBtn.addEventListener('click', () => {
    if(currentSlide > 0){
        currentSlide--;
        updateSlidePosition();
    }
});

function updateSlidePosition() {
    sliderImages.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}