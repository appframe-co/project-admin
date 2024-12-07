'use client'

import styles from '@/styles/ui/rich-text-editor.module.css'
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Select } from './select';
import { TFile } from '@/types';
import { Modal } from './modal';
import { Files } from '@/components/modals/files';
import { createPortal } from 'react-dom';
import { resizeImg } from "@/utils/resize-img";
import { PreviewAndEditImageRichText } from '@/components/modals/preview-edit-image-richtext';


type TImage = {
    id: string;
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    styles: {
        float: string;
    }
}
type TSelection = {
    anchorNode: Node|null;
    anchorOffset: number;
    focusNode: Node|null;
    focusOffset: number;
}

export function RichTextEditor(props: any) {
    const [activeModalFiles, setActiveModalFiles] = useState<boolean>(false);
    const [activeModalEditFile, setActiveModalEditFile] = useState<boolean>(false);
    const [image, setImage] = useState<TImage>();

    const handleChangeModalFiles = useCallback(() => setActiveModalFiles(!activeModalFiles), [activeModalFiles]);
    const handleChangeModalEditFile = useCallback(() => setActiveModalEditFile(!activeModalEditFile), [activeModalEditFile]);

    const handleClose = () => handleChangeModalFiles();
    const handleCloseEditFile = () => handleChangeModalEditFile();

    const [editorSelection, setEditorSelection] = useState<TSelection>();

    const {
        onChange, onBlur,
        name, label, value,
        error,
        helpText, disabled, innerRef, placeholder,
        style='',
        setValue
    } = props;

    const tagsProps = {
        tagP: {
            classList: ['rt-p']
        },
        tagFigure: {
            classList: ['rt-figure']
        }
    };

    useEffect(() => {
        const handleEditor = (e: MouseEvent) => {
            if (!e.target) {
                e.preventDefault();
            }

            const element = e.target as HTMLElement;
            const tagName = element.tagName;

            if (tagName === 'DIV') {
                if (!element.hasChildNodes()) {
                    element.append(createTagP());
                }
            }
            if (tagName === 'IMG') {
                const elFigure = element.parentElement as HTMLElement;
                if (elFigure.dataset.id) {
                    const {src, width, height, alt} = element as HTMLImageElement;

                    const elFigcaption: HTMLElement|null  = elFigure.querySelector('figcaption');
                    const caption = elFigcaption ? elFigcaption.innerText : '';

                    setImage({src, width, height, alt, caption, id: elFigure.dataset.id, styles: {float:elFigure.style.float}});
                    handleChangeModalEditFile();
                }
            }

            const selection = window.getSelection();
            if (selection) {
                setEditorSelection({
                    anchorNode: selection.anchorNode, 
                    anchorOffset: selection.anchorOffset, 
                    focusNode: selection.focusNode,
                    focusOffset: selection.focusOffset
                });
            }
        };

        const el: HTMLDivElement|null = document.querySelector('.'+classNameEditor);
        if (!el) {
            return;
        }

        el.addEventListener('click', handleEditor);

        return () => el?.removeEventListener('click', handleEditor);
    }, []);

    useEffect(() => {
        const el: Element|null = document.querySelector('.'+classNameEditor);
        if (el && !el.textContent) {
            el.innerHTML = value;
        }
    }, [value]);

    const fields: {ref?: any} = {};
    if (innerRef) {
        fields.ref = innerRef;
    }

    let className = styles['richtext'];
    if (error) {
        className += ' ' + styles.error;
    }
    if (style) {
        className += ' ' + styles[style];
    }

    const classNameEditor = 'rteditor_'+name.split('.')[1];

    const options = [
        {value: 'P', label: 'Paragraph'},
        {value: 'H1', label: 'Heading 1'},
        {value: 'H2', label: 'Heading 2'},
        {value: 'H3', label: 'Heading 3'},
        {value: 'H4', label: 'Heading 4'},
        {value: 'H5', label: 'Heading 5'},
        {value: 'H6', label: 'Heading 6'},
    ];

    const createTagP = (text=''): HTMLParagraphElement => {
        const p = document.createElement('p');
        p.classList.add(...tagsProps.tagP.classList);

        text = text.trim();
        if (!text) {
            p.innerHTML = '<br />';
        } else {
            p.innerText = text;
        }

        return p;
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        let text = e.clipboardData?.getData('text/plain');
        if (!text) {
            return;
        }

        text = text.trim();
        if (!text) {
            return;
        }

        const textList = text.split('\n\n');

        const textHTML = textList.map(t => createTagP(t).outerHTML).join('');

        document.execCommand('insertHTML', false, textHTML);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;

        if (!target.textContent && e.code === 'Backspace') {
            e.preventDefault();
            return;
        }

        const selection = window.getSelection();
        if (!selection) {
            e.preventDefault();
            return;
        }

        const focusNode = selection.focusNode as HTMLElement;
        const {anchorOffset, focusOffset} = selection;

        if (focusNode?.nodeName === 'FIGURE') {
            e.preventDefault();
        }

        if (e.code === 'Backspace') {
            if (focusNode?.nodeName === 'FIGURE') {
                if (focusOffset === 1) {
                    focusNode.parentNode?.removeChild(focusNode);
                }

                e.preventDefault();
                return;
            }
            if (focusNode.nodeName === 'FIGCAPTION' || focusNode?.parentNode?.nodeName === 'FIGCAPTION') {
                if (focusOffset === 0 && anchorOffset === 0) {
                    focusNode.innerText = '';
                    e.preventDefault();
                    return;
                }
            }
            if (focusNode.nodeName.startsWith('H') || focusNode?.parentNode?.nodeName.startsWith('H')) {
                if (focusOffset === 0 && anchorOffset === 0) {
                    e.preventDefault();
                    return;
                }
            }
            if (focusNode.nodeName.startsWith('P') || focusNode?.parentNode?.nodeName.startsWith('P')) {
                if (focusOffset === 0 && anchorOffset === 0) {
                    if(focusNode.nodeName === '#text' && focusNode?.parentNode?.previousSibling?.nodeName !== 'P') {
                        e.preventDefault();
                        return;
                    }
                }
            }
        }

        if (e.code === 'Enter') {
            if (focusNode?.parentNode?.nodeName === 'FIGCAPTION') {
                e.preventDefault();
                return;
            }

            const i = Array.from(target.childNodes.values()).indexOf((focusNode.parentNode as HTMLElement));

            if (focusNode?.parentNode?.nodeName.startsWith('H')) {
                e.preventDefault();

                const p = createTagP();
                const range = document.createRange();

                if (focusOffset === 0 && anchorOffset === 0) {
                    range.setStart(target, i);
                } else {
                    range.setStart(target, i+1);
                }

                range.insertNode(p);
                range.collapse(true)
                selection.removeAllRanges();
                selection.addRange(range);

                return;
            }

            if (focusNode.nodeName === 'FIGURE') {
                const p = createTagP();

                if(!focusNode.nextSibling) {
                    if (anchorOffset === 1) {
                        target.append(p);
                        selection.setBaseAndExtent(p, anchorOffset, p, focusOffset);
                    }
                } else {
                    selection.setBaseAndExtent(focusNode.nextSibling, 0, focusNode.nextSibling, 0);
                }
            }
        }
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        updateRichText(target.innerHTML);
    };
    const handleClickTextButton = (v:string) => {
        document.execCommand(v);
        updateRichText();
    };
    const handleClickInsertImg = (src: string, id: string) => {
        const figure = document.createElement('figure');
        figure.dataset.id = id;
        figure.classList.add(...tagsProps.tagFigure.classList);

        const img = document.createElement('img');
        img.src = src;
        img.width = 200;
        img.classList.add(styles.image);
        figure.append(img);

        const figcaption = document.createElement('figcaption');
        figure.append(figcaption);

        const selection = window.getSelection();
        if (!selection || !editorSelection) {
            return;
        }

        const {anchorNode, anchorOffset, focusNode, focusOffset} = editorSelection;
        if (!anchorNode || !focusNode) {
            return;
        }
        selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);

        const el: HTMLDivElement|null = document.querySelector('.'+classNameEditor);
        let prefix = '';
        if (el) {
            if (el.innerText.trim()) {
                prefix = '\n';
            }
        }

        document.execCommand("insertHTML", false, `${prefix + figure.outerHTML}`);
    };
    const handleToggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.querySelector('.richtextwrapper')?.requestFullscreen();
          }
    };
    const handleOption = (e: Event) => {
        const target = e.target as HTMLInputElement;

        const selection = window.getSelection();
        if (!selection) {
            return;
        }

        document.execCommand('formatBlock', false, target.value);

        const parentNode = selection.focusNode?.parentNode as HTMLElement;
        if (parentNode) {
            if (target.value === 'P') {
                parentNode.classList.add(...tagsProps.tagP.classList);
            }
        }

        updateRichText();
    };

    function updateRichText(innerHTML?: string) {
        setValue(innerHTML ?? (document.querySelector('.'+classNameEditor) as HTMLDivElement).innerHTML);
    }

    const handleApplyFiles = (files: TFile[], selectedFileIds: string|string[]) => {
        const file = files.find(f => selectedFileIds.includes(f.id));
        if (file) {
            handleClickInsertImg(file.src, file.id);
        }
        handleClose();
    };
    const handleApplyEditImage = (image: TImage) => {
        const el:HTMLElement|null = document.querySelector('[data-id="'+image.id+'"]');
 
        if (el) {
            el.style.float = image.styles.float;

            const elImg:HTMLImageElement|null  = el.querySelector('img');
            if (elImg) {
                elImg.width = image.width;
                elImg.height = image.height;
                elImg.alt = image.alt;
            }
            const elFigcaption:HTMLElement|null  = el.querySelector('figcaption');
            if (elFigcaption) {
                elFigcaption.innerText = image.caption;
            }
        }
    };

    return (
        <>
            {activeModalFiles && createPortal(
                    <Modal
                        large
                        open={activeModalFiles}
                        onClose={handleClose}
                        title='Select image'
                    >
                        <Files selectedFileIds={[]} handleApplyFiles={handleApplyFiles} onClose={handleClose} />
                    </Modal>,
                document.body
            )}
            {activeModalEditFile && createPortal(
                <Modal
                    open={activeModalEditFile}
                    onClose={handleCloseEditFile}
                    title='Preview and edit'
                >
                    <PreviewAndEditImageRichText image={image} handleApplyEditImage={handleApplyEditImage} onClose={handleCloseEditFile}/>
                </Modal>,
                document.body
            )}

            <div className={className}>
                {label && <div className={styles.name}>{label}</div>}
                <div className={styles.wrapper + ' richtextwrapper'}>
                    <div className={styles.controls}>
                        <div className={styles.buttons}>
                            <div className={styles.options}>
                                <Select 
                                    onChange={handleOption}
                                    options={options}
                                />
                            </div>
                            <div className={styles.textButtons}>
                                <div className={styles.textButton} onClick={(e) => handleClickTextButton('bold')}>
                                    <Image width={18} height={18} src='/icons/rich-text-editor/bold.svg' alt='' />
                                </div>
                                <div className={styles.textButton} onClick={(e) => handleClickTextButton('italic')}>
                                    <Image width={18} height={18} src='/icons/rich-text-editor/italic.svg' alt='' />
                                </div>
                                <div className={styles.textButton} onClick={(e) => handleClickTextButton('underline')}>
                                    <Image width={18} height={18} src='/icons/rich-text-editor/underline.svg' alt='' />
                                </div>
                            </div>
                            <div>
                                <div className={styles.textButton} onClick={handleChangeModalFiles}>
                                    <Image width={18} height={18} src='/icons/rich-text-editor/image.svg' alt='' />
                                </div>
                            </div>
                        </div>
                        <div className={styles.fullscreen} onClick={handleToggleFullscreen}>
                            <Image width={18} height={18} src='/icons/rich-text-editor/fullscreen.svg' alt='' />
                        </div>
                    </div>
                    <div className={styles.editor + ' ' + classNameEditor} contentEditable='true'
                        onKeyDown={(e) => handleKeyDown(e)}
                        onKeyUp={(e) => handleKeyUp(e)}
                        onPaste={(e) => handlePaste(e)}
                        onDrop={(e) => handleDrop(e)}></div>
                </div>
                <input
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    type={'hidden'}
                    value={value}
                    {...fields}
                />
                {error && <div className={styles.msg}>{error.message}</div>}
                {helpText && <div className={styles.info}>{helpText}</div>}
            </div>
        </>
    )
}