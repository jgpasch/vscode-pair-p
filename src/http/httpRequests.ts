import axios from 'axios';
import { serverSettings } from '../config/server';

export function uploadFile(fileContents, lang) {
    return axios.post(`${serverSettings.url}files/create`, { fileContents, lang });
}

export function downloadFile(file_uuid) {
    return axios.get(`${serverSettings.url}files/${file_uuid}`);
}
