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

    // tabsSlider
    const prevBtn = document.querySelector('.decision__slider-left'),
          nextBtn = document.querySelector('.decision__slider-right'),
          slideItems = document.querySelectorAll('.decision__slider-item');
          navLinks = document.querySelectorAll('.decision__link');
    let curentSlide = 0;

    function hideContent() {
        slideItems.forEach(item => {
            item.classList.remove('show');
        });
        navLinks.forEach(link =>{
            link.classList.remove('decision__link_active');
        });
    }
    function showContent(i){
        slideItems[i].classList.add('show');
        navLinks[i].classList.add('decision__link_active');
    }
    navLinks.forEach((link,i) => {
        link.addEventListener('click',(event) => {
            event.preventDefault();
            if (event.target.closest('.decision__link')){
                hideContent();
                showContent(i);
                curentSlide = i;
            }
            
        });
    });
    nextBtn.addEventListener('click',() => {
        curentSlide++;
        hideContent();
        if (curentSlide == slideItems.length){
            curentSlide = 0;
        }
        showContent(curentSlide);
    });

    prevBtn.addEventListener('click',() => {
        if (curentSlide == 0){
            curentSlide = slideItems.length;
        }
        curentSlide--;
        hideContent();
        showContent(curentSlide);
    });

    //Modal

    const modalBtns = document.querySelectorAll('[data-modal]'),
          closeBtns = document.querySelectorAll('.modal__close'),
          modalOverlay = document.querySelector('.overlay');

    modalBtns.forEach(item => {
        item.addEventListener('click',() => {
            modalOverlay.classList.add('overlay_active');
            document.body.style.overflow ='hidden';
            stopSlideShow();
        });
    });

    closeBtns.forEach(item => {
        item.addEventListener('click',() => {
           closeModal();
        });
    });

    function closeModal(){
        modalOverlay.classList.remove('overlay_active');
        document.body.style.overflow = '';
        startSlideShow();
    }

    modalOverlay.addEventListener('click',(event) => {
        if (event.target == modalOverlay)
        closeModal();
    });

    document.addEventListener('keydown',(event) => {
        if (event.code == 'Escape'){
            closeModal();
        }
    });

    //form
    messages = {
        loading: 'icons/spinner.svg',
        success:['Спасибо за вашу заявку!','Наш менеджер свяжется с вами в ближайшее время!'],
        error:['Что-то пошло не так...','Попробуйте отправить заявку позже.']
    };

    function showThanksModal(messageArr){
        const modalChange = document.querySelector('.modal__content');
        modalChange.classList.add('hide');

        let modalThanks = document.createElement('div');
        modalThanks.innerHTML = `
        <h2 class="modal__title">${messageArr[0]}</h2>
        <div class="modal__subtitle">${messageArr[1]}</div>
        `;
        document.querySelector('.modal').append(modalThanks);

        setTimeout(() =>{
            closeModal();
        },3000);
        setTimeout(() => {
            modalThanks.remove();
            modalChange.classList.remove('hide');
        },5000);
    }

    const form = document.querySelector('form');
    form.addEventListener('submit',(event) => {
        event.preventDefault();

        let statusMessage = document.createElement('img');
        statusMessage.src = messages.loading;
        statusMessage.style.cssText = 'display:block;margin:20px auto';
        form.insertAdjacentElement('afterend',statusMessage);

        const formData = new FormData(form);
        let obj = {};

        formData.forEach(function(value,key){
            obj[key] = value;
        });

        fetch('mailer/smart.php', {
            method: 'POST',
            header: {
                'Content-type':'application/json'
            },
            body:JSON.stringify(obj)
        }).then((data) => {
            data.text();
        }).then(() => {
            showThanksModal(messages.success);
            statusMessage.remove();
        }).catch(() => {
            showThanksModal(messages.error);
            statusMessage.remove();
        }).finally(() => {
            form.reset();
        });

    });

    //to top button

  const btn = document.querySelector('.up-btn');

  document.addEventListener('scroll', () => {
      let scrolled = window.pageYOffset;
      let coords = document.documentElement.clientHeight;

      if (scrolled > coords ){
          btn.classList.add('up-btn_active');
      } else {
          btn.classList.remove('up-btn_active');
      }
  });

  btn.addEventListener('click', backToTop);
  
  function backToTop() {
      
      if (window.pageYOffset > 0) {
          window.scrollBy(0,-80);
          setTimeout(backToTop,0);
      } 
  }

});