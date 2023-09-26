import styles from "@/styles/ui/select.module.css";

export function Select(props: any) {
    const {
        onChange, onBlur,
        name, label, value, options, placeholder,
        error,
        helpText,
    } = props;

    return (
        <div className={styles['select-container'] + (error ? ' ' + styles.error : '')}>
            {label && <div className={styles.name}>{label}</div>}
            <div className={styles.wrapper}>
                <select
                    className={styles.select}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={value}
                >
                    {
                        placeholder && <option key='disabled' value='' disabled={true}>{placeholder}</option>
                    }
                    {
                        options.map((o:any) => <option key={o.value} value={o.value}>{o.label}</option>)
                    }
                </select>
            </div>
            {error && <div className={styles.msg}>{error.message}</div>}
            {helpText && <div className={styles.info}>{helpText}</div>}
        </div>
    );
}