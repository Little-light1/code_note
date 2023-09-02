import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

export default function (baseURL: string) {
    // mock axios
    const mockApi = axios.create({
        headers: {
            'Content-Type': 'application/json',
        },
        baseURL,
    });
    const adapter = new MockAdapter(mockApi, {
        delayResponse: 2000,
    });
    return {
        api: mockApi,
        adapter,
    };
}
