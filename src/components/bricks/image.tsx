'use client'
import { useRef, useEffect } from "react";
import { Button } from "@/ui/button";
import { TBrick, TStagedTarget, TErrorValidateFile, ImageField} from "@/types";
import styles from '@/styles/bricks/image.module.css'
import { resizeImg } from "@/utils/resize-img";

export function ImageBrick(
    {brick, imagesFieldList, setImagesFieldList, uploadedImages, subjectId, setValue, structureId}: 
    {brick: TBrick, imagesFieldList: ImageField, setImagesFieldList: (fields: any) => void, uploadedImages: any, 
        subjectId: string, setValue: any, structureId: string}) 
{
    const imageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!imageRef.current) {
            return;
        }

        imageRef.current.onchange = async (event: Event) => {
            try {
                const target = event.target as HTMLInputElement;
                const result = await validateImages(target.files);
    
                if (!result) {
                    return;
                }
    
                const {errors, images} = result;
                if (errors.length) {
                    return;
                }
    
                const files = images.map((image: any) => ({
                    filename: image.name, mimeType: image.type, resource: 'image', fileSize: image.size, httpMethod: 'POST'
                }));

                const stagedTargetHandler = (s: TStagedTarget) => ({
                    mediaContentType: 'image',
                    originalSource: s.resourceUrl
                });

                const res = await fetch('/internal/api/staged_uploads_create', {
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({files})
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const {stagedTargets}: {stagedTargets: TStagedTarget[]} = await res.json();
                for (const [i, stagedTarget] of Object.entries(stagedTargets)) {
                    const formData = new FormData();

                    stagedTarget.parameters.forEach(p => formData.append(p.name, p.value));
                    formData.append('file', images[i]);

                    await fetch(stagedTarget.url, {method: 'POST', body: formData});

                    if (subjectId) {
                        const res = await fetch('/internal/api/data_create_media', {
                            method: 'POST',  
                            headers: {
                                'Content-Type': 'application/json'
                            }, 
                            body: JSON.stringify({dataId: subjectId, structureId, media: {[brick.code]: stagedTargets.map(stagedTargetHandler)}})
                        });
                        if (!res.ok) {
                            throw new Error('Fetch error');
                        }
                        const {media} = await res.json();
 
                        setValue(brick.code, [...uploadedImages, ...media[brick.code]]);
                    }
                }

                if (!subjectId) {
                    setImagesFieldList((fields: ImageField) => {
                        if (fields[brick.code]) {
                            fields[brick.code] = fields[brick.code].concat(stagedTargets.map(stagedTargetHandler));
                        } else {
                            fields[brick.code] = stagedTargets.map(stagedTargetHandler);
                        }

                        return {...fields};
                    });    
                }
            } catch (e) {
                return;
            }
        };
    }, [imageRef]);

    const chooseFiles = () => {
        if (!imageRef.current) {
            return;
        }

        imageRef.current.click();
    }

    const validateImages = async (files: FileList|null): Promise<{errors: TErrorValidateFile[], images: any}|void> => {
        if (!files) {
            return;
        }

        const errors: TErrorValidateFile[] = [];
        const images = [];

        for (const key of Object.keys(files)) {
            const file = files[+key];

            if (!file.type.match('image.*')) {
                errors.push({
                    file,
                    msg: 'The file is not an image'
                });
            } else if (file.size >= 15693887) {
                errors.push({
                    file,
                    msg: 'Image size exceeds 15MB'
                });
            } else {
                const img = new Image();
                img.src = window.URL.createObjectURL(file);

                try {
                    await new Promise<void>((resolve, reject) => {
                        img.onload = e => {
                            const loadedImage = e.currentTarget as HTMLInputElement;
                            const width = loadedImage?.width;
                            const height = loadedImage?.height;

                            if ((width > 5000 || height > 4000) && (width > 4000 || height > 5000)) {
                                reject({
                                    file,
                                    msg: 'Image resolution must not exceed 5000x4000px and 4000x5000px'
                                });
                            }

                            resolve();
                        };
                    });
                    images.push(file);
                } catch (e) {
                    errors.push(e as TErrorValidateFile);
                }
            }
        }

        return {errors, images};
    };

    const deleteTempImgField = (code: string, originalSource: string) => {
        setImagesFieldList((fields: ImageField) => {
            fields[code] = fields[code].filter(img => img.originalSource !== originalSource);

            return {...fields};
        });
    };

    const deleteUploadedImgField = (code: string, id: string) => {
        setValue(brick.code, uploadedImages.filter((img: any) => img.id !==id));
    };

    return (
        <div className={styles.image}>
            <div>{brick.name}</div>

            <div>
                <input style={{display: 'none'}} type="file" multiple accept="image/*" ref={imageRef} />
                <Button onClick={() => chooseFiles()}>Upload</Button>
            </div>

            <div className={styles.list}>
                {uploadedImages?.map((img: any, i: number) => (
                    <div className={styles.thumb} key={i}>
                        <img src={resizeImg(img.src, {w:110,h:110})} />
                        <button onClick={() => deleteUploadedImgField(brick.code, img.id)}>Delete</button>
                    </div>
                ))}
                {imagesFieldList[brick.code]?.map((img, i) => (
                    <div className={styles.thumb} key={i}>
                        <img src={img.originalSource} />
                        <button onClick={() => deleteTempImgField(brick.code, img.originalSource)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}