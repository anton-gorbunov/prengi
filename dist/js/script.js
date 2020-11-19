document.addEventListener('DOMContentLoaded', () => {
    //slider
    const slidesWrapper = document.querySelector('.promo__slider-wrapper'),
          slides = slidesWrapper.querySelectorAll('.promo__slide'),
          slidesField = slidesWrapper.querySelector('.promo__slider-inner'),
          sliderNav = document.querySelector('.promo__slider-nav'),
          prev = sliderNav.querySelector('.promo__slider-prev'),
          next = sliderNav.querySelector('.promo__slider-next'),
          navItems = sliderNav.querySelectorAll('.promo__slider-round'),
          width = window.getComputedStyle(slidesWrapper).width;

    let offset = 0,
        numWidth = +width.slice(0, width.length-2);

    slidesField.style.width = 100 * slides.length + '%';
    slides.forEach(item => {
        item.style.width = width;
    });

    sliderNav.addEventListener('mousemove', stopSlideShow);
    sliderNav.addEventListener('mouseout', startSlideShow);
    next.addEventListener('click', showNextSlide); 

    prev.addEventListener('click', () => {
        if ( offset == 0){
            offset = numWidth * (slides.length-1);
        } else {
            offset -= numWidth;
        }
        showActiveNav();
        slidesField.style.transform = `translateX(-${offset}px)`;
    });

    navItems.forEach((item,i) => {
        item.addEventListener('click', (event) => {
            let target = event.target;
            if (target == item){
                offset = numWidth * i;
                showActiveNav();
                slidesField.style.transform = `translateX(-${offset}px)`;
            }
        });
    });


    function startSlideShow(){
        if (numWidth > 768){
        window.timerId = window.setInterval(showNextSlide, 4000);
        }
    }
    function stopSlideShow(){
        window.clearInterval(window.timerId);
    }
    
    function showActiveNav(){
        navItems.forEach(item => {
            item.classList.remove('promo__slider-round_active');
        });
        let activeSlide = offset / numWidth;
        navItems[activeSlide].classList.add('promo__slider-round_active');
    }
    function showNextSlide(){
        if (offset == numWidth * (slides.length - 1)){
            offset = 0;
        } else {
            offset += numWidth;
        }
        showActiveNav();
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    startSlideShow();


    //hamburger

    const hamburger = document.querySelector('.promo__hamburger'),
          menu = document.querySelector('.promo__menu'),
          overlay = document.querySelector('.promo__overlay'),
          menuLinks = document.querySelectorAll('.promo__link');
         
          
    
    hamburger.addEventListener('click',() => {
        menu.classList.toggle('promo__menu_active');
        overlay.classList.toggle('promo__overlay_active');
        hamburger.classList.toggle('promo__hamburger_active');
    });

    menuLinks.forEach(item => {
        item.addEventListener('click',() => {
            menu.classList.remove('promo__menu_active');
            overlay.classList.remove('promo__overlay_active');
            hamburger.classList.remove('promo__hamburger_active');
        });
    });
});