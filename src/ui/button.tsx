'use client'

import styles from '@/styles/ui/button.module.css'

export function Button(props: any) {
    const {
        children,
        onClick,
        plain,
        disabled,
        submit,
        primary,
        url, external=false,
        fullWidth
    } = props;

    let classList = styles['button'];
    if (primary) {
        classList += ' ' + styles['primary'];
    } else {
        classList += ' ' + styles['default'];
    }
    if (plain) {
        classList += ' plain';
    }
    if (fullWidth) {
        classList += ' ' + styles['fullWidth'];
    }

    if (url) {
        return (
            <div>
                <a target={!external ? '_self' : '_blank'} href={url} rel="noopener noreferrer">{children}</a>
            </div>
        )
    }

    return (
        <div>
            <button
                type={submit ? 'submit' : 'button'}
                onClick={onClick}
                disabled={disabled}
                className={classList}
            >{children}</button>
        </div>
    );
}