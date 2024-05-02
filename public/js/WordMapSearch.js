class WordMapSearch {
    constructor(inputSelector, containerSelector, uiComponent) {
        this.input = document.querySelector(inputSelector);
        this.input.value = '';
        this.containerSelector = containerSelector;
        this.uiComponent = uiComponent;
        this.refreshDOMCache();  // Initial cache and setup
        this.setupInputListener();
    }

    refreshDOMCache() {
        this.containers = document.querySelectorAll(this.containerSelector);
        this.searchableData = [];
        this.containers.forEach(container => {
            const spans = container.querySelectorAll('h2 > span');
            const listItems = container.querySelectorAll('ul li');
            const data = {
                container,
                spans: Array.from(spans).map(span => ({ element: span, text: span.textContent.toLowerCase() })),
                listItems: Array.from(listItems).map(li => ({ element: li, text: li.textContent.toLowerCase() }))
            };
            this.searchableData.push(data);
        });
    }

    setupInputListener() {
        this.input.addEventListener('input', this.debounce(() => this.handleSearch(), 300));
    }

    debounce(callback, delay) {
        return () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(callback, delay);
        };
    }

    handleSearch() {
        const search = this.input.value.toLowerCase();
        let firstMatchFound = false;
        let matchCount = 0;
    
        // Refresh the DOM cache to ensure it's in sync with the current DOM.
        this.refreshDOMCache();
    
        if (search === '') { // Check if the search is empty
            this.searchableData.forEach(({ container, spans, listItems }) => {
                // Remove found class from all spans and list items
                spans.forEach(({ element }) => element.classList.remove('found'));
                listItems.forEach(({ element }) => element.classList.remove('found'));
                // Show all containers
                this.showContainer(container);
            });
            return; // Exit the function early as there's nothing more to process
        }
    
        this.searchableData.forEach(({ container, spans, listItems }) => {
            let foundMatch = false;
    
            spans.forEach(({ element, text }) => {
                if (text.startsWith(search)) {
                    element.classList.add('found');
                    foundMatch = true;
                } else {
                    element.classList.remove('found');
                }
            });
    
            listItems.forEach(({ element, text }) => {
                if (text.startsWith(search)) {
                    element.classList.add('found');
                    foundMatch = true;
                } else {
                    element.classList.remove('found');
                }
            });
    
            if (foundMatch) {
                this.showContainer(container);
                matchCount++;
                if (!firstMatchFound) {
                    this.scrollToContainer(container);
                    firstMatchFound = true;
                }
            } else {
                this.hideContainer(container);
            }
        });
    }    

    showContainer(container) {
        container.style.display = 'block';
    }

    hideContainer(container) {
        container.style.display = 'none';
    }

    scrollToContainer(container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
