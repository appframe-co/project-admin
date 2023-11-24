import styles from '@/styles/toolbar.module.css'

export function Toolbar({tools, children}: {tools: React.ReactNode[], children?: React.ReactNode}) {
    if (!tools.length) return <></>;

    return (
        <div className={styles.toolbar}>
            <div className={styles.controls}>
                {tools.map(tool => <div className={styles.tool}>{tool}</div>)}
            </div>
        </div>
    )
}