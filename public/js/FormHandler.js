class FormHandler {
    constructor(uiComponent, dataManager) {
        this.uiComponent = uiComponent;
        this.dataManager = dataManager;
        this.initEventListeners();
    }

    initEventListeners() {
        const form = document.querySelector('form');
        form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const requests = this.collectData();

        if (requests.length > 0) {
            try {
                this.uiComponent.showLoader();
                await this.makeAiRequest(requests);
                this.dataManager.loadApiData();
            } catch (error) {
                console.error('Failed to generate wordmaps:', error);
                this.uiComponent.showError(error);
            } finally {
                this.uiComponent.hideLoader();
            }
        } else {
            this.uiComponent.showAlert('No valid requests. Please provide at least one subject or word.');
        }
    }

    collectData() {
        const limit = document.querySelector('#limit').value;
        const csvRows = Array.from(document.querySelectorAll('.csv-rows .row'));
        const requests = [];
        const imageCheckboxes = [...document.querySelectorAll('.checkbox_images:checked')];
        const listCheckboxes = [...document.querySelectorAll('.checkbox_lists:checked')];
        const imageCommands = imageCheckboxes.map(elm => ({ type: 'dalle', method: elm.value }));
        const listCommands = listCheckboxes.map(elm => elm.value);
        const commands = [...imageCommands, ...listCommands];

        csvRows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            const subject = inputs[0].value;
            const word = inputs[1].value;
            if (subject || word) {
                requests.push({ subject, word, commands, limit });
            }
        });

        const subjectInput = document.querySelector('#subject_input').value;
        const wordInput = document.querySelector('#word_input').value;
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
                const response = await fetch('/api/generate/wordmaps', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subject, word, commands, limit })
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
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}