let navbarDiv = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if(document.body.scrollTop > 40 || document.documentElement.scrollTop > 40){
        navbarDiv.classList.add('navbar-cng');
    } else {
        navbarDiv.classList.remove('navbar-cng');
    }
});


const navbarCollapseDiv = document.getElementById('navbar-collapse');
const navbarShowBtn = document.getElementById('navbar-show-btn');
const navbarCloseBtn = document.getElementById('navbar-close-btn');

navbarShowBtn.addEventListener('click', () => {
    navbarCollapseDiv.classList.add('navbar-collapse-rmw');
});

navbarCloseBtn.addEventListener('click', () => {
    navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
});

document.addEventListener('click', (e) => {
    if(e.target.id != "navbar-collapse" && e.target.id != "navbar-show-btn" && e.target.parentElement.id != "navbar-show-btn"){
        navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
    }
});

let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
    }, 400);
});


const galleryItems = document.querySelectorAll('.gallery-item');
const modalBox = document.getElementById('img-modal-box');
const modalImg = document.getElementById('img-modal').querySelector('img');
const closeBtn = document.getElementById('modal-close-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

let currentImageIndex = 0;
let images = [];

galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    images.push(img.src);

    item.addEventListener('click', () => {
        currentImageIndex = index;
        openModal(images[currentImageIndex]);
    });
});

closeBtn.addEventListener('click', closeModal);

nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.src = images[currentImageIndex];
});

prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentImageIndex];
});

function openModal(imageSrc) {
    modalImg.src = imageSrc;
    modalBox.style.display = 'block';
}

function closeModal() {
    modalBox.style.display = 'none';
}