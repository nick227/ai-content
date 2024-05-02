class DragDropHandler {
    constructor(uploadSelector, fileInputId, uiComponent) {
        this.uploadSelector = uploadSelector;
        this.fileInputId = fileInputId;
        this.uiComponent = uiComponent;
        this.initEventListeners();
    }

    initEventListeners() {
        const uploadArea = document.querySelector(this.uploadSelector);
        const fileInput = document.getElementById(this.fileInputId);  // Get the file input element

        uploadArea.addEventListener('dragover', e => this.dragOverHandler(e));
        uploadArea.addEventListener('dragleave', () => this.dragLeaveHandler());
        uploadArea.addEventListener('drop', e => this.dropHandler(e));
        uploadArea.addEventListener('click', () => fileInput.click());  // Correctly handle click event
    }

    dragOverHandler(e) {
        e.preventDefault();
        this.uiComponent.addClass(this.uploadSelector, 'hover');
    }

    dragLeaveHandler() {
        this.uiComponent.removeClass(this.uploadSelector, 'hover');
    }

    dropHandler(e) {
        e.preventDefault();
        this.uiComponent.removeClass(this.uploadSelector, 'hover');
        if (e.dataTransfer.files.length) {
            this.uiComponent.setFiles(this.fileInputId, e.dataTransfer.files);
        }
    }
}
