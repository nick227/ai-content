class WordMapSearch {
    constructor(inputSelector, containerSelector, uiComponent) {
        this.input = document.querySelector(inputSelector);
        this.containerSelector = containerSelector;
        this.uiComponent = uiComponent;
        this.debounceTimer = null;
        this.input.value = '';
        this.setupInputListener();
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
        if (search.trim() === "") {
            this.showAllItems();
        } else {
            this.searchItems(search);
        }
    }

    showAllItems() {
        this.domCache.getSearchableData().forEach(({ container, headers, listItems }) => {
            headers.forEach(header => this.toggleFoundState(header.element, false));
            listItems.forEach(item => this.toggleFoundState(item.element, false));
            this.showContainer(container);
        });
    }

    searchItems(search) {
        this.domCache.getSearchableData().forEach(({ container, headers, lists, listItems }) => {
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
        element.classList.toggle('found', isFound);
    }

    showContainer(container) {
        container.style.display = 'block';
    }

    hideContainer(container) {
        container.style.display = 'none';
    }

    scrollListsToFirstFoundElement(lists, listItems) {
        lists.forEach(list => {
            const foundItems = listItems.filter(({ element }) => element.parentElement === list && element.classList.contains('found'));
            if (foundItems.length > 0) {
                const firstFound = foundItems[0].element;
                const scrollTop = firstFound.offsetTop - list.offsetTop - (list.clientHeight / 2) + (firstFound.clientHeight / 2);
                list.scrollTop = scrollTop;
            }
        });
    }
}
