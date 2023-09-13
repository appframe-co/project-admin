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
        <div>
            <label className={styles['checkboxWrapper']}>
                <input type='checkbox'
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        defaultChecked={checked}
                        disabled={disabled}
                        className={styles.checkbox}
                        value={value}
                        {...fields} />
                <div className={styles.controlIndicator} />
                {label && <div>{label}</div>}
                {helpText && <p>{helpText}</p>}
                {error && <span>{error}</span>}
            </label>
        </div>
    );
}