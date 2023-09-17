'use client'

import { useState, useCallback } from "react";
import { Button } from "@/ui/button";
import { TBrick, TFile} from "@/types";
import styles from '@/styles/bricks/file-reference.module.css'
import { Modal } from "@/ui/modal";
import { createPortal } from "react-dom";
import { Files } from "../modals/files";
import { resizeImg } from "@/utils/resize-img";

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

            <div className={styles.image}>
                <div>{brick.name}</div>
                <div>{brick.description}</div>
                {error && <div className={styles.msg}>{error.message}</div>}

                <div>
                    <input style={{display: 'none'}} {...register} />
                    {files.length === 0 ? <Button onClick={handleChangeModalFiles}>Select file</Button> : (
                        <div>
                            <img src={resizeImg(files[0].src, {w:100, h:100})} />
                            <span>{files[0].filename}</span>
                            <Button onClick={handleChangeModalFiles}>Change</Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}