"use strict";
import * as bootstrap from "bootstrap";
import smoothscroll from "smoothscroll-polyfill";
import content from "./content.json";
import supabase from "./supabase";

console.log(process.env.SUPABASE_KEY);

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

const { skillset } = content;
const accordionNum = ["One", "Two", "Three", "Four", "Five"];

smoothscroll.polyfill();

//Functions
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

    newElement.classList.add(classForNewEl);
    newElement.textContent = content;

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

const updateProjectsContent = function (arr) {
  arr.map((project) => {
    const cloneProjectCard = cloneElement(sectionProjects, ".col");
    const projectLinks = cloneProjectCard.querySelector(".project-links");
    const textContentList = [
      {
        el: cloneProjectCard.querySelector(".card-title"),
        content: project.title,
      },
      { el: cloneProjectCard.querySelector("p"), content: project.description },
      {
        el: projectLinks.firstElementChild.firstChild,
        content: project.urlText,
      },
    ];
    const attrList = [
      {
        el: cloneProjectCard.querySelector("img"),
        attr: "src",
        content: project.thumbnail,
      },
      {
        el: projectLinks.firstElementChild,
        attr: "href",
        content: project.url,
      },
      {
        el: projectLinks.lastElementChild,
        attr: "href",
        content: project.github,
      },
    ];

    updateAttribute(attrList);

    updateTextContent(textContentList);

    removeElements(cloneProjectCard, ".skills");

    createNInsertElements(
      project.skills,
      "li",
      "skills",
      cloneProjectCard.querySelector(".project-skills")
    );

    prependElement(sectionProjects.querySelector(".row"), cloneProjectCard);
  });
};

const updateExperienceContent = function (arr) {
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
      undefined,
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
    ? (btnScrollToTop.style.opacity = 100)
    : (btnScrollToTop.style.opacity = 0);
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

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section-hidden");

  observer.unobserve(entry.target);
};

const contentRevelEffect = function () {
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.05,
  });

  sections.forEach((section) => {
    section.classList.add("section-hidden");
    sectionObserver.observe(section);
  });
};

const loadData = async function (tableName, updateFunc) {
  const { data, error } = await supabase.from(tableName).select("*");

  const sortedData = data.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  if (!error) updateFunc(sortedData);
};

contentRevelEffect();
loadData("portfolio-projects", updateProjectsContent);
loadData("portfolio-experience", updateExperienceContent);
createNInsertElements(
  skillset,
  "div",
  "skills-list",
  sectionAbout.querySelector(".skills-box")
);

//Event Handler
btnScrollToTop.addEventListener("click", scrollToTop);
btnToAbout.addEventListener("click", scrollToAbout);
offcanvasItem.forEach(hideOffcanvas);
window.onscroll = function () {
  showBtn();
};
