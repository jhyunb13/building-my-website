"use strict";

import * as bootstrap from "bootstrap";
import content from "../content.json";
import supabase from "../supabase";

import {
  projectCardEl,
  experienceEl,
  listItemEl,
  modalEl,
  modalBodyEl,
  errorMessageEl,
} from "./markups";

///////////////////////////////////////////////////////////////
// Elements
const nav = document.querySelector(".navbar");
const myOffCanvas = document.querySelector(".offcanvas");

const sectionAbout = document.querySelector("#about");
const sectionSkills = document.querySelector("#skills");
const sectionProjects = document.querySelector("#projects");
const sectionExperience = document.querySelector("#experience");
const allSections = document.querySelectorAll(".section");

const modalContainer = document.querySelector(".modal-container");

const btnToTop = document.querySelector(".btn-to-top");
const btnToAbout = document.querySelector(".btn-more");

const copyrightYear = document.querySelector(".copyright-current-year");

///////////////////////////////////////////////////////////////
// Update Copyright Year
const currentYear = new Date().getFullYear();
copyrightYear.textContent = currentYear;

///////////////////////////////////////////////////////////////
// Show & hide a scroll-to-top button
function showBtn() {
  if (document.documentElement.scrollTop > 30) {
    btnToTop.style.opacity = 100;
    btnToTop.style.visibility = "visible";
  } else {
    btnToTop.style.opacity = 0;
    btnToTop.style.visibility = "hidden";
  }
}

///////////////////////////////////////////////////////////////
// Scroll Behavior
const locationOfAbout = sectionAbout.offsetTop;
const menuHeight = nav.offsetHeight;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToAbout() {
  window.scrollTo({ top: locationOfAbout - menuHeight, behavior: "smooth" });
}

///////////////////////////////////////////////////////////////
// Hide offcanvas
const bsOffcanvas = new bootstrap.Offcanvas(myOffCanvas);

function hideOffcanvas(e) {
  if (!e.target.closest(".nav-link")) return;

  bsOffcanvas.hide();
}

///////////////////////////////////////////////////////////////
// Reveal Sections
const sectionObserver = new IntersectionObserver(loadSection, {
  root: null,
  threshold: [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.8, 0.9, 1],
});

const sectionSkillsObserver = new IntersectionObserver(loadSection, {
  root: null,
  threshold: [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
});

function loadSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section-hidden");

  observer.unobserve(entry.target);
}

allSections.forEach((section) => sectionObserver.observe(section));
sectionSkillsObserver.observe(sectionSkills);

///////////////////////////////////////////////////////////////
// Image Lazy Loading
function loadImg(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );

  observer.unobserve(entry.target);
}

function lazyLoading() {
  const thumbnails = document.querySelectorAll(".card-img-top");
  const secondThumbnail = thumbnails[1];

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: [0.01, 0.1, 1],
  });

  const secondObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: [0.01, 0.1, 1],
  });

  thumbnails.forEach((img) => imgObserver.observe(img));
  secondObserver.observe(secondThumbnail);
}

///////////////////////////////////////////////////////////////
// Fetch data from supabase
async function loadData(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select("*");

    const sortedData = data.slice().sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (!error) return sortedData;
  } catch (err) {
    console.log(err);

    renderErrorMessage();
  }
}

// when fail to fetch data
function renderErrorMessage() {
  if (document.querySelector(".error-message")) return;

  // insert elements
  const markup = errorMessageEl();
  document.querySelector("main").insertAdjacentHTML("afterend", markup);

  // make an element focusable
  const element = document.querySelector(".error-message");
  element.focus();

  // add event listener
  clearErrorMessage(element);
}

function clearErrorMessage(el) {
  el.addEventListener("click", (e) => {
    if (e.target.closest(".btn-close")) el.remove();
    if (e.target.closest(".btn-box")) location.reload();
  });

  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") el.remove();
  });
}

///////////////////////////////////////////////////////////////
// Render each section
function clear(sectionEl) {
  sectionEl.querySelectorAll(".loading-content").forEach((el) => el.remove());
}

function renderSkillsSection(sectionEl) {
  //load data
  const { skillset } = content;

  //remove placeholder
  clear(sectionEl);

  //insert elements
  const itemMarkup = listItemEl(skillset, "skill");
  const listMarkup = `<ul class='section-content skills-container col-12 col-lg-10 col-xl-7'>
    ${itemMarkup}
  </ul>`;

  sectionEl.insertAdjacentHTML("beforeend", listMarkup);
}

async function renderProjectSection(sectionEl, name) {
  //load data
  const data = await loadData(name);

  if (data) {
    //remove placeholder
    clear(sectionEl);

    //insert elements
    data.map((obj, i) => {
      const markup = projectCardEl(obj);

      sectionEl.querySelector(".row").insertAdjacentHTML("beforeend", markup);
    });

    lazyLoading();
  }
}

async function renderExperienceSection(sectionEl, name) {
  //load data
  const data = await loadData(name);

  if (data) {
    //remove placeholder
    clear(sectionEl);

    //insert elements
    data.map((obj, i) => {
      const markup = experienceEl(obj, i);

      sectionEl
        .querySelector(".accordion")
        .insertAdjacentHTML("beforeend", markup);
    });
  }
}

async function renderModal(el, name) {
  //load data
  const data = await loadData(name);

  if (data) {
    //insert elements
    data.map((obj) => {
      const markup = modalEl(obj);

      el.insertAdjacentHTML("beforeend", markup);
    });
  }
}

async function changeModalContent(currentModal, clickedBtn) {
  //load data
  const allData = await loadData("portfolio-projects");

  if (allData) {
    const projectData = allData.filter(
      (data) => data.modalID === currentModal.id
    )[0];
    const modalData = projectData.problemSolving.map((content) =>
      JSON.parse(content)
    );

    //remove current body content
    currentModal
      .querySelectorAll(".modal-body > *")
      .forEach((el) => el.remove());

    //display corresponding content
    const btnNumber = Number(clickedBtn.dataset.number) - 1;
    const markup = modalBodyEl(modalData[btnNumber]);

    currentModal
      .querySelector(".modal-body")
      .insertAdjacentHTML("afterbegin", markup);
  }
}

function resetModalContent(e) {
  const currentModal = e.target.closest(".modal");
  const btns = currentModal.querySelectorAll(".btn-problem");
  const modalBtnContainer = currentModal.querySelector(".modal-btns");

  if (
    !currentModal.classList.contains("show") ||
    (!currentModal.classList.contains("show") && e.key === "Escape")
  ) {
    setTimeout(() => {
      modalBtnContainer.scrollLeft = 0;

      btns.forEach((btn, i) => {
        if (i === 0) {
          btn.classList.add("active");
          changeModalContent(currentModal, btn);
        } else btn.classList.remove("active");
      });
    }, 90);
  }
}

function highlightBtn(e) {
  const currentModal = e.target.closest(".modal");
  const clickedBtn = e.target.closest(".btn-problem");
  const btns = currentModal.querySelectorAll(".btn-problem");

  if (!clickedBtn) return;

  btns.forEach((btn) => btn.classList.remove("active"));
  clickedBtn?.classList.add("active");

  clickedBtn.scrollIntoView({ behavior: "smooth", inline: "center" });
  changeModalContent(currentModal, clickedBtn);
}

///////////////////////////////////////////////////////////////
//Display Content
renderSkillsSection(sectionSkills);
renderProjectSection(sectionProjects, "portfolio-projects");
renderExperienceSection(sectionExperience, "portfolio-experience");
renderModal(modalContainer, "portfolio-projects");

///////////////////////////////////////////////////////////////
//Event Handler
myOffCanvas.addEventListener("click", hideOffcanvas);
btnToTop.addEventListener("click", scrollToTop);
btnToAbout.addEventListener("click", scrollToAbout);
window.addEventListener("scroll", showBtn);
modalContainer.addEventListener("click", (e) => {
  resetModalContent(e);
  highlightBtn(e);
});
modalContainer.addEventListener("keydown", resetModalContent);
