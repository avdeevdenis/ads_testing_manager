let resizableContainer;
let renderButton;
let bannerFrame;

const MIN_CONTAINER_SIZE = 100;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const reloadIframe = () => {
  const src = new URL(bannerFrame.src);

  const newSrc = src.origin + src.pathname + '?rnd=' + getRandomInt(100000, 999999);

  bannerFrame.src = newSrc;
};

const setResizableContainer = (el) => {
  const sizerRight = el.querySelector('.sizer_right');
  const sizerBottom = el.querySelector('.sizer_bottom');

  const coords = {
    x: Infinity,
    y: Infinity,
  };

  let startWidth, startHeight;

  function init() {
    el.removeEventListener('click', init, false);

    setDefaultSizerContent();
    makeTheHandle();
  }

  function setDefaultSizerContent() {
    sizerRight.innerText = bannerFrame.offsetWidth;
    sizerBottom.innerText = bannerFrame.offsetHeight;
  }

  function makeTheHandle() {
    const handle = document.createElement('div');
    handle.classList.add('handle');
    el.appendChild(handle);

    handle.addEventListener('mousedown', initDrag, false);
  }

  function initDrag(event) {
    coords.x = event.clientX;
    coords.y = event.clientY;

    document.body.classList.add('no-user-select');

    el.classList.add('resizable');

    startWidth = parseInt(window.getComputedStyle(el).width, 10);
    startHeight = parseInt(window.getComputedStyle(el).height, 10);

    document.addEventListener('mousemove', doDrag, false);
    document.addEventListener('mouseup', stopDrag, false);
  }

  function doDrag(event) {
    let width = startWidth + event.clientX - coords.x;
    let height = startHeight + event.clientY - coords.y;

    if (width <= MIN_CONTAINER_SIZE) {
      width = MIN_CONTAINER_SIZE;

      sizerRight.classList.add('sizer_danger');
    } else {
      sizerRight.classList.remove('sizer_danger');
    }

    if (height <= MIN_CONTAINER_SIZE) {
      height = MIN_CONTAINER_SIZE;

      sizerBottom.classList.add('sizer_danger');
    } else {
      sizerBottom.classList.remove('sizer_danger');
    }

    sizerRight.innerText = bannerFrame.offsetWidth;
    sizerBottom.innerText = bannerFrame.offsetHeight;

    el.style.width = width + 'px';
    el.style.height = height + 'px';
  }

  function stopDrag() {
    el.classList.remove('resizable');
    document.body.classList.remove('no-user-select');

    document.removeEventListener('mousemove', doDrag, false);
    document.removeEventListener('mouseup', stopDrag, false);

    reloadIframe();
  }

  init();
};

const setContainerSizeFromQueryArgs = () => {
  const searchParams = new URL(location.href).searchParams;

  const width = Number(searchParams.get('width'));
  const height = Number(searchParams.get('height'));

  if (width) {
    const avaliableWidth = width < MIN_CONTAINER_SIZE ? MIN_CONTAINER_SIZE : width;
    resizableContainer.style.width = `${avaliableWidth}px`;
  }

  if (height) {
    const avaliableHeight = height < MIN_CONTAINER_SIZE ? MIN_CONTAINER_SIZE : height;
    resizableContainer.style.height = `${avaliableHeight}px`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  resizableContainer = document.getElementById('resizable-container');
  renderButton = document.querySelector('.render-button');
  bannerFrame = document.getElementById('banner-frame');

  setContainerSizeFromQueryArgs();
  setResizableContainer(resizableContainer);
});