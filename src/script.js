"use strict";

import * as bootstrap from "bootstrap";
import smoothscroll from "smoothscroll-polyfill";
import content from "./content.json";
import supabase from "./supabase";

//Elements
const btnToTop = document.querySelector(".btn-to-top");
const btnToAbout = document.querySelector(".btn-know-more");
const myOffcanvas = document.querySelector(".offcanvas");
const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
const offcanvasItem = document.querySelectorAll(".nav-link");
const locationOfAbout = document.querySelector("#about").offsetTop;
const menuHeight = document.querySelector(".navbar").offsetHeight;
const sectionAbout = document.querySelector("#about");
const sectionSkills = document.querySelector("#skills");
const introHighlight = document.querySelector(".intro-highlight-1");
const thridHighlight = document.querySelector(".intro-highlight-3");
const sectionProjects = document.querySelector("#projects");
const sectionExperience = document.querySelector("#experience");
const projectModal = document.querySelector("#exampleModal");
const modalContainer = document.querySelector(".modal-container");

const { skillset } = content;
const sections = [sectionAbout, sectionProjects, sectionExperience];
const accordionNum = ["One", "Two", "Three", "Four", "Five"];
let loadingDone = false;

smoothscroll.polyfill();

//Functions
const loadSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section-hidden");

  observer.unobserve(entry.target);
};

const revealSection = function () {
  const sectionObserver = new IntersectionObserver(loadSection, {
    root: null,
    threshold: 0.05,
  });

  sections.forEach((section) => {
    section.classList.add("section-hidden");
    sectionObserver.observe(section);
  });
};

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  observer.unobserve(entry.target);
};

const lazyLoading = function () {
  const thumbnails = document.querySelectorAll(".card-img-top");
  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: [0, 0.1, 0.5],
  });

  thumbnails.forEach((target) => imgObserver.observe(target));
};

const setAccordionBtnStatus = function (numbers) {
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
};

const appendElement = function (insertingPlace, el) {
  insertingPlace.append(el);
};

const prependElement = function (insertingPlace, el) {
  insertingPlace.prepend(el);
};

const createNInsertElements = function (
  data,
  newEl,
  classForNewEl,
  insertingPlace
) {
  data.map((content) => {
    const newElement = document.createElement(newEl);

    classForNewEl && newElement.classList.add(...classForNewEl);
    newElement.textContent =
      typeof content === "string" ? content : content.title;

    appendElement(insertingPlace, newElement);
  });
};

const cloneElement = function (parentEl, childEl) {
  return parentEl.querySelector(childEl).cloneNode(true);
};

const removeElements = function (parentEl, targetEl) {
  parentEl.querySelectorAll(targetEl).forEach((el) => el.remove());
};

const updateTextContent = function (data) {
  data.map((d) => (d.el.textContent = d.content));
};

const updateAttribute = function (data) {
  data.map((d) => d.el.setAttribute(d.attr, d.content));
};

const renderModal = function (arr) {
  arr.map((project) => {
    const modalClone = projectModal.cloneNode(true);
    const btnContainer = modalClone.querySelector(".btn-container");
    const modalContent = project.problemSolving.map((content) =>
      JSON.parse(content)
    );

    modalClone.setAttribute("id", project.modalID);
    modalClone.querySelector(".modal-title").textContent = project.title;

    removeElements(modalClone, ".btn-problem");
    createNInsertElements(
      modalContent,
      "button",
      ["btn-problem", "skill--default"],
      btnContainer
    );

    const firstProblemBtn = btnContainer.firstElementChild;

    firstProblemBtn.classList.add("btn--active");
    changeModalContent(modalClone, firstProblemBtn);
    appendElement(modalContainer, modalClone);
  });
};

const renderProjectsContent = function (arr) {
  arr.map((project) => {
    const cloneProjectCard = cloneElement(sectionProjects, ".col");
    const codeLink = cloneProjectCard.querySelector(".link-code");
    const projectLink = cloneProjectCard.querySelector(".link-project");

    const textContentList = [
      {
        el: cloneProjectCard.querySelector(".card-title"),
        content: project.title,
      },
      { el: cloneProjectCard.querySelector("p"), content: project.description },
      {
        el: projectLink,
        content: project.urlText,
      },
      {
        el: cloneProjectCard.querySelector(".card-subheading"),
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
        el: cloneProjectCard.querySelector(".btn--modal"),
        attr: "data-bs-target",
        content: `#${project.modalID}`,
      },
    ];

    updateAttribute(attrList);
    updateTextContent(textContentList);
    removeElements(cloneProjectCard, ".skill--project");
    createNInsertElements(
      project.skills,
      "li",
      ["skill--default", "skill--project"],
      cloneProjectCard.querySelector(".project-skills-container")
    );
    prependElement(sectionProjects.querySelector(".row"), cloneProjectCard);
  });

  lazyLoading();
};

const renderExperienceContent = function (arr) {
  arr.map((experience) => {
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
      cloneExperienceCard.querySelector(".expeirence-responsibilities")
    );

    prependElement(
      sectionExperience.querySelector(".accordion"),
      cloneExperienceCard
    );
  });

  setAccordionBtnStatus(accordionNum);
};

const showBtn = function () {
  document.body.scrollTop > 30 || document.documentElement.scrollTop > 30
    ? (btnToTop.style.opacity = 100)
    : (btnToTop.style.opacity = 0);
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

const rearrangeHighlight = function () {
  const firstHighlightHeight = introHighlight.getBoundingClientRect().height;
  const thirdHighlightHeight = thridHighlight.getBoundingClientRect().height;
  const firstHighlightGroup = document.querySelectorAll(".intro-highlight-1");
  const numFirstHighlight = firstHighlightGroup.length;
  const firstHighlightTop = [];

  firstHighlightGroup.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    firstHighlightTop.push(top);
  });

  if (firstHighlightHeight >= thirdHighlightHeight * 2) {
    if (numFirstHighlight === 2) return;

    introHighlight.textContent = "front-end";
    introHighlight.insertAdjacentText("beforeend", " ");

    const secondHighlight = document.createElement("strong");
    introHighlight.insertAdjacentElement("afterend", secondHighlight);
    secondHighlight.textContent = "developer";
    secondHighlight.classList.add("intro-highlight-1");
  }

  if (
    numFirstHighlight === 2 &&
    firstHighlightTop[0] === firstHighlightTop[1]
  ) {
    introHighlight.nextSibling.remove();
    introHighlight.textContent = "front-end developer";
  }
};

async function loadData(tableName, updateFunc) {
  const { data, error } = await supabase.from(tableName).select("*");

  const sortedData = data.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  if (!error && updateFunc) updateFunc(sortedData);

  return sortedData;
}

const resetModalContent = function (e) {
  const currentModal = e.target.closest(".modal");
  const firstBtn = currentModal.querySelector(".btn-problem");
  const btns = currentModal.querySelectorAll(".btn-problem");

  if (
    !currentModal.classList.contains("show") ||
    (!currentModal.classList.contains("show") && e.key === "Escape")
  ) {
    btns.forEach((btn) => {
      btn.classList.remove("btn--active");
      firstBtn.classList.add("btn--active");
    });

    changeModalContent(currentModal, firstBtn);
  }
};

const activateBtn = function (e) {
  const currentModal = e.target.closest(".modal");
  const clickedBtn = e.target.closest(".btn-problem");
  const btns = currentModal.querySelectorAll(".btn-problem");

  if (!clickedBtn) return;

  btns.forEach((btn) => btn.classList.remove("btn--active"));
  clickedBtn?.classList.add("btn--active");

  changeModalContent(currentModal, clickedBtn);
};

async function changeModalContent(currentModal, clickedBtn) {
  const projectData = await loadData("portfolio-projects");
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

revealSection();
loadData("portfolio-projects", renderProjectsContent);
loadData("portfolio-experience", renderExperienceContent);
loadData("portfolio-projects", renderModal);
createNInsertElements(
  skillset,
  "div",
  ["skill--default"],
  sectionSkills.querySelector(".skills-container")
);

//Event Handler
btnToTop.addEventListener("click", scrollToTop);
btnToAbout.addEventListener("click", scrollToAbout);
// window.addEventListener("load", rearrangeHighlight);
// window.addEventListener("resize", rearrangeHighlight);
modalContainer.addEventListener("click", (e) => {
  resetModalContent(e);
  activateBtn(e);
});
modalContainer.addEventListener("keydown", resetModalContent);

offcanvasItem.forEach(hideOffcanvas);
window.onscroll = function () {
  showBtn();
};
