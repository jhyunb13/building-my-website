"use strict";
import * as bootstrap from "bootstrap";

// ELEMENTS
const btnScrollToTop = document.querySelector("#scroll-to-top");
const myOffcanvas = document.querySelector(".offcanvas");
const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
const offcanvasItem = document.querySelectorAll(".nav-link");

//HIDE OFFCANVAS
offcanvasItem.forEach((element) => {
  element.addEventListener("click", function () {
    return bsOffcanvas.hide();
  });
});

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
