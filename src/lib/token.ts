import CryptoJS from 'crypto-js'

export function getToken(cipherToken: string) {
    try {
        if (!cipherToken) {
            return null;
        }

        const bytes = CryptoJS.AES.decrypt(cipherToken, process.env.SECRET_COOKIE_PASSWORD as string);
        if (!bytes) {
            return null;
        }

        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return null;
    }
}