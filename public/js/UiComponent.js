class UiComponent {
  constructor() {
    this.originalButtonText = "";
  }

  updateContent(selector, html) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = html;
    }
  }

  addClass(selector, className) {
    document.querySelector(selector)?.classList.add(className);
  }

  removeClass(selector, className) {
    document.querySelector(selector)?.classList.remove(className);
  }

  createElement(tag, options = {}) {
    const element = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
      if (key === "class") element.className = value;
      else if (key === "innerHTML") element.innerHTML = value;
      else element[key] = value;
    });
    return element;
  }

  appendChild(selector, child) {
    const parent = document.querySelector(selector);
    if (parent) {
      parent.appendChild(child);
    }
  }

  toggleProcessing(row = null) {
    document
      .querySelectorAll(".row")
      .forEach((row) => row.classList.remove("processing"));
    if (row) {
      row.classList.add("processing");
    }
  }

  showLoader() {
    const target = document.querySelector("body");
    target.classList.add("active");
    const button = document.querySelector('button[type="submit"]');
    button.disabled = true;
    this.originalButtonText = button.textContent;
    button.textContent = "Loading...";
  }

  hideLoader() {
    const target = document.querySelector("body");
    target.classList.remove("active");
    const button = document.querySelector('button[type="submit"]');
    button.disabled = false;
    button.textContent = this.originalButtonText;
  }

  removeChild(parent, child) {
    parent.removeChild(child);
  }

  setFiles(inputSelector, files) {
    const input = document.querySelector(inputSelector);
    if (input) {
      input.files = files;
    }
  }

  renderContentSection(info, results) {
    const html = this.composeHtmlForContent(info, results);
    const title = info.title ? `<h2>${info.title}</h2>` : "";
    this.updateContent(info.target, `${title}${html}`);
  }

  composeHtmlForContent(info, results) {
    if (info.elmType === "checkbox") {
      results.sort((a, b) => {
        const aValue =
          typeof a === "object" ? a.display || JSON.stringify(a) : a;
        const bValue =
          typeof b === "object" ? b.display || JSON.stringify(b) : b;
        return aValue.localeCompare(bValue);
      });
      return (
        '<div class="row">' +
        results
          .map((result) => {
            const value =
              typeof result === "object" ? JSON.stringify(result) : result;
            return `<label for="input_${result}_${
              info.key
            }"><input class="checkbox_${
              info.key
            }" type="checkbox" id="input_${result}_${
              info.key
            }" value='${value}'>${result.display || result}</label>`;
          })
          .join("") +
        "</div>"
      );
    } else if (info.elmType === "ul") {
      return `<div class="row align-top">${results
        .map((result) => this.composeWordMapElement(result))
        .join("")}</div>`;
    }
    return "";
  }

  showAlert(msg) {
    alert(msg);
  }

  composeWordMapElement(result) {
    if (typeof result !== "object") {
      return '<div class="wordmap-container"></div>';
    }

    const createImageElement = (name) =>
      `<img title="${name}" class="thumb" src="/uploads/images/${name}" alt="uploads/images/${name}">`;

    let html = "";
    let imagesHtml = "";
    let subjectWordHtml = "";

    Object.entries(result).forEach(([key, value]) => {
      if (key === "_id" || key === "timestamp") {
        return;
      }

      if (key === "subject" || key === "word") {
        subjectWordHtml += `<h5>${key}: <span>${value}</span></h5>`;
        return;
      }

      if (key === "image") {
        imagesHtml = Array.isArray(value)
          ? `<div class="images-container">${value
              .map(createImageElement)
              .join("")}</div>`
          : createImageElement(value);
        return; // Don't append imagesHtml here
      }

      if (Array.isArray(value)) {
        const content = `<ul>${value
          .map((item) => `<li>${item}</li>`)
          .join("")}</ul>`;
        html += `<div><h6>${key}</h6>${content}</div>`;
      } else {
        html += `<h5>${key}: <span>${value}</span></h5>`;
      }
    });

    subjectWordHtml = subjectWordHtml
      ? `<div class="header">${subjectWordHtml}</div>`
      : "";
    return `<div class="wordmap-container" data-id="${result._id}">${subjectWordHtml}<div class="body">${imagesHtml}${html}</div></div>`;
  }
}
