import CryptoJS from 'crypto-js'

export function getToken(cipherToken: string) {
    try {
        return decodeToken(cipherToken);
    } catch (e) {
        return null;
    }
}

function decodeToken(cipherToken: string) {
    try {
        if (!cipherToken) {
            throw new Error();
        }

        const bytes = CryptoJS.AES.decrypt(cipherToken, process.env.SECRET_COOKIE_PASSWORD as string);
        if (!bytes) {
            throw new Error();
        }
        
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return null;
    }
}