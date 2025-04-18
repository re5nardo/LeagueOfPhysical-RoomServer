import axios from 'axios';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
        return true;
    } else if (typeof value !== 'number' && value === '') {
        return true;
    } else if (typeof value === 'undefined' || value === undefined) {
        return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
        return true;
    } else {
        return false;
    }
};

export async function getPublicIP(): Promise<string> {
    try {
        // const url = `https://api.ipify.org?format=json`;
        const url = `https://ifconfig.co/json`;
        const response = await axios.get(url);
        return response.data.ip;
    } catch (error) {
        return Promise.reject(error);
    }
};
