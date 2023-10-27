const learnMoreCopy = document.querySelector('.is--copy-more');
const copySliderDots = document.querySelector('.w-slider-nav');
const learnMoreBackTextEl = document.querySelector('.product__cards-lm-back-text');
const learnMoreTextEl = document.querySelector('.product__cards-lm-text');
var learnMoreCopyWidth = learnMoreCopy.clientWidth;

var remToPixDelta = parseFloat(window.getComputedStyle(document.documentElement, null).getPropertyValue('font-size'))
const distributeElements = () => {
    const slides = document.querySelectorAll('.products__cards-copy-slide');
    // Получаем все дочерние элементы с классом "children"
    const children = document.querySelectorAll('.product__cards-copy-mask p');

    children.forEach(children => {
        slides[0].appendChild(children);
    })
    slides.forEach((element, index) => {
        if (index > 0) {
            element.remove();
        }
    })

}
const redistributionSlides = () => {
    const sliderMask = document.querySelector('.product__cards-copy-mask');
    // Получаем элемент с классом "wrapper"
    const wrapper = document.querySelector('.products__cards-copy-slide');

    // Получаем все дочерние элементы с классом "children"
    const children = document.querySelectorAll('.products__cards-copy-slide p');



    // Вычисляем высоту блока "wrapper"
    const sliderHeight = sliderMask.clientHeight;

    // Вычисляем высоту дочерних элементов и создаем новый блок "wrapper" при необходимости
    let currentWrapper = wrapper;
    let currentHeight = 0;

    children.forEach(child => {
        const childHeight = child.clientHeight;

        // Если текущая высота превышает высоту блока "wrapper", создаем новый блок
        if (currentHeight + childHeight > sliderHeight) {
            currentWrapper = document.createElement('div');
            currentWrapper.classList.add('products__cards-copy-slide', 'w-slide');
            wrapper.parentNode.appendChild(currentWrapper);
            currentHeight = 0;
        }

        // Перемещаем дочерний элемент в текущий блок "wrapper"
        currentWrapper.appendChild(child);
        currentHeight += childHeight;
    });
    copySliderDots.style.left = `${learnMoreCopy.clientWidth / remToPixDelta}rem`;
}

const updateLmButton = () => {
    const preLastChild = copySliderDots.children[copySliderDots.children.length - 2];
    
    if (preLastChild.classList.contains('w-active')) {
        learnMoreCopy.classList.add('is--last');
        learnMoreCopy.style.width = `${(learnMoreBackTextEl.clientWidth - learnMoreTextEl.clientWidth + learnMoreCopy.clientWidth) / remToPixDelta}rem`;
        copySliderDots.style.left = `${(learnMoreBackTextEl.clientWidth - learnMoreTextEl.clientWidth + learnMoreCopy.clientWidth) / remToPixDelta}rem`;
    } else {
        learnMoreCopy.classList.remove('is--last');
        learnMoreCopy.style.width = `${learnMoreCopyWidth / remToPixDelta}rem`;
        copySliderDots.style.left = `${learnMoreCopyWidth / remToPixDelta}rem`;
    }
}

const moveSliderOnMobile = () => {
    const cardsTextSlider = document.querySelector('.product__cards-slider');
    const cardsContainer = document.querySelector('.products__section .container');
    const cardsWrapper = document.querySelector('.product__cards-wrapper');
        
    if (window.innerWidth < 768 && cardsTextSlider.parentNode != cardsContainer) {
        cardsContainer.insertBefore(cardsTextSlider, cardsContainer.firstChild);
    } else if (window.innerWidth > 767 && cardsTextSlider.parentNode == cardsContainer) {
        cardsWrapper.insertBefore(cardsTextSlider, cardsWrapper.firstChild);
    }
}
window.addEventListener('resize', () => {
    moveSliderOnMobile();
    remToPixDelta = parseFloat(window.getComputedStyle(document.documentElement, null).getPropertyValue('font-size'))
    distributeElements();
    redistributionSlides();
    Webflow.require('slider').destroy();
	Webflow.require('slider').ready();
	Webflow.require('slider').redraw();
    updateLmButton();
});
window.addEventListener('load', () => {
    moveSliderOnMobile();
    redistributionSlides();
    Webflow.require('slider').destroy();
	Webflow.require('slider').ready();
	Webflow.require('slider').redraw();
    //updateLmButton();
});
learnMoreCopy.addEventListener('click', () => {
    const preLastChild = copySliderDots.children[copySliderDots.children.length - 2];
    
    if (preLastChild.classList.contains('w-active')) {
        learnMoreCopy.classList.add('is--last');
        learnMoreCopy.style.width = `${(learnMoreBackTextEl.clientWidth - learnMoreTextEl.clientWidth + learnMoreCopy.clientWidth) / remToPixDelta}rem`;
        copySliderDots.style.left = `${(learnMoreBackTextEl.clientWidth - learnMoreTextEl.clientWidth + learnMoreCopy.clientWidth) / remToPixDelta}rem`;
    } else {
        learnMoreCopy.classList.remove('is--last');
        learnMoreCopy.style.width = `${learnMoreCopyWidth / remToPixDelta}rem`;
        copySliderDots.style.left = `${learnMoreCopyWidth / remToPixDelta}rem`;
    }
})

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const cardsTimeline = gsap.timeline();

cardsTimeline
    .fromTo(
        ".product__card.spexigon", {
            className: "product__card spexigon is--active",
            x: 0,
            y: 0,
            scale: 1.01,
            rotation: 0.01,
            opacity: 1,
            zIndex: 10,
            ease: "none"
        }, {
            className: "product__card spexigon",
            x: getPixelTranslate('x'),
            y: getPixelTranslate('y'),
            zIndex: 9,
            scale: 1,
            rotation: 0,
            opacity: 0.33,
            ease: "none"
        }
    )
    .fromTo(
        ".product__card.spexigeo", {
            className: "product__card spexigeo",
            x: getPixelTranslate('x'),
            y: getPixelTranslate('y'),
            opacity: 0.33,
            rotation: 0,
            zIndex: 9,
            scale: 1,
            ease: "none"
        }, {
            className: "product__card spexigeo is--active",
            x: 0,
            y: 0,
            rotation: 0.01,
            zIndex: 10,
            scale: 1.01,
            opacity: 1,
            ease: "none"
        },
        "<"
    );

const cardsScrollTrigger = ScrollTrigger.create({
    animation: cardsTimeline,
    trigger: ".product__track",
    start: "center bottom",
    snap: {
        snapTo: 1,
        duration: {
            min: 0.25,
            max: 0.75
        },
    },
    end: "center top",
    scrub: .5,
    ease: "power2.in"
});

function getPixelTranslate(axis) {
    var factor;
    var delta;
    const isPhone = window.innerWidth < 468 ? true : false;
    switch (axis) {
        case 'x':
            delta = isPhone ? 4.3 : 8.9;
            break;
        case 'y':
            delta = isPhone ? 1.7 : 5.2;
            break;
    }
    
    factor = getComputedStyle(document.documentElement).getPropertyValue('--fontSize');
    return (delta * factor * window.innerWidth) / 100;
}

gsap.utils.toArray(".product__card").forEach(function (a, i) {
    a.addEventListener("click", function (e) {
        var scrollPos = 0;
        if (a.classList.contains("spexigon")) {
            scrollPos = cardsScrollTrigger.start;
        } else {
            scrollPos = cardsScrollTrigger.end;
        }
        gsap.to(window, {
            duration: 1,
            scrollTo: scrollPos
        });
    });
});
