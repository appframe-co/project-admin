'use client'

import styles from '@/styles/ui/text-field.module.css'

export function TextField(props: any) {
    const {
        onChange, onBlur,
        name, label, value, type='text',
        error,
        multiline, helpText, disabled, innerRef
    } = props;

    const fields: {ref?: any} = {};
    if (innerRef) {
        fields.ref = innerRef;
    }

    return (
        <div className={styles['textfield'] + (error ? ' ' + styles.error : '')}>
            {label && <div className={styles.name}>{label}</div>}
            {multiline && 
                <textarea
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    className={styles.textarea}
                    disabled={disabled}
                    value={value}
                    {...fields}
                />
            }
            {!multiline && 
                <input
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    type={type}
                    className={styles.input}
                    disabled={disabled}
                    value={value}
                    {...fields}
                />
            }
            {error && <div className={styles.msg}>{error.message}</div>}
            {helpText && <div className={styles.info}>{helpText}</div>}
        </div>
    )
}