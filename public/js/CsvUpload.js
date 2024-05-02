
class CsvUpload {
    constructor(fileInputId, uiComponent) {
        this.uiComponent = uiComponent;
        this.fileInput = document.getElementById(fileInputId);
        this.initEventListeners();
    }

    initEventListeners() {
        this.fileInput.addEventListener('change', e => this.processCsv(e.target.files[0]));
    }

    processCsv(file) {
        const reader = new FileReader();
        reader.onload = event => this.handleFileLoaded(event);
        reader.onerror = () => alert('Unable to read the file: ' + file.name);
        reader.readAsText(file);
    }

    handleFileLoaded(event) {
        const lines = event.target.result.split(/\r\n|\n/);
        lines.forEach(line => {
            const parts = line.split(',').map(part => part.trim());
            if (parts.length === 2) {
                this.appendCsvLine(parts[0], parts[1]);
            } else {
                alert('Invalid line format: ' + line);
            }
        });
    }

    appendCsvLine(subject, word) {
        const row = this.uiComponent.createElement('div', {class: 'row'});
        const removeLink = this.uiComponent.createElement('a', {
            href: 'javascript:void(0)',
            textContent: 'Remove',
            class: 'remove-link'
        });
        removeLink.addEventListener('click', () => this.uiComponent.removeChild(document.querySelector('.csv-rows'), row));

        row.innerHTML = `<input type="text" value="${subject}" placeholder="subject"><input type="text" value="${word}" placeholder="word">`;
        row.appendChild(removeLink);
        this.uiComponent.appendChild('.csv-rows', row);
    }
}