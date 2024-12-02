$(document).ready(function () {
  // Add Yandex.Metric JavaScript-events
  const addYmReachGoal = () => {
    const attributeName = 'data-ym-targetId';
    if (!window.Ya) return;
    let _metrikaCounters;
    try {
      _metrikaCounters = window.Ya._metrika.getCounters();
    } catch (err) {
      return;
    }

    const addReachGoalListener = (
      el,
      counterId,
      targetId = null,
      eventName = 'click'
    ) => {
      const target = targetId ? targetId : el.getAttribute(attributeName);

      el.addEventListener(eventName, () => {
        if (typeof ym === 'function') {
          try {
            ym(counterId, 'reachGoal', target);
          } catch (err) {
            return;
          }
        }
      });
    };

    document.querySelectorAll(`[${attributeName}]`).forEach((el) => {
      const targetId = el.getAttribute(attributeName);
      if (!targetId) return;

      let eventName;

      switch (el.tagName.toUpperCase()) {
        case 'FORM':
          eventName = 'submit';
          break;
        default:
          eventName = 'click';
          break;
      }

      _metrikaCounters.forEach((counter) => {
        addReachGoalListener(el, counter.id, targetId);
      });
    });
  };
  addYmReachGoal();

  let triggersModal = document.querySelectorAll('.js-show-modal');
  let modals = document.querySelectorAll('.js-modal');

  const disableScroll = () => {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.left = `0`;
    document.body.style.width = window.getComputedStyle(document.body).width;
    document.body.style.position = 'fixed';
  };

  const enableScroll = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };

  const stopVideo = () => {
    document.querySelectorAll('.modal.is-open iframe').forEach((item) => {
      if (item.getAttribute('src')) {
        item.setAttribute('data-iframe-src', item.getAttribute('src'));
      }
      item.setAttribute('src', '');
    });
  };

  const startVideo = () => {
    document.querySelectorAll('.modal.is-open iframe').forEach((item) => {
      if (item.getAttribute('src')) return;
      item.setAttribute('src', item.getAttribute('data-iframe-src'));
    });
  };

  function closeModal() {
    modals.forEach((modal) => {
      if (modal.classList.contains('is-open')) {
        stopVideo();
        enableScroll();
        modal.classList.remove('is-open');
      }
    });
  }

  modals.forEach((modal) => {
    modal.addEventListener('click', function (event) {
      const isOutside = !event.target.closest('.modal__inner');
      const isCloseButton = event.target.matches('.js-close-modal');
      if (isCloseButton || isOutside) {
        closeModal();
      }
    });
  });

  triggersModal.forEach((button) =>
    button.addEventListener('click', function (e) {
      e.preventDefault();
      let modalID = this.dataset.modal;
      // console.log(modalID);
      modals.forEach(function (modal) {
        if (modal.dataset.modal == modalID) {
          disableScroll();
          modal.classList.add('is-open');
          startVideo();
        }
      });
    })
  );

  $('#menu').on('click', 'a', function (event) {
    if (
      event.target.getAttribute('href') &&
      event.target.getAttribute('href')[0] !== '#'
    )
      return;
    event.preventDefault();
    var id = $(this).attr('href'),
      top = $(id).offset().top;
    $('body,html').animate({ scrollTop: top }, 800);
  });

  $('.scroll-to-top').on('click', function() {
      $('html, body').animate({ scrollTop: 0 }, 800);
  });


  $('.js-send').submit(function () {
    var formID = $(this).attr('id');

    var formNm = $('#' + formID);
    $.ajax({
      type: 'POST',
      url: '/wp-content/themes/cosmos/mail/mail.php',
      data: formNm.serialize(),
      success: function (data) {
        $('.js-close-modal').trigger('click');
        document.forms[formID].reset();
        $('.js-success').trigger('click');
      },
      error: function (jqXHR, text, error) {
        $(formNm).html(error);
      },
    });
    return false;
  });

  const toogleLocale = function (event) {
    event.preventDefault();
    if (event.target.tagName === 'A' && event.target.href !== '#') {
      document.location.href = event.target.href;
    }
    document.getElementById('locale').classList.toggle('is-open');
  };

  document.getElementById('locale').addEventListener('click', toogleLocale);

  const menuTopToggle = function () {
    const menu = document.getElementById('menu');
    const menuBtn = document.getElementById('menu-btn');
    const isOpen = 'is-open';
    const zIndexMenu = window.getComputedStyle(menu).zIndex;

    const createOutBox = () => {
      const outBox = document.createElement('div');
      outBox.style.position = 'fixed';
      outBox.style.top = 0;
      outBox.style.left = 0;
      outBox.style.right = 0;
      outBox.style.bottom = 0;
      outBox.style.display = 'none';
      outBox.style.backgroundColor = 'transparent';
      outBox.style.zIndex = 10;
      return outBox;
    };

    const outBox = createOutBox();
    document.body.prepend(outBox);

    const hideMenu = function () {
      outBox.style.display = 'none';
      menuBtn.classList.remove(isOpen);
      menu.classList.remove(isOpen);
    };

    const showMenu = function () {
      outBox.style.display = 'block';
      menuBtn.classList.add(isOpen);
      menu.classList.add(isOpen);
    };

    const handleBtnClick = () => {
      // console.log(menuBtn.classList.contains(isOpen));
      menuBtn.classList.contains(isOpen) ? hideMenu() : showMenu();
    };

    outBox.addEventListener('click', hideMenu);
    menu.addEventListener('click', hideMenu);
    menuBtn.addEventListener('click', handleBtnClick);
  };

  menuTopToggle();

  const resizeFullModalBox = function () {
    const fullModal = document.querySelectorAll('.fullmodal-box');
    fullModal.forEach((item) => {
      const modal = {
        height: item.offsetHeight,
        width: item.offsetWidth,
      };
      const child = {
        height: item.children[0].offsetHeight,
        width: item.children[0].offsetWidth,
      };

      const k = child.height / child.width;
      const m = modal.height / modal.width;
      const styles = window.getComputedStyle(item.children[0]);
      if (
        Number.parseFloat(styles.height) ===
        Number.parseFloat(styles.paddingTop) +
          Number.parseFloat(styles.paddingBottom)
      ) {
        item.children[0].style.height = styles.height;
        item.children[0].style.width = styles.width;
        item.children[0].style.flexBasis = styles.width;
        item.children[0].style.paddingTop = '0';
        item.children[0].style.paddingBottom = '0';
      }

      const fitFullWidth = () => {
        item.children[0].style.width = modal.width + 'px';
        item.children[0].style.flexBasis = modal.width + 'px';
        item.children[0].style.height = modal.width * k + 'px';
      };

      const fitFullHeight = () => {
        item.children[0].style.height = modal.height + 'px';
        item.children[0].style.width = modal.height / k + 'px';
        item.children[0].style.flexBasis = modal.height / k + 'px';
      };
      const delta = 0.1;
      switch (true) {
        case Math.abs(modal.height - child.height) < delta &&
          Math.abs(modal.width - child.width) < delta:
          return;
        case Math.abs(modal.width - child.width) < delta &&
          modal.height < child.height:
          fitFullHeight();
          return;
        case Math.abs(modal.height - child.height) < delta &&
          modal.width < child.width:
          fitFullWidth();
          return;
        case modal.height > child.height && modal.width > child.width && k > m:
          fitFullHeight();
          break;
        case modal.height > child.height && modal.width > child.width && k <= m:
          fitFullWidth();
          return;
        default:
          return;
      }
    });
  };
  resizeFullModalBox();
  window.addEventListener('resize', resizeFullModalBox);
  window.addEventListener('orientationchange', resizeFullModalBox);

  // Vertical slider

  const topSection = document.querySelector('.longread__section_top');
  const bottomSection = document.querySelector('.longread__section_bottom');
  const btnDown = document.querySelector('.arrow-btn-down');
  const btnUp = document.querySelector('.arrow-btn-up');
  const durationInMs = 1500;

  const scrollToElement = (element, duration) => {
    const start = window.pageYOffset;
    const target = element.getBoundingClientRect().top + start;
    const distance = target - start;
    const startTime = performance.now();

    const animation = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      window.scrollTo(0, start + distance * easeInOutQuad(progress));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    requestAnimationFrame(animation);
  };

  // slide up
  btnDown.addEventListener('click', () => {
    bottomSection.classList.remove('hidden-screen');
    bottomSection.classList.add('slide-up');
    topSection.classList.add('slide-up');
    setTimeout(() => {
      topSection.classList.add('hidden-screen');
      topSection.classList.remove('slide-up');
      bottomSection.classList.remove('slide-up');
    }, durationInMs);
  });

  // slide down
  btnUp.addEventListener('click', () => {
    topSection.classList.add('slide-down');
    bottomSection.classList.add('slide-down');
    topSection.classList.remove('hidden-screen');
    scrollToElement(bottomSection, durationInMs);
    setTimeout(() => {
      bottomSection.classList.add('hidden-screen');
      bottomSection.classList.remove('slide-down');
      topSection.classList.remove('slide-down');
    }, durationInMs);
  });
});
