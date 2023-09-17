'use client'

import { useState, useCallback, useRef, useEffect } from "react";
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

export function ListFileReference({register, error, setValue, brick, value=[], filesRef=[]}: TProp) {
    const [files, setFiles] = useState<TFile[]>(filesRef);
    const [activeModalFiles, setActiveModalFiles] = useState<boolean>(false);
    const handleChangeModalFiles = useCallback(() => setActiveModalFiles(!activeModalFiles), [activeModalFiles]);
    
    const [showFields, setShowFields] = useState<boolean>(false);
    const btnRef = useRef<null|HTMLDivElement>(null);
    const divInputRef = useRef<null|HTMLDivElement>(null);

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!event.composedPath().includes(btnRef.current as HTMLDivElement)) {
                setShowFields(false);
            }
        };

        document.body.addEventListener('click', closeDropDown);

        return () => document.body.removeEventListener('click', closeDropDown);
    }, []);

    const handleClose = () => {
        handleChangeModalFiles();
    };

    const rect = divInputRef.current?.getBoundingClientRect();

    return (
        <>
            {activeModalFiles && createPortal(
                    <Modal
                        large
                        open={activeModalFiles}
                        onClose={handleClose}
                        title='Select file'
                    >
                        <Files setFilesRef={setFiles} value={value} multiple={true} setValue={setValue} onClose={handleClose} />
                    </Modal>,
                document.body
            )}

            <div ref={divInputRef} onClick={() => setShowFields((prevState: any) => !prevState)}>
                <div>{brick.name}</div>
                <div>{brick.description}</div>
                {error && <div className={styles.msg}>{error.message}</div>}
                <select style={{display: 'none'}} {...register} multiple />
                <div className={styles.input}>
                    <div>{files.map(f => f.filename).join(' • ')}</div>
                    <div>{files.length} {files.length > 1 ? 'items' : 'item'}</div>
                </div>
            </div>
            {showFields && createPortal(
                <div ref={btnRef} style={{position:'absolute',width: rect?.width,top:rect?.top,left:rect?.left}}>
                    <div className={styles.wrapperList}>
                        <div className={styles.containerList}>
                            <div>{brick.name}</div>
                            <ul>
                                {files.length > 0 && (
                                    files.map(file => (
                                        <div key={file.id}>
                                            <img src={resizeImg(file.src, {w:100, h:100})} />
                                            <span>{file.filename}</span>
                                            <Button onClick={() => setFiles(prevState => prevState.filter(f => f.id !== file.id))}>Delete</Button>
                                        </div>
                                    ))
                                )}
                            </ul>
                            <Button onClick={handleChangeModalFiles}>Select files</Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}