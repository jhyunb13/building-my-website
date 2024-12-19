"use strict";

import * as bootstrap from "bootstrap";
import content from "./content.json";
import supabase from "./supabase";

///////////////////////////////////////////////////////////////
// Elements
const nav = document.querySelector(".navbar");
const myOffCanvas = document.querySelector(".offcanvas");

const sectionAbout = document.querySelector("#about");
const sectionSkills = document.querySelector("#skills");
const sectionProjects = document.querySelector("#projects");
const sectionExperience = document.querySelector("#experience");
const allSections = document.querySelectorAll(".section");

const projectModal = document.querySelector("#exampleModal");
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
  threshold: [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
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
// Load data and render each section
const { skillset } = content;
const accordionNum = ["One", "Two", "Three", "Four", "Five"];

function setAccordionBtnStatus(numbers) {
  sectionExperience.querySelectorAll(".accordion-item").forEach((item, i) => {
    const accordionBtn = item.querySelector(".accordion-button");
    const accordionCollapse = item.querySelector(".accordion-collapse");
    const attrList = [
      {
        el: accordionBtn,
        attr: "data-bs-target",
        content: `#collapse${numbers[i]}`,
      },
      {
        el: accordionBtn,
        attr: "aria-controls",
        content: `#collapse${numbers[i]}`,
      },
      {
        el: item.querySelector(".accordion-collapse"),
        attr: "id",
        content: `collapse${numbers[i]}`,
      },
    ];

    updateAttribute(attrList);

    if (item === sectionExperience.querySelector(".accordion-item")) {
      accordionBtn.setAttribute("aria-expanded", "true");
      accordionBtn.classList.remove("collapsed");
      accordionCollapse.classList.add("show");
    } else {
      accordionBtn.setAttribute("aria-expanded", "false");
      accordionBtn.classList.add("collapsed");
      accordionCollapse.classList.remove("show");
    }
  });
}

function appendElement(insertingPlace, el) {
  insertingPlace.append(el);
}

function prependElement(insertingPlace, el) {
  insertingPlace.prepend(el);
}

function createNInsertElements(data, newEl, classForNewEl, insertingPlace) {
  data.map((content) => {
    const newElement = document.createElement(newEl);

    classForNewEl && newElement.classList.add(...classForNewEl);
    newElement.textContent =
      typeof content === "string" ? content : content.title;

    appendElement(insertingPlace, newElement);
  });
}

function cloneElement(parentEl, childEl) {
  return parentEl.querySelector(childEl).cloneNode(true);
}

function removeElements(parentEl, targetEl) {
  parentEl.querySelectorAll(targetEl).forEach((el) => el.remove());
}

function updateTextContent(data) {
  data.map((d) => (d.el.textContent = d.content));
}

function updateAttribute(data) {
  data.map((d) => d.el.setAttribute(d.attr, d.content));
}

async function renderModal() {
  const data = await loadData("portfolio-projects");

  data.map((project) => {
    const modalClone = projectModal.cloneNode(true);
    const btnContainer = modalClone.querySelector(".modal-btns");
    const modalContent = project.problemSolving.map((content) =>
      JSON.parse(content)
    );

    modalClone.setAttribute("id", project.modalID);
    modalClone.querySelector(".heading-title").textContent = project.title;

    removeElements(modalClone, ".btn-problem");
    createNInsertElements(
      modalContent,
      "button",
      ["btn-problem"],
      btnContainer
    );

    const firstProblemBtn = btnContainer.firstElementChild;

    firstProblemBtn.classList.add("active");
    changeModalContent(modalClone, firstProblemBtn);
    appendElement(modalContainer, modalClone);
  });
}

function renderSkillsContent() {
  createNInsertElements(
    skillset,
    "div",
    ["skill"],
    sectionSkills.querySelector(".skills-container")
  );

  if (!sectionSkills.querySelector(".skill")) return;
  sectionSkills.querySelector(".skill-placeholder").remove();
  sectionSkills
    .querySelector(".skills-container")
    .classList.remove("placeholder-glow");
}

async function renderProjectsContent() {
  let isLoading = false;

  isLoading = true;

  const data = await loadData("portfolio-projects");
  sectionProjects
    .querySelectorAll(".placeholder")
    .forEach((el) =>
      el.classList.remove("placeholder", "placeholder-lg", "col-8")
    );
  sectionProjects
    .querySelectorAll(".placeholder-glow")
    .forEach((el) => el.classList.remove("placeholder-glow"));
  sectionProjects.querySelector(".card-table").classList.remove("table-hidden");

  isLoading = false;

  data.map((project) => {
    const cloneProjectCard = cloneElement(sectionProjects, ".col");
    const codeLink = cloneProjectCard.querySelector(".btn-github");
    const projectLink = cloneProjectCard.querySelector(".btn-project");

    const textContentList = [
      {
        el: cloneProjectCard.querySelector(".heading-title"),
        content: project.title,
      },
      { el: cloneProjectCard.querySelector("p"), content: project.description },
      {
        el: projectLink,
        content: project.urlText,
      },
      {
        el: cloneProjectCard.querySelector(".subheading"),
        content: project.subheading,
      },
    ];
    const attrList = [
      {
        el: cloneProjectCard.querySelector("img"),
        attr: "src",
        content: project.thumbnailLazy,
      },
      {
        el: cloneProjectCard.querySelector("img"),
        attr: "data-src",
        content: project.thumbnail,
      },
      {
        el: cloneProjectCard.querySelector("img"),
        attr: "alt",
        content: project.altText,
      },
      {
        el: projectLink,
        attr: "href",
        content: project.url,
      },
      {
        el: codeLink,
        attr: "href",
        content: project.github,
      },
      {
        el: cloneProjectCard.querySelector(".btn-modal-sm"),
        attr: "data-bs-target",
        content: `#${project.modalID}`,
      },
      {
        el: cloneProjectCard.querySelector(".btn-modal-lg"),
        attr: "data-bs-target",
        content: `#${project.modalID}`,
      },
    ];

    updateAttribute(attrList);
    updateTextContent(textContentList);
    removeElements(cloneProjectCard, ".skill-project");
    createNInsertElements(
      project.skills,
      "li",
      ["skill", "skill-project"],
      cloneProjectCard.querySelector(".skills-container-project")
    );
    prependElement(sectionProjects.querySelector(".row"), cloneProjectCard);
  });

  lazyLoading();
}

async function renderExperienceContent() {
  let isLoading = false;

  isLoading = true;

  const data = await loadData("portfolio-experience");

  sectionExperience
    .querySelectorAll(".placeholder")
    .forEach((el) => el.classList.remove("placeholder"));
  sectionExperience
    .querySelectorAll(".placeholder-glow")
    .forEach((el) => el.classList.remove("placeholder-glow"));

  isLoading = false;

  data.map((experience) => {
    const cloneExperienceCard = cloneElement(
      sectionExperience,
      ".accordion-item"
    );
    const textContentList = [
      {
        el: cloneExperienceCard.querySelector(".job-title"),
        content: `${experience.jobTitle} @${experience.company}`,
      },
      {
        el: cloneExperienceCard.querySelector(".duration"),
        content: experience.duration,
      },
    ];

    updateTextContent(textContentList);
    removeElements(cloneExperienceCard, "li");
    createNInsertElements(
      experience.responsibilities,
      "li",
      "",
      cloneExperienceCard.querySelector(".experience-list")
    );
    prependElement(
      sectionExperience.querySelector(".accordion"),
      cloneExperienceCard
    );
  });

  setAccordionBtnStatus(accordionNum);
}

async function loadData(tableName) {
  const { data, error } = await supabase.from(tableName).select("*");
  const sortedData = data.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  if (!error) return sortedData;
}

function resetModalContent(e) {
  const currentModal = e.target.closest(".modal");
  const firstBtn = currentModal.querySelector(".btn-problem");
  const btns = currentModal.querySelectorAll(".btn-problem");
  const modalBtnContainer = currentModal.querySelector(".modal-btns");

  if (
    !currentModal.classList.contains("show") ||
    (!currentModal.classList.contains("show") && e.key === "Escape")
  ) {
    setTimeout(() => {
      modalBtnContainer.scrollLeft = 0;

      btns.forEach((btn) => {
        btn.classList.remove("active");
        firstBtn.classList.add("active");
      });
      changeModalContent(currentModal, firstBtn);
    }, 90);
  }
}

function activateBtn(e) {
  const currentModal = e.target.closest(".modal");
  const clickedBtn = e.target.closest(".btn-problem");
  const btns = currentModal.querySelectorAll(".btn-problem");

  if (!clickedBtn) return;

  btns.forEach((btn) => btn.classList.remove("active"));
  clickedBtn?.classList.add("active");
  clickedBtn.scrollIntoView({ behavior: "smooth", inline: "center" });
  changeModalContent(currentModal, clickedBtn);
}

async function changeModalContent(currentModal, clickedBtn) {
  let isLoading = false;

  isLoading = true;
  const projectData = await loadData("portfolio-projects");
  isLoading = false;

  const rawModalData = projectData
    .map((data) => data.problemSolving)
    .reduce((acc, cur) => acc.concat(cur), []);
  const finalModalData = rawModalData.map((data) => JSON.parse(data));

  finalModalData.map((content) => {
    if (content.title === clickedBtn?.textContent) {
      currentModal.querySelector(".modal-body-heading").textContent =
        content.content;
      currentModal.querySelector(
        ".problem-identification-content"
      ).textContent = content.problemIdentification;
      currentModal.querySelector(".solution-content").textContent = "";
      currentModal.querySelector(".outcome-content").textContent =
        content.outcome;

      content.solution.map((item) => {
        const solutionEl = document.createElement("p");

        solutionEl.textContent = item;
        appendElement(
          currentModal.querySelector(".solution-content"),
          solutionEl
        );
      });
    }
  });
}

///////////////////////////////////////////////////////////////
//Display Content
renderSkillsContent();
renderProjectsContent();
renderExperienceContent();
renderModal();

///////////////////////////////////////////////////////////////
//Event Handler
myOffCanvas.addEventListener("click", hideOffcanvas);
btnToTop.addEventListener("click", scrollToTop);
btnToAbout.addEventListener("click", scrollToAbout);
window.addEventListener("scroll", showBtn);
modalContainer.addEventListener("click", (e) => {
  resetModalContent(e);
  activateBtn(e);
});
modalContainer.addEventListener("keydown", resetModalContent);
