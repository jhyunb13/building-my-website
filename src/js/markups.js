export function projectCardEl(obj) {
  return `
            <div class="col">
              <div class="card">
                <picture>
                  <source
                    srcset=${obj.smallThumbnail}
                    media="(max-width: 576px)"
                  />
                  <img
                    src=${obj.thumbnailLazy}
                    data-src=${obj.thumbnail}
                    class="card-img-top lazy-img"
                    alt=${obj.altText}
                  />
                </picture>

                <div class="card-body">
                  <div class="card-heading">
                    <div class="subheading col-8">${obj.subheading}</div>
                    <h3 class="heading-title">${obj.title}</h3>
                  </div>
                  <p class="card-text">
                    ${obj.description}
                  </p>
                  <table class="card-table">
                    <tbody>
                      <tr>
                        <th>Built with</th>
                        <td>
                          <ul class="skills-container-project">
                            ${listItemEl(obj.skills, "skill-project")} 
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <th>Problem solving</th>
                        <td>
                          <button
                            type="button"
                            class="btn-underline btn-modal-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#${obj.modalID}"
                          >
                            Problem solving<svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="icon-arrow"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            class="btn-underline btn-modal-lg"
                            data-bs-toggle="modal"
                            data-bs-target="#${obj.modalID}"
                          >
                            Read more<svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="icon-arrow"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <th>Link</th>
                        <td>
                          <a
                            class="btn-underline btn-project"
                            href=${obj.url}
                            target="_blank"
                            rel="noopener"
                            >${obj.urlText}</a
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>Code</th>
                        <td>
                          <a
                            class="btn-underline btn-github"
                            href=${obj.github}
                            target="_blank"
                            rel="noopener"
                            >GitHub<svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="icon-arrow"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    `;
}

export function experienceEl(obj, i) {
  const num = ["One", "Two", "Three", "Four", "Five"];
  const isOpen = i === 0 ? "true" : "false";
  const addClass = i === 0 ? "show" : "";

  return `
              <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse${num[i]}"
                  aria-expanded=${isOpen}
                  aria-controls="collapse${num[i]}"
                >
                  <div class="job-title mb-0 flex-grow-1">
                    ${obj.jobTitle} @${obj.company}
                  </div>
                  <div class="duration mb-0 pe-3">
                    ${obj.duration}
                  </div>
                </button>
              </h2>
              <div
                id="collapse${num[i]}"
                class="accordion-collapse collapse ${addClass}"
                data-bs-parent="#experience"
              >
                <div class="accordion-body">
                  <ul class="experience-list">
                    ${listItemEl(obj.responsibilities)}
                  </ul>
                </div>
              </div>
            </div>
  `;
}

export function modalEl(obj) {
  const allContent = obj.problemSolving.map((content) => JSON.parse(content));
  const firstContent = allContent[0];

  const btnsMarkup = allContent
    .map((content, i) => {
      if (i === 0)
        return `<button class="btn-problem active" data-number="${i + 1}">${
          content.title
        }</button>`;
      else
        return `<button class="btn-problem" data-number="${i + 1}">${
          content.title
        }</button>`;
    })
    .join(" ");

  return `
        <div
          class="modal fade"
          id=${obj.modalID}
          tabindex="-1"
          aria-labelledby="${obj.modalID}-label"
        >
          <div
            class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
          >
            <div class="modal-content">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
              <div class="modal-header">
                <div>
                  <div class="subheading">Problem Solving Process</div>
                  <h3 class="heading-title" id="${obj.modalID}-label">${
    obj.title
  }</h3>
                </div>
                <div class="modal-btns">
                  ${btnsMarkup}
                </div>
              </div>
              <div class="modal-body">
                ${modalBodyEl(firstContent)}
              </div>
            </div>
          </div>
        </div>
  `;
}

export function modalBodyEl(obj) {
  const solutionContent = obj.solution;
  const solutionMarkup = solutionContent
    .map((content) => `<p>${content}</p>`)
    .join(" ");

  return `
    <div class="modal-body-heading">${obj.content}</div>
      <div class="modal-table">
        <div class="subheading">Identification</div>
        <div class="problem-identification-content">${obj.problemIdentification}</div>
        <div class="grid-border">&nbsp;</div>
        <div class="subheading">Solution</div>
        <div class="solution-content">${solutionMarkup}</div>
        <div class="grid-border">&nbsp;</div>
        <div class="subheading">Outcome</div>
        <div class="outcome-content">${obj.outcome}</div>
      </div>
  `;
}

export function errorMessageEl() {
  return `
  <div class="error-message" tabindex="0">
    <div class="error-text">
      <div class="error-header">
        <button type="button" class="btn-close" aria-label="Close"  data-bs-dismiss="error-message"></button>
        <h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-notice">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg> 
        Unable to display content</h3>
      </div>
    <div class="error-body">
      <p class="error-body-text">
      The portfolio could not be displayed due to a data loading issue. Please try refreshing the page. If the issue keeps happening, feel free to <a href="mailto:jihyun_bae@icloud.com">contact me.</a>
      </p>

      <div class="error-body-btns">
        <a href="/Resume_Jihyun_2024.pdf"
            target="_blank"
            rel="noopener">View my resume</a>
        <button type="button" class="btn-box">Try again</button>
      </div>
    </div>
    </div>
  </div>`;
}

export function listItemEl(arr, className) {
  const markup = arr.map((item) => `<li>${item}</li>`);
  const markupWithClass = arr.map(
    (item) => `<li class=${className}>${item}</li>`
  );

  return className ? markupWithClass.join(" ") : markup.join(" ");
}
