class FormHandler {
  constructor(uiComponent, dataManager) {
    this.uiComponent = uiComponent;
    this.dataManager = dataManager;
    this.localStorageCheckboxes =
      JSON.parse(localStorage.getItem("checkboxes")) || {};
    this.localStorageInputs = JSON.parse(localStorage.getItem("inputs")) || {};
    this.autoCount = 0;
    this.msgTxt = 'Number of requests:';
  }

  init() {
    const form = document.querySelector("form");
    if (form) {
      // submit 
      form.addEventListener("submit", this.handleSubmit.bind(this));

      // checkbox 
      form.addEventListener("click", (e) => {
        if (e.target.type === "checkbox") {
          this.handleCheckboxChange(e);
        }
      });
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      this.setLocalStorage("checkboxes", checkboxes);

      // subject and word input 
      const subjectInput = document.querySelector("#subject_input");
      const wordInput = document.querySelector("#word_input");

      // checkbox listeners 
      this.restoreCheckboxStates();
      subjectInput.addEventListener("input", () => {
        this.toggleLocalStorage("subject_input", subjectInput.value);
      });
      wordInput.addEventListener("input", () => {
        this.toggleLocalStorage("word_input", wordInput.value);
      });

      // Set initial values from localStorage
      this.setLocalStorage("inputs", [subjectInput, wordInput]);

      // auto generate 
      this.setupAutoGenerate();
    } else {
      console.error("Form not found when attempting to attach event listeners");
    }
  }

  setLocalStorage(type, elements) {
    if (type === "checkboxes") {
      elements.forEach((checkbox) => {
        const value = checkbox.value;
        const checked = this.localStorageCheckboxes[value];
        checkbox.checked = !!checked; // Ensure the value is a boolean
      });
    } else if (type === "inputs") {
      elements.forEach((input) => {
        const value = this.localStorageInputs[input.id];
        input.value = value || ""; // Ensure inputs are set to their stored values or empty string
      });
    }
  }

  toggleLocalStorage(key, value) {
    try {
      // Ensure we use the correct object based on the key pattern
      if (key.includes("_input")) {
        this.localStorageInputs[key] = value;
        localStorage.setItem("inputs", JSON.stringify(this.localStorageInputs));
      } else {
        this.localStorageCheckboxes[key] = value;
        localStorage.setItem(
          "checkboxes",
          JSON.stringify(this.localStorageCheckboxes)
        );
      }
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }

  handleCheckboxChange(e) {
    const checkbox = e.target;
    this.toggleLocalStorage(checkbox.value, checkbox.checked);
  }

  setupAutoGenerate() {
    const autoGenerate = document.querySelector("#auto_generate");
    const autoLimit = document.querySelector("#auto_limit");

    if (autoGenerate.checked) {
      autoLimit.removeAttribute("disabled");
    } else {
      autoLimit.setAttribute("disabled", true);
    }

    autoGenerate.addEventListener("change", (e) => {
      if (e.target.checked) {
        autoLimit.removeAttribute("disabled");
      } else {
        autoLimit.setAttribute("disabled", true);
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    await this.makeRequest();
  }

  async makeRequest() {
    const cancelLabel = document.querySelector(".label_cancel");
    cancelLabel.classList.remove("hidden");
    if (this.isCanceled()) {
      this.handleCancellation();
      return;
    }

    const requests = this.collectData();
    //let msg = `${this.msgTxt} ${requests.length}`;
    //this.uiComponent.showMessage(msg);

    if (requests.length > 0) {
      try {
        this.uiComponent.showLoader();
        console.log('-----------------------');
        console.log('-- MAKING AI REQUEST --');
        console.log(requests);
        const numberOfTotalCommands = requests.reduce((acc, cur) => {
          return acc + cur.commands.length;
        }, 0);
        let commandCounter = 0;

        for (let i = 0; i < requests.length; i++) {

          for (let j = 0; j < requests[i].commands.length; j++) {
            if (this.isCanceled()) {
              this.handleCancellation();
              break;
            }
            const finalCommand = {
              "limit": requests[i].limit,
              "subject": requests[i].subject,
              "word": requests[i].word,
              "commands": [requests[i].commands[j]]
            };


            console.log(`inner loop ${i}/${j}`, requests.length);
            await this.makeAiRequest([finalCommand]);
            msg = `${this.msgTxt}: ${numberOfTotalCommands - commandCounter}`;
            this.uiComponent.showMessage(msg);
            await this.delayExecution(2000);
            commandCounter++;


          }
        }
      } catch (error) {
        console.error("Failed to generate wordmaps:", error);
        this.uiComponent.showError(error);
      } finally {
        await this.dataManager.loadApiData();
        await this.autoGenerate();
        this.uiComponent.hideLoader();
        this.uiComponent.showMessage('');
        this.restoreCheckboxStates();
        cancelLabel.classList.add("hidden");
      }
    } else {
      this.uiComponent.showAlert(
        "No valid requests. Please provide at least one subject or word."
      );
    }
  }

  isCanceled() {
    return document.querySelector("#input_cancel:checked") !== null;
  }

  handleCancellation() {
    this.uiComponent.showMessage('');
    this.autoCount = 0;
    console.log('CANCELING EARLY');
  }


  async autoGenerate() {
    const autoGenerate = document.querySelector("#auto_generate");
    const autoGenerateLimit = parseInt(
      document.querySelector("#auto_limit").value,
      10
    );
    console.log(` Checking auto-generate limit ${autoGenerate.checked} ${autoGenerateLimit}`);
    if (autoGenerate && autoGenerate.checked) {
      if (this.autoCount <= parseInt(autoGenerateLimit)) {
        console.log(`starting auto generation ${this.autoCount}`);
        this.autoCount++;
        await this.makeRequest();
      } else {
        console.log("Auto-generation limit reached");
        this.autoCount = 0;
        return;
      }
    }
  }

  restoreCheckboxStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const value = checkbox.value;
      const checked = this.localStorageCheckboxes[value];
      checkbox.checked = !!checked;
    });
  }

  collectData() {
    const limit = document.querySelector("#list_limit").value;
    const commands = this.getCommands();
    const requests = [
      ...this.collectFromListContainers(commands, limit),
      ...this.collectFromCSVRows(commands, limit),
      ...this.collectFromIndividualInputs(commands, limit)
    ];
    return requests;
  }

  getCommands() {
    const imageCheckboxes = document.querySelectorAll(".checkbox_images:checked");
    const listCheckboxes = document.querySelectorAll(".checkbox_lists:checked");
    const imageCommands = Array.from(imageCheckboxes, elm => ({ type: "dalle", method: elm.value }));
    const listCommands = Array.from(listCheckboxes, elm => elm.value);
    return [...imageCommands, ...listCommands];
  }

  collectFromListContainers(commands, limit) {
    const requests = [];
    document.querySelectorAll(".list-container input[type='checkbox']:checked")
      .forEach(selector => {
        const parentContainer = selector.closest('.list-container');
        const wordmapContainer = selector.closest('.wordmap-container');
        const subject = wordmapContainer.querySelector('.header span').innerText;
        parentContainer.querySelectorAll('ul li').forEach(item => {
          requests.push({ subject, word: item.innerText, commands, limit });
        });
      });
    return requests;
  }

  collectFromCSVRows(commands, limit) {
    const requests = [];
    document.querySelectorAll(".csv-rows .row").forEach(row => {
      const inputs = row.querySelectorAll("input");
      const subject = inputs[0].value;
      const word = inputs[1].value;
      if (subject && word) {
        requests.push({ subject, word, commands, limit });
      }
    });
    return requests;
  }

  collectFromIndividualInputs(commands, limit) {
    const subjectInput = document.querySelector("#subject_input").value;
    const wordInput = document.querySelector("#word_input").value;
    const requests = [];
    if (subjectInput || wordInput) {
      requests.push({ subject: subjectInput, word: wordInput, commands, limit });
    }
    return requests;
  }


  async makeAiRequest(requests) {
    for (let i = 0; i < requests.length; i++) {
      console.log(`Processing request ${i + 1}/${requests.length}`);
      const { subject, word, commands, limit } = requests[i];

      try {
        const response = await fetch("/api/generate/wordmaps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, word, commands, limit }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Request ${i + 1} processed successfully:`, result);
      } catch (error) {
        console.error(`Failed to process request ${i + 1}:`, error);
      }

      if (i < requests.length - 1) {
        await this.delayExecution(10000); // Delay of 10 second between requests
      }
    }
  }

  async delayExecution(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
