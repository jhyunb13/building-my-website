"use strict";
import * as bootstrap from "bootstrap";

// ELEMENTS
const btnScrollToTop = document.querySelector("#scroll-to-top");
const btnToProjects = document.querySelector(".btn-to-projects");
const myOffcanvas = document.querySelector(".offcanvas");
const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
const offcanvasItem = document.querySelectorAll(".nav-link");
const locationOfAbout = document.querySelector("#about").offsetTop;
const menuHeight = document.querySelector(".navbar").offsetHeight;

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

const scrollToAbout = function () {
  window.scrollTo({ top: locationOfAbout - menuHeight, behavior: "smooth" });
};

const hideOffcanvas = function (element) {
  element.addEventListener("click", function () {
    bsOffcanvas.hide();
  });
};

btnScrollToTop.addEventListener("click", scrollToTop);
btnToProjects.addEventListener("click", scrollToAbout);
offcanvasItem.forEach(hideOffcanvas);
window.onscroll = function () {
  showBtn();
};
