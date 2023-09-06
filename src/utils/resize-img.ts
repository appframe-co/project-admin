export function resizeImg(src: string, {w, h}:  {w: number, h: number}) {
    const arSrc = src.split('/');
    arSrc.splice(arSrc.length-1, 0, w+'x'+h);
    return arSrc.join('/')
}