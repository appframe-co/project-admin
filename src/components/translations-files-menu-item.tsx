import styles from '@/styles/form-translations.module.css'
import { TFile, TItem } from '@/types';
import { Modal } from '@/ui/modal';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { PreviewAndEditTranslationFileMenuItem } from './modals/preview-edit-translation-file-menu-item';

type TProps = {
    menuId: string;
    lang: string;
    files: TFile[];
    item: TItem;
    fieldsFiles: {key: string, name: string, type: string}[];
}

export function TranslationFilesMenuItem({menuId, lang, files, fieldsFiles, item}: TProps) {
    const [fileId, setFileId] = useState<string|null>(null);
    const [fileKey, setFileKey] = useState<string|null>(null);
    const [activeModalEditFile, setActiveModalEditFile] = useState<boolean>(false);
    const handleChangeModalEditFile = useCallback(() => setActiveModalEditFile(!activeModalEditFile), [activeModalEditFile]);

    const handleCloseEditFile = () => handleChangeModalEditFile();
    const handleEditFile = (fileId:string, key:string) => {
        setFileId(fileId);
        setFileKey(key);
        handleChangeModalEditFile();
    };

    const filesJSX = fieldsFiles.map(field => {
        if (!field.type.startsWith('list.')) {
            const file = files.find(f => f.id === item.doc[field.key]);
            if (file) {
                return (
                    <div key={file.id} className={styles.file} onClick={() => handleEditFile(file.id, field.key)}>
                        <div className={styles.fileBorder}><div className={styles.fileBG}><img src={file.src} /></div></div>
                    </div>
                )
            }
        }

        if (field.type.startsWith('list.')) {
            return files.filter(f => item.doc[field.key].includes(f.id)).map(file => (
                <div key={file.id} className={styles.file} onClick={() => handleEditFile(file.id, field.key)}>
                    <div className={styles.fileBorder}><div className={styles.fileBG}><img src={file.src} /></div></div>
                </div>
            ))
        }
    });

    return (
        <>
            {activeModalEditFile && createPortal(
                    <Modal
                        open={activeModalEditFile}
                        onClose={handleCloseEditFile}
                        title='Preview and edit'
                    >
                        <PreviewAndEditTranslationFileMenuItem menuId={menuId} lang={lang} 
                        fileId={fileId} fileKey={fileKey} file={files.find(f => f.id === fileId)} onClose={handleCloseEditFile}/>
                    </Modal>,
                document.body
            )}

            <div className={styles.files}>
               {filesJSX}
            </div>
        </>
    )
}