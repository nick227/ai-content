class UiComponent {
  constructor(domCache) {
    this.originalButtonText = "";
    this.setupListeners();
    this.domCache = domCache;
  }

  setupListeners() {
    const link = document.querySelector(`.scroll-top`);
    link.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    const toggleBtn = document.querySelector(`.toggle-view-btn`);
    toggleBtn.addEventListener("click", () => {
      this.toggleView();
    });
  }

  toggleView() {
    const target = document.querySelector("#lists");
    const existingTable = target.querySelector("table");
    console.log('existingTable', existingTable)
    if (existingTable) {
      existingTable.remove();
    } else {
      const subjectWordPairs = this.getSubjectWordPairs();
      const table = this.createCssTable(subjectWordPairs);
      target.prepend(table);
    }
  }

  createCssTable(subjectWordListArray) {
    const table = this.createElement("table", { class: "data-table" });
    const thead = this.createElement("thead");
    const headerRow = this.createElement("tr");
    const headers = ["subject", "word", "lists"].map((text) =>
      this.createElement("th", { textContent: text })
    );

    headers.forEach((header) => headerRow.appendChild(header));
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = this.createElement("tbody");
    table.appendChild(tbody);

    // Sort the array by subject
    const sortedArray = subjectWordListArray.sort((a, b) =>
      a.subject.localeCompare(b.subject)
    );

    // Create table rows from the sorted array
    sortedArray.forEach((item) => tbody.appendChild(this.createRow(item)));

    this.setupSorting(headers, tbody);

    return table;
  }

  createRow({ subject, word, lists }) {
    const row = this.createElement("tr");
    const subjectCell = this.createElement("td", { textContent: subject });
    const wordCell = this.createElement("td", { textContent: word });
    const listCountCell = this.createElement("td", {
      textContent: lists.length.toString(),
    });

    row.append(subjectCell, wordCell, listCountCell);
    return row;
  }

  createElement(tag, options = {}, properties = {}) {
    const element = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
      element[key] = value;
    });
    Object.keys(properties).forEach((prop) => {
      element.setAttribute(prop, properties[prop]);
    });
    return element;
  }

  setupSorting(headers, tbody) {
    const sortState = { column: null, ascending: true };

    headers.forEach((header, index) => {
      header.addEventListener("click", () => {
        const isAscending =
          sortState.column === index ? !sortState.ascending : true;
        sortState.column = index;
        sortState.ascending = isAscending;
        this.sortAndDisplay(tbody, index, isAscending);
        this.updateHeaderStyles(headers, index, isAscending);
      });
    });
  }

  updateHeaderStyles(headers, activeIndex, ascending) {
    headers.forEach((header, index) => {
      header.classList.remove("sorted-asc", "sorted-desc");
      if (index === activeIndex) {
        header.classList.add(ascending ? "sorted-asc" : "sorted-desc");
      }
    });
  }

  // More efficient and clear sorting function
  sortAndDisplay(tbody, columnIndex, ascending) {
    const rows = Array.from(tbody.rows);
    const isNumeric = columnIndex === 2; // Assume third column is numeric

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent;
      const cellB = rowB.cells[columnIndex].textContent;
      const valueA = isNumeric ? parseInt(cellA, 10) : cellA;
      const valueB = isNumeric ? parseInt(cellB, 10) : cellB;

      return (
        (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * (ascending ? 1 : -1)
      );
    });

    // Efficiently reattach sorted rows
    rows.forEach((row) => tbody.appendChild(row));
  }

  getSubjectWordPairs() {
    return this.domCache.searchableData.map((obj) => {
      const lists = obj.lists.map((list) => {
        const listName =
          list.parentElement.querySelector(".list-title").textContent;
        const listItems = Array.from(list.querySelectorAll("li")).map(
          (li) => li.textContent
        );
        return { listName, listItems };
      });

      return {
        subject: obj.headers[0].text,
        word: obj.headers[1].text,
        lists,
      };
    });
  }

  appendChild(selector, child) {
    const parent = document.querySelector(selector);
    if (parent) {
      parent.appendChild(child);
    }
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
            return `<label for="checkbox_${result}_${
              info.key
            }"><input class="checkbox_${
              info.key
            }" type="checkbox" id="checkbox_${result}_${
              info.key
            }" name="checkbox_${result}_${info.key}" value='${value}'>
                            ${result.display || result}
                        </label>`;
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

  showMessage(msg) {
    const statusElm = document.querySelector("#status");
    statusElm.textContent = msg;
  }

  composeWordMapElement(result) {
    if (typeof result !== "object") {
      return '<div class="wordmap-container"></div>';
    }

    const createImageElement = (name) =>
      `<img title="${name}" class="thumb" src="/uploads/images/${name}" alt="uploads/images/${name}">`;

    let html = "";
    let imagesHtml = "";
    let subjectWordHtml = `<p class="subject-word-container">`;

    Object.entries(result).forEach(([key, value]) => {
      if (key === "_id" || key === "timestamp") {
        return;
      }

      if (key === "subject") {
        subjectWordHtml += `${key}: <span style="">${value}</span>, `;
        return;
      }

      if (key === "word") {
        subjectWordHtml += `${key}: <span style="">${value}</span>`;
        return;
      }
      subjectWordHtml += "</p>";

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
        html += `<div class="list-container"><label><input name="list_selector_${result._id}_${key}" type="checkbox" data-key="${key}" value="" /><span class="list-title">${key}</span></label>${content}</div>`;
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
