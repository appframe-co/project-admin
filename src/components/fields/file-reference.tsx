'use client'

import { useState, useCallback } from "react";
import { Button } from "@/ui/button";
import { TField, TFile} from "@/types";
import styles from '@/styles/fields/file-reference.module.css'
import { Modal } from "@/ui/modal";
import { createPortal } from "react-dom";
import { Files } from "../modals/files";
import { PreviewAndEditFile } from "../modals/preview-edit-file";

type TProp = {
    register: any;
    error: any;
    setValue: any;
    field: TField;
    value?: any;
    filesRef?: TFile[];
}

export function FileReference({register, error, setValue, field, value, filesRef=[]}: TProp) {
    const [fileIndex, setFileIndex] = useState<number>(0);
    const [files, setFiles] = useState<TFile[]>(filesRef);
    const [activeModalFiles, setActiveModalFiles] = useState<boolean>(false);
    const [activeModalEditFile, setActiveModalEditFile] = useState<boolean>(false);
    const handleChangeModalFiles = useCallback(() => setActiveModalFiles(!activeModalFiles), [activeModalFiles]);
    const handleChangeModalEditFile = useCallback(() => setActiveModalEditFile(!activeModalEditFile), [activeModalEditFile]);

    const handleClose = () => handleChangeModalFiles();
    const handleCloseEditFile = () => handleChangeModalEditFile();

    const handleClear = () => {
        setValue(null);
        setFiles([]);
    };

    const handleEditFile = (i=0) => {
        setFileIndex(i);
        handleChangeModalEditFile();
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
            {activeModalEditFile && createPortal(
                    <Modal
                        open={activeModalEditFile}
                        onClose={handleCloseEditFile}
                        title='Preview and edit'
                    >
                        <PreviewAndEditFile fileIndex={fileIndex} files={files} setFiles={setFiles} onClose={handleCloseEditFile}/>
                    </Modal>,
                document.body
            )}

            <div className={styles.field}>
                <div className={styles.name}>
                    <div>{field.name}</div>
                    {value && (
                        <div className={styles.clear} onClick={handleClear}>Clear</div>
                    )}
                </div>
                <div>
                    <input style={{display: 'none'}} {...register} />
                    {!value ? <Button onClick={handleChangeModalFiles}>Select file</Button> : (
                        <div className={styles.selectedFile}>
                            <div className={styles.infoFile}>
                                <div className={styles.img} onClick={() => handleEditFile()}><img src={files[0].src} /></div>
                                <div className={styles.filename}>{files[0].filename}</div>
                            </div>
                            <div><Button onClick={handleChangeModalFiles}>Change</Button></div>
                        </div>
                    )}
                </div>
                <div className={styles.info}>{field.description}</div>
                {error && <div className={styles.error}>{error.message}</div>}
            </div>
        </>
    )
}