'use client'

import styles from '@/styles/ui/radio-button.module.css'

export function RadioButton(props: any) {
    const {
        onChange, onBlur,
        name, label, checked, value, innerRef,
        error,
        helpText
    } = props;

    const fields: {ref?: any} = {};
    if (innerRef) {
        fields.ref = innerRef;
    }

    return (
        <div>
            <label className={styles['radio-container']}>
                <input type="radio"
                       onChange={onChange}
                       onBlur={onBlur}
                       name={name}
                       defaultChecked={checked}
                       className={styles.radio}
                       value={value}
                       {...fields} />
                <div className={styles.indicator} />
                {label && <div>{label}</div>}
                {error && <div className={styles.msg}>{error.message}</div>}
                {helpText && <div className={styles.info}>{helpText}</div>}
            </label>
        </div>
    );
}