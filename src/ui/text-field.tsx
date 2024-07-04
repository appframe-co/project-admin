'use client'

import styles from '@/styles/ui/text-field.module.css'

export function TextField(props: any) {
    const {
        onChange, onBlur,
        name, label, value, type='text',
        error,
        multiline, helpText, disabled, innerRef, prefix, suffix, placeholder,
        style=''
    } = props;

    const fields: {ref?: any} = {};
    if (innerRef) {
        fields.ref = innerRef;
    }

    let className = styles['textfield'];
    if (error) {
        className += ' ' + styles.error;
    }
    if (style) {
        className += ' ' + styles[style];
    }

    return (
        <div className={className}>
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
            {!multiline && (
                <div className={styles.wrapperInput}>
                    {prefix && <div className={styles.prefix}>{prefix}</div>}
                    <input
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        type={type}
                        className={styles.input}
                        disabled={disabled}
                        value={value}
                        placeholder={placeholder}
                        {...fields}
                    />
                    {suffix && <div className={styles.suffix}>{suffix}</div>}
                </div>
            )}
            {error && <div className={styles.msg}>{error.message}</div>}
            {helpText && <div className={styles.info}>{helpText}</div>}
        </div>
    )
}