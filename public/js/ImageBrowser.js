class ImageBrowser {
    constructor() {
        this.imageContainer = document.querySelector('body');
        this.handleImageClick = this.handleImageClick.bind(this);
        this.imageContainer.addEventListener('click', this.handleImageClick);
        this.isFull = false;
    }

    handleImageClick(event) {
        if (event.target.tagName === 'IMG') {
            this.toggleSize(event.target);
        }
    }

toggleSize(img) {
    if (img.classList.contains('full-size')) {
        this.isFull = false;
        document.body.removeChild(img.parentElement);
    } else if(this.isFull === false) {
        this.isFull = true;
        const container = document.createElement('div');
        container.classList.add('full-size-container');

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', this.handleDownload);
        downloadBtn.classList.add('full-size-button');

        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.classList.add('full-size');

        // Append the image and download button to the container
        container.appendChild(newImg);
        container.appendChild(downloadBtn);

        // Append the container to the body
        document.body.appendChild(container);
    }
}
handleDownload(event) {
    const img = event.target.parentElement.querySelector('img');
    const link = document.createElement('a');
    link.download = img.src;
    link.href = img.src;
    link.click();
}
}