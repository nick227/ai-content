class WordMapSearch {
    constructor(inputSelector, containerSelector, uiComponent) {
        this.input = document.querySelector(inputSelector);
        this.containerSelector = containerSelector;
        this.uiComponent = uiComponent;
        this.debounceTimer = null; // Initialize debounce timer once per instance
        this.input.value = '';  // Reset input value on load
        this.setupInputListener();
        this.refreshDOMCache();  // Initial cache and setup
    }

    refreshDOMCache() {
        this.containers = document.querySelectorAll(this.containerSelector);
        this.searchableData = [];
        this.containers.forEach(container => {
            const headers = container.querySelectorAll('h3 span, h2 > span');
            const lists = container.querySelectorAll('ul');
            const listItems = container.querySelectorAll('ul li');
            const data = {
                container,
                headers: Array.from(headers).map(header => ({ element: header, text: header.textContent.toLowerCase() })),
                lists: Array.from(lists),
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
        this.refreshDOMCache(); // Consider optimizing this if the DOM does not change frequently

        this.searchableData.forEach(({ container, headers, lists, listItems }) => {
            let foundMatch = false;

            headers.forEach(({ element, text }) => {
                const match = text.startsWith(search);
                this.toggleFoundState(element, match);
                foundMatch = foundMatch || match;
            });

            listItems.forEach(({ element, text }) => {
                const match = text.includes(search);
                this.toggleFoundState(element, match);
                foundMatch = foundMatch || match;
            });

            if (foundMatch) {
                this.showContainer(container);
                this.scrollListsToFirstFoundElement(lists, listItems);
            } else {
                this.hideContainer(container);
            }
        });
    }

    toggleFoundState(element, isFound) {
        if (element) {
            element.classList.toggle('found', isFound);
        }
    }

    showContainer(container) {
        if (container) {
            container.style.display = 'block';
        }
    }

    hideContainer(container) {
        if (container) {
            container.style.display = 'none';
        }
    }
    
    scrollListsToFirstFoundElement(lists, listItems) {
        lists.forEach(list => {
            const foundItems = listItems.filter(({ element }) => element.parentElement === list && element.classList.contains('found'));
            if (foundItems.length > 0) {
                // Find the first matched item and adjust the list scroll position
                const firstFound = foundItems[0].element;
                const scrollTop = firstFound.offsetTop - list.offsetTop - (list.clientHeight / 2) + (firstFound.clientHeight / 2);
                list.scrollTop = scrollTop;
            }
        });
    }
    
}
