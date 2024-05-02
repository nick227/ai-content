document.addEventListener('DOMContentLoaded', function() {
    const uiComponent = new UiComponent();
    const csvUpload = new CsvUpload('file', uiComponent);
    const dragDropHandler = new DragDropHandler('.upload-area', 'file', uiComponent);
    const wordMapSearch = new WordMapSearch('#search_input', '.wordmap-container', uiComponent);
    const apiHandler = new ApiHandler();
    const dataManager = new DataManager(apiHandler, uiComponent);
    const formHandler = new FormHandler(uiComponent, dataManager);

    setupApplication(dataManager);
});


async function setupApplication(dataManager) {
    try {
        await dataManager.loadApiData();
        console.log('API data loaded successfully.');
    } catch (error) {
        console.error('Error loading API data:', error);
    }
}