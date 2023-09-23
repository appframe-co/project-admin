'use client'

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/ui/button";
import { TBrick, TFile} from "@/types";
import styles from '@/styles/bricks/file-reference.module.css'
import { Modal } from "@/ui/modal";
import { createPortal } from "react-dom";
import { Files } from "../modals/files";
import { resizeImg } from "@/utils/resize-img";
import { PreviewAndEditFile } from "../modals/preview-edit-file";

type TProp = {
    register: any;
    error: any;
    setValue: any;
    brick: TBrick;
    value?: any;
    filesRef?: TFile[];
    watchGlobal: any;
}
type TRect = {
    top: number, left: number, width: number
}

export function ListFileReference({watchGlobal, register, error, setValue, brick, value=[], filesRef=[]}: TProp) {
    const divInputListRef = useRef<null|HTMLDivElement>(null);
    const divInputRef = useRef<null|HTMLDivElement>(null);
    const [showFields, setShowFields] = useState<boolean>(false);
    const [rect, setRect] = useState<TRect>();
    const [fileIndex, setFileIndex] = useState<number>(0);
    const [files, setFiles] = useState<TFile[]>(filesRef);
    const [activeModalFiles, setActiveModalFiles] = useState<boolean>(false);
    const [activeModalEditFile, setActiveModalEditFile] = useState<boolean>(false);

    const handleChangeModalFiles = useCallback(() => setActiveModalFiles(!activeModalFiles), [activeModalFiles]);
    const handleChangeModalEditFile = useCallback(() => setActiveModalEditFile(!activeModalEditFile), [activeModalEditFile]);
    
    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!divInputRef.current) {
                return;
            }

            if (!event.composedPath().includes(divInputRef.current as HTMLDivElement) && 
                !event.composedPath().includes(divInputListRef.current as HTMLDivElement)
                ) {
                setShowFields(false);
            }
        };

        window.addEventListener('click', closeDropDown);

        return () => window.removeEventListener('click', closeDropDown);
    }, []);

    useEffect(() => {
        if (!divInputRef.current) {
            return;
        }

        const rect = divInputRef.current.getBoundingClientRect();
        setRect({top: rect.top + window.scrollY, left: rect.left, width: rect.width});
    }, [watchGlobal]);

    const handleClose = () => handleChangeModalFiles();
    const handleCloseEditFile = () => handleChangeModalEditFile();

    const handleDeleteFile = (fileId: string) => {
        setValue(value.filter((id:string) => id !== fileId));
        setFiles(prevState => prevState.filter(f => f.id !== fileId));
    }

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
                        <Files setFilesRef={setFiles} value={value} multiple={true} setValue={setValue} onClose={handleClose} />
                    </Modal>,
                document.body
            )}

            {activeModalEditFile && createPortal(
                    <Modal
                        open={activeModalEditFile}
                        onClose={handleCloseEditFile}
                        title='Preview and edit'
                    >
                        <PreviewAndEditFile setFiles={setFiles} fileIndex={fileIndex} files={files}  onClose={handleCloseEditFile}/>
                    </Modal>,
                document.body
            )}

            <div ref={divInputRef} className={styles.field} onClick={() => setShowFields((prevState: any) => !prevState)}>
                <div className={styles.name}>{brick.name}</div>
                <select style={{display: 'none'}} {...register} multiple />
                <div className={styles.input + (error ? ' '+styles.errorInput : '')}>
                    <div className={styles.filename}>{files.map(f => f.filename).join(' • ')}</div>
                    <div>{files.length} {files.length > 1 ? 'items' : 'item'}</div>
                </div>
                <div className={styles.info}>{brick.description}</div>
            </div>
            {showFields && createPortal(
                <div ref={divInputListRef} style={{position:'absolute',width: rect?.width,top:rect?.top,left:rect?.left}}>
                    <div className={styles.wrapperList}>
                        <div className={styles.containerList}>
                            <div className={styles.name}>{brick.name}</div>
                            <ul className={styles.selectedFiles}>
                                {files.map((file, i) => (
                                    <div key={file.id} className={styles.selectedFile}>
                                        <div className={styles.infoFile}>
                                            <div className={styles.img} onClick={() => handleEditFile(i)}><img src={file.src} /></div>
                                            <div className={styles.filename}>{file.filename}</div>
                                        </div>
                                        <div><Button onClick={() => handleDeleteFile(file.id)}>Delete</Button></div>
                                    </div>
                                ))}
                            </ul>
                            <Button onClick={handleChangeModalFiles}>Select files</Button>
                            {error && <div className={styles.error}>{error?.message}</div>}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}