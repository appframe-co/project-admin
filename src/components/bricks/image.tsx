'use client'
import { useRef, useEffect } from "react";
import { Button } from "@/ui/button";
import { TBrick, TStagedTarget, TErrorValidateFile, TFile, TStagedUploadFile, Resource} from "@/types";
import styles from '@/styles/bricks/image.module.css'
import { resizeImg } from "@/utils/resize-img";

export function ImageBrick(
    {brick, setValue, fileIdList=[], fileList=[], structureId, setFileList}: 
    {brick: TBrick, fileIdList?: string[], setValue: any, fileList: TFile[], structureId: string, setFileList: any}) 
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
    
                const files: TStagedUploadFile[] = images.map(image => ({
                    filename: image.name, mimeType: image.type, resource: Resource.IMAGE, fileSize: image.size, httpMethod: 'POST'
                }));

                const stagedTargetHandler = (s: TStagedTarget) => ({
                    originalSource: s.resourceUrl,
                    contentType: 'image'
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
                    formData.append('file', images[+i]);

                    await fetch(stagedTarget.url, {method: 'POST', body: formData});

                    const res = await fetch('/internal/api/files', {
                        method: 'POST',  
                        headers: {
                            'Content-Type': 'application/json'
                        }, 
                        body: JSON.stringify({structureId, files: stagedTargets.map(stagedTargetHandler)})
                    });
                    if (!res.ok) {
                        throw new Error('Fetch error');
                    }
                    const {files}: {files: TFile[]} = await res.json();

                    const fileIds = files.map(file => file.id);
                    setValue(brick.code, [...fileIdList, ...fileIds], { shouldDirty: true });
                    setFileList((prevState: TFile[]) => prevState.concat(files));
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

    const validateImages = async (files: FileList|null): Promise<{errors: TErrorValidateFile[], images: File[]}|void> => {
        if (!files) {
            return;
        }

        const errors: TErrorValidateFile[] = [];
        const images: File[] = [];

        for (const key of Object.keys(files)) {
            const file = files[+key];

            if (!file.type.match('image.*')) {
                errors.push({
                    file,
                    msg: 'The file is not an image'
                });
            } else if (file.size >= 5e+6) {
                errors.push({
                    file,
                    msg: 'Image size exceeds 5MB'
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

                            if (width > 4472 || height > 4472) {
                                reject({
                                    file,
                                    msg: 'Image resolution must not exceed 4472x4472px'
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

    const deleteUploadedImgField = async (id: string) => {
        setValue(brick.code, fileIdList.filter(fileId => fileId !== id), { shouldDirty: true });
    };

    return (
        <div className={styles.image}>
            <div>{brick.name}</div>

            <div>
                <input style={{display: 'none'}} type="file" multiple accept="image/*" ref={imageRef} />
                <Button onClick={() => chooseFiles()}>Upload</Button>
            </div>

            <div className={styles.list}>
                {fileList.filter(f => fileIdList && fileIdList.includes(f.id)).map(f => (
                    <div className={styles.thumb} key={f.id}>
                        <img src={resizeImg(f.src, {w:110,h:110})} />
                        <div onClick={() => deleteUploadedImgField(f.id)}>Delete</div>
                    </div>
                ))}
            </div>
        </div>
    )
}