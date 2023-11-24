import styles from '@/styles/ui/checkbox.module.css'

export function Checkbox(props: any) {
    const {
        onChange, onBlur,
        name, label, checked, value, disabled=false, innerRef,
        error,
        helpText
    } = props;

    const fields: {ref?: any} = {};
    if (innerRef) {
        fields.ref = innerRef;
    }

    return (
        <div className={styles['checkbox-container']}>
            <label className={styles['checkbox-wrapper']}>
                <input type='checkbox'
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        checked={checked}
                        disabled={disabled}
                        className={styles.checkbox}
                        value={value}
                        {...fields} />
                <div className={styles.controlIndicator} />
                {label && <div>{label}</div>}
            </label>
            {helpText && <div className={styles.info}>{helpText}</div>}
            {error && <span>{error}</span>}
        </div>
    );
}