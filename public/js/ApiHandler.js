class ApiHandler {
    async fetchApiData(apiInfo) {
        try {
            return Promise.all(apiInfo.map(info =>
                fetch(info.path).then(res => res.json())
            ));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return [];
        }
    }

    async postRequest(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to post data:', error);
            throw error;
        }
    }
}