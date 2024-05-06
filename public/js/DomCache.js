class DomCache {
    constructor(selector) {
        this.selector = selector;
        this.cacheData();
    }

    cacheData() {
        this.containers = document.querySelectorAll(this.selector);
        this.searchableData = [];
        this.containers.forEach(container => {
            const headers = container.querySelectorAll('.subject-word-container > span');
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

    getContainers() {
        return this.containers;
    }

    getSearchableData() {
        return this.searchableData;
    }

    refreshCache() {
        this.cacheData();
    }
}