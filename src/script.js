"use strict";
import * as bootstrap from "bootstrap";
import smoothscroll from "smoothscroll-polyfill";

smoothscroll.polyfill();

//Elements
const btnScrollToTop = document.querySelector("#scroll-to-top");
const btnToAbout = document.querySelector(".btn-to-about");
const myOffcanvas = document.querySelector(".offcanvas");
const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
const offcanvasItem = document.querySelectorAll(".nav-link");
const locationOfAbout = document.querySelector("#about").offsetTop;
const menuHeight = document.querySelector(".navbar").offsetHeight;
const sectionAbout = document.querySelector("#about");
const sectionProjects = document.querySelector("#projects");
const sectionExperience = document.querySelector("#experience");
const sections = [sectionAbout, sectionProjects, sectionExperience];

console.log(sections);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.05,
});

sections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

//Functions
const showBtn = function () {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    btnScrollToTop.style.opacity = 100;
  } else {
    btnScrollToTop.style.opacity = 0;
  }
};

const scrollToTop = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToAbout = function () {
  window.scrollTo({ top: locationOfAbout - menuHeight, behavior: "smooth" });
};

const hideOffcanvas = function (element) {
  element.addEventListener("click", function () {
    bsOffcanvas.hide();
  });
};

//Event Handler
btnScrollToTop.addEventListener("click", scrollToTop);
btnToAbout.addEventListener("click", scrollToAbout);
offcanvasItem.forEach(hideOffcanvas);
window.onscroll = function () {
  showBtn();
};
