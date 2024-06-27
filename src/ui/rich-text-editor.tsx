'use client'

import styles from '@/styles/ui/rich-text-editor.module.css'
import Image from 'next/image';
import { useEffect } from 'react';
import { Select } from './select';

export function RichTextEditor(props: any) {
    const {
        onChange, onBlur,
        name, label, value,
        error,
        helpText, disabled, innerRef, placeholder,
        style='',
        setValue
    } = props;

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

    useEffect(() => {
        const el: Element|null = document.querySelector('.'+classNameEditor);
        if (el && !el.textContent) {
            el.innerHTML = value || '<p><br></p>';
        }
    }, [value]);

    const options = [
        {value: 'P', label: 'Paragraph'},
        {value: 'H1', label: 'Heading 1'},
        {value: 'H2', label: 'Heading 2'},
        {value: 'H3', label: 'Heading 3'},
        {value: 'H4', label: 'Heading 4'},
        {value: 'H5', label: 'Heading 5'},
        {value: 'H6', label: 'Heading 6'},
    ];

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        const text = e.clipboardData?.getData('text/plain');
        document.execCommand('insertText', false, text);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as Element;
        if (!target.textContent && e.code === 'Backspace') {
            e.preventDefault();
        }
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as Element;
        setValue(target.innerHTML);
    };
    const handleClickTextButton = (v:string) => {
        document.execCommand(v);
        updateRichText();
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
        document.execCommand('formatBlock', false, target.value);
        updateRichText();
    };

    function updateRichText() {
        const el: Element|null = document.querySelector('.'+classNameEditor);
        if (el) {
            setValue(el.innerHTML);
        }
    }

    return (
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
                    </div>
                    <div className={styles.fullscreen} onClick={handleToggleFullscreen}>
                        <Image width={18} height={18} src='/icons/rich-text-editor/fullscreen.svg' alt='' />
                    </div>
                </div>
                <div className={styles.editor + ' ' + classNameEditor} contentEditable='true' 
                    onKeyDown={(e) => handleKeyDown(e)}
                    onKeyUp={(e) => handleKeyUp(e)}
                    onPaste={(e) => handlePaste(e)}></div>
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
    )
}