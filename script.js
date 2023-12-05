"use strict";

// ELEMENTS
const btnScrollToTop = document.querySelector("#scroll-to-top");

//FUNCTIONS
const showBtn = function () {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    btnScrollToTop.style.opacity = 100;
  } else {
    btnScrollToTop.style.opacity = 0;
  }
};

const scrollToTop = function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

window.onscroll = function () {
  showBtn();
};

btnScrollToTop.addEventListener("click", scrollToTop);
