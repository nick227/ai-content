class DataManager {
    constructor(apiHandler, uiComponent) {
        this.apiHandler = apiHandler;
        this.uiComponent = uiComponent;
        this.apiInfo = [
            { path: '/api/chat/keys', title: 'Create Lists', elmType: 'checkbox', key: 'lists', target: '#chatgpt-options' },
            { path: '/api/dalle/keys', title: 'Make Images', elmType: 'checkbox', key: 'images', target: '#dalle-options' },
            { path: '/api/wordmaps', title: '', elmType: 'ul', key: 'wordmaps', target: '#lists' }
        ];
    }

    async loadApiData() {
        try {
            const results = await this.apiHandler.fetchApiData(this.apiInfo);
            results.forEach((data, i) => this.uiComponent.renderContentSection(this.apiInfo[i], data));
        } catch (error) {
            console.error('Error loading API data:', error);
        }
    }
}
