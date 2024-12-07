export function resizeImg(src: string, width: number) {
    const arSrc = src.split('.');
    const ext = arSrc.pop();

    return arSrc.join('.') + '_' + width+'x' + '.'+ext;
}