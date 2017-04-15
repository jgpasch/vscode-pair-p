import axios from 'axios';
import { serverSettings } from '../config/server';

export function uploadFile(file_contents) {
    return axios.post(`${serverSettings.url}create`, { file_contents });
}

export function downloadFile(file_uuid) {
    return axios.get(`${serverSettings.url}files/${file_uuid}`);
}
