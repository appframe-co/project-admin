import { Resource, TErrorValidateFile, TFile, TStagedTarget, TStagedUploadFile } from "@/types";
import { Button } from "@/ui/button";
import { useEffect, useRef, useState } from "react";
import styles from '@/styles/bricks/file-reference.module.css'
import { resizeImg } from "@/utils/resize-img";

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

type TProp = {
    multiple?: boolean;
    value: string|string[];
    setValue: any;
    onClose: any;
    setFilesRef: any;
}

export function Files({setFilesRef, multiple=false, value, setValue, onClose}: TProp) {
    const [selectedFileIds, setSelectedFileIds] = useState<string|string[]>(value);
    const [files, setFiles] = useState<TFile[]>([]);
    const imageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function getFiles() {
            try {
                const res = await fetch('/internal/api/files', {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson = await res.json();
                if (isError(dataJson)) {
                    throw new Error('Fetch error');
                }

                setFiles(dataJson.files);
            } catch (e) {
                console.log(e);
            }
        }
        getFiles();
    }, []);

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
                        body: JSON.stringify({files: stagedTargets.map(stagedTargetHandler)})
                    });
                    if (!res.ok) {
                        throw new Error('Fetch error');
                    }
                    const {files}: {files: TFile[]} = await res.json();

                    setFiles((prevState: TFile[]) => prevState.concat(files));
                }
            } catch (e) {
                return;
            }
        };
    }, [imageRef]);

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

    const addFiles = () => {
        if (!imageRef.current) {
            return;
        }

        imageRef.current.click();
    };

    const selectFiles = (fileId: string) => {
        if (!multiple) {
            setSelectedFileIds(fileId);
        } else {
            setSelectedFileIds(prevState => {
                const files = !Array.isArray(prevState) ? [] : prevState;
                if (files.includes(fileId)) {
                    return files.filter(id => id !== fileId);
                }
                return files.concat(fileId);
            });
        }
    };

    const applyFiles = () => {
        setValue(selectedFileIds);

        setFilesRef((prevState: TFile[]) => {
            return files.filter(f => selectedFileIds.includes(f.id));
        });

        onClose();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.heading}><span>Store library</span></div>
                    <div className={styles.linksContainer}>
                        <ul className={styles.links}>
                            <li><span>All Files</span></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.uploadArea}>
                        <input style={{display: 'none'}} type="file" multiple accept="image/*" ref={imageRef}  />
                        <Button onClick={() => addFiles()}>Add files</Button>
                    </div>
                    <div className={styles.files}>
                        {files.map(file => (
                            <div key={file.id} className={styles.file + (selectedFileIds?.includes(file.id) ? ' '+styles.active : '')} 
                                onClick={() => selectFiles(file.id)}>
                                <img src={resizeImg(file.src, {w:100, h:100})} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <Button onClick={onClose}>Cancel</Button>
                <Button primary onClick={applyFiles}>Done</Button>
            </div>
        </div>
    )
}