"use strict";
import * as bootstrap from "bootstrap";
import smoothscroll from "smoothscroll-polyfill";
import content from "./content.json";

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

const { skillset, projects, experiences } = content;

smoothscroll.polyfill();

//Functions
const updateSkillset = function () {
  skillset.map((skill) => {
    const newSkillsetComponent = document.createElement("div");

    sectionAbout.querySelector(".skills-box").append(newSkillsetComponent);

    newSkillsetComponent.classList.add("skills-list");
    newSkillsetComponent.textContent = skill;
  });
};

updateSkillset();

const updateProjectsContent = function () {
  projects.map((project) => {
    const cloneProjectCard = sectionProjects
      .querySelector(".col")
      .cloneNode(true);
    const projectLinks = cloneProjectCard.querySelector(".project-links");

    cloneProjectCard
      .querySelector("img")
      .setAttribute("src", project.thumbnail);

    cloneProjectCard.querySelector(".card-title").textContent = project.title;
    cloneProjectCard.querySelector("p").textContent = project.description;

    cloneProjectCard
      .querySelectorAll(".skills")
      .forEach((skill) => skill.remove());

    project.skills.map((skill) => {
      const newSkillsComponent = document.createElement("li");

      cloneProjectCard
        .querySelector(".project-skills")
        .append(newSkillsComponent);

      newSkillsComponent.classList.add("skills");
      newSkillsComponent.textContent = skill;
    });

    projectLinks.firstElementChild.setAttribute("href", project.url);
    projectLinks.firstElementChild.firstChild.textContent = project.urlText;
    projectLinks.lastElementChild.setAttribute("href", project.github);

    sectionProjects.querySelector(".row").prepend(cloneProjectCard);
  });
};

updateProjectsContent();

const updateExperienceContent = function () {
  const accordionNum = ["One", "Two", "Three", "Four", "Five"];

  experiences.map((experience) => {
    const cloneExperienceCard = sectionExperience
      .querySelector(".accordion-item")
      .cloneNode(true);

    cloneExperienceCard.querySelector(
      ".job-title"
    ).textContent = `${experience.jobTitle} @${experience.company}`;

    cloneExperienceCard.querySelector(".duration").textContent =
      experience.duration;

    cloneExperienceCard.querySelectorAll("li").forEach((el) => el.remove());

    experience.responsibilities.map((responsibilities) => {
      const newResponsibilityComponent = document.createElement("li");

      cloneExperienceCard
        .querySelector(".expeirence-responsibilities")
        .append(newResponsibilityComponent);

      newResponsibilityComponent.textContent = responsibilities;
    });

    sectionExperience.querySelector(".accordion").prepend(cloneExperienceCard);
  });

  sectionExperience.querySelectorAll(".accordion-item").forEach((item, i) => {
    const accordionBtn = item.querySelector(".accordion-button");
    const accordionCollapse = item.querySelector(".accordion-collapse");

    accordionBtn.setAttribute("data-bs-target", `#collapse${accordionNum[i]}`);
    accordionBtn.setAttribute("aria-controls", `#collapse${accordionNum[i]}`);

    item
      .querySelector(".accordion-collapse")
      .setAttribute("id", `collapse${accordionNum[i]}`);

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

updateExperienceContent();

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

contentRevelEffect();

//Event Handler
btnScrollToTop.addEventListener("click", scrollToTop);
btnToAbout.addEventListener("click", scrollToAbout);
offcanvasItem.forEach(hideOffcanvas);
window.onscroll = function () {
  showBtn();
};
