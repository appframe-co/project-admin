'use client'

import { useState, useCallback } from "react";
import { Button } from "@/ui/button";
import { TBrick, TFile} from "@/types";
import styles from '@/styles/bricks/file-reference.module.css'
import { Modal } from "@/ui/modal";
import { createPortal } from "react-dom";
import { Files } from "../modals/files";

type TProp = {
    register: any;
    error: any;
    setValue: any;
    brick: TBrick;
    value?: any;
    filesRef?: TFile[];
}

export function FileReference({register, error, setValue, brick, value, filesRef=[]}: TProp) {
    const [files, setFiles] = useState<TFile[]>(filesRef);
    const [activeModalFiles, setActiveModalFiles] = useState<boolean>(false);
    const handleChangeModalFiles = useCallback(() => setActiveModalFiles(!activeModalFiles), [activeModalFiles]);

    const handleClose = () => {
        handleChangeModalFiles();
    };

    const handleClear = () => {
        setValue(null);
        setFiles([]);
    };

    return (
        <>
            {activeModalFiles && createPortal(
                    <Modal
                        large
                        open={activeModalFiles}
                        onClose={handleClose}
                        title='Select file'
                    >
                        <Files setFilesRef={setFiles} value={value} setValue={setValue} onClose={handleClose} />
                    </Modal>,
                document.body
            )}

            <div className={styles.field}>
                <div className={styles.name}>
                    <div>{brick.name}</div>
                    {value && (
                        <div className={styles.clear} onClick={handleClear}>Clear</div>
                    )}
                </div>
                <div>
                    <input style={{display: 'none'}} {...register} />
                    {!value ? <Button onClick={handleChangeModalFiles}>Select file</Button> : (
                        <div className={styles.selectedFile}>
                            <div className={styles.infoFile}>
                                <div className={styles.img}><img src={files[0].src} /></div>
                                <div className={styles.filename}>{files[0].filename}</div>
                            </div>
                            <div><Button onClick={handleChangeModalFiles}>Change</Button></div>
                        </div>
                    )}
                </div>
                <div className={styles.info}>{brick.description}</div>
                {error && <div className={styles.error}>{error.message}</div>}
            </div>
        </>
    )
}