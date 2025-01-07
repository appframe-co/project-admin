import { Resource, TErrorValidateFile, TFile, TStagedTarget, TStagedUploadFile } from "@/types";
import { Button } from "@/ui/button";
import { useEffect, useRef, useState } from "react";
import styles from '@/styles/fields/file-reference.module.css'

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

type TProp = {
    multiple?: boolean;
    selectedFileIds: string|string[];
    handleApplyFiles: (files: TFile[], selectedFileIds:string|string[])=>void;
    onClose: any;
}

export function Files({multiple=false, selectedFileIds:_selectedFileIds, onClose, handleApplyFiles}: TProp) {
    const [page, setPage] = useState<number>(1);
    const [selectedFileIds, setSelectedFileIds] = useState<string|string[]>(_selectedFileIds);
    const [files, setFiles] = useState<TFile[]>([]);
    const imageRef = useRef<HTMLInputElement>(null);
    const [errorUploading, setErrorUploading] = useState<string>();
    const [isFileProcessing, setIsFileProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (page < 1) {
            return;
        }

        async function getFiles() {
            try {
                const res = await fetch(`/internal/api/files?page=${page}`, {
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
    }, [page]);

    useEffect(() => {
        if (!imageRef.current) {
            return;
        }

        imageRef.current.onchange = async (event: Event) => {
            try {
                const target = event.target as HTMLInputElement;
                const result = await validateImages(target.files);
                if (!result) {
                    throw new Error('Error validate files');
                }
    
                const {errors, images} = result;
                if (errors.length) {
                    throw new Error('Error');
                }
                
                setIsFileProcessing(true);

                const formData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    formData.append(images[i].name, images[i])
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
                const data: TErrorResponse|{stagedTargets: TStagedTarget[]} = await res.json();
                if (isError(data)) {
                    setErrorUploading(data.description ?? '');
                    throw new Error('Error staged targets');
                }

                for (const [i, stagedTarget] of Object.entries(data.stagedTargets)) {
                    const formData = new FormData();

                    stagedTarget.parameters.forEach(p => formData.append(p.name, p.value));
                    formData.append('file', images[+i]);

                    await fetch(stagedTarget.url, {method: 'POST', body: formData});
                }

                const resPostFiles = await fetch('/internal/api/files', {
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({files: data.stagedTargets.map(stagedTargetHandler)})
                });
                if (!resPostFiles.ok) {
                    throw new Error('Fetch error');
                }
                const {files:filesData}: {files: TFile[]} = await resPostFiles.json();

                setFiles((prevState: TFile[]) => prevState.concat(filesData));
            } catch (e) {
                return;
            } finally {
                setIsFileProcessing(false);
            }
        };
    }, [imageRef]);

    const validateImages = async (files: FileList|null): Promise<{errors: TErrorValidateFile[], images: File[]}|void> => {
        if (!files || !files.length) {
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
        handleApplyFiles(files, selectedFileIds);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.heading}><span>Project library</span></div>
                    <div className={styles.linksContainer}>
                        <ul className={styles.links}>
                            <li><span>All Files</span></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.content}>
                    {errorUploading && <div className='mb20'><p>{errorUploading}</p></div>}

                    <div className={styles.uploadArea}>
                        <input style={{display: 'none'}} type="file" multiple accept="image/*" ref={imageRef}  />
                        {!isFileProcessing ? <Button onClick={() => addFiles()}>Add files</Button> : <p>Wait, file is processing...</p>}
                    </div>
                    <div className={styles.files}>
                        {files.map(file => (
                            <div key={file.id} className={styles.file + (selectedFileIds?.includes(file.id) ? ' '+styles.active : '')} 
                                onClick={() => selectFiles(file.id)}>
                                    <div className={styles.fileBorder}><div className={styles.fileBG}>
                                        {file.state === 'pending' && <div>This image uploading on background. Select or do another actions</div>}
                                        {file.state === 'fulfilled' && <img src={file.src} />}
                                    </div></div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.pagination}>
                        <Button onClick={() => setPage(prevState => prevState && prevState-1)} disabled={page < 2}>Previous</Button>
                        <Button onClick={() => setPage(prevState => prevState+1)} disabled={!files.length }>Next</Button>
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