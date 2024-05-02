class ImageBrowser {
    constructor() {
        this.imageContainer = document.querySelector('body');
        this.imageContainer.addEventListener('click', this.handleImageClick);
    }

    handleImageClick(event) {
        if (event.target.tagName === 'IMG') {
            this.toggleSize(event.target);
        }
    }

    toggleSize() {
        
    }
}
