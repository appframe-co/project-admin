'use client'

import styles from '@/styles/ui/text-field.module.css'

export function TextField(props: any) {
    const {
        onChange, onBlur,
        name, label, value='', type='text',
        error,
        multiline, helpText, disabled
    } = props;

    return (
        <div className={styles['textfield'] + (error ? ' ' + styles.error : '')}>
            {label && <div className={styles.name}>{label}</div>}
            {multiline && 
                <textarea
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={!value ? '' : value}
                    className={styles.textarea}
                    disabled={disabled}
                />
            }
            {!multiline && 
                <input
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={!value ? '' : value}
                    type={type}
                    className={styles.input}
                    disabled={disabled}
                />
            }
            {error && <div className={styles.msg}>{error.message}</div>}
            {helpText && <div className={styles.info}>{helpText}</div>}
        </div>
    )
}