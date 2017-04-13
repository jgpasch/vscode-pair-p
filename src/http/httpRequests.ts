import axios from 'axios';

export function uploadFile(fileContents, lang) {
    return axios.post('http://localhost:8000/files/create', { fileContents, lang });
}
