document.addEventListener('DOMContentLoaded', function() {
    const domCache = new DomCache(`.wordmap-container`);
    const uiComponent = new UiComponent(domCache);
    const csvUpload = new CsvUpload('file', uiComponent);
    const dragDropHandler = new DragDropHandler('.upload-area', 'file', uiComponent);
    const wordMapSearch = new WordMapSearch('#search_input', '.wordmap-container', uiComponent, domCache);
    const imageBrowser = new ImageBrowser();
    const apiHandler = new ApiHandler();
    const dataManager = new DataManager(apiHandler, uiComponent, domCache);
    const formHandler = new FormHandler(uiComponent, dataManager);

    setupApplication(dataManager, formHandler, domCache);
});


async function setupApplication(dataManager, formHandler, domCache) {
    try {
        await dataManager.loadApiData();
        formHandler.init();
    } catch (error) {
        console.error('Error loading API data:', error);
    }
    finally {
        domCache.refreshCache();
    }
}