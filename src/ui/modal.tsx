import styles from '@/styles/ui/modal.module.css'
import {Button} from '@/ui/button'
import Image from 'next/image';

type TProps = {
    activator?: any, 
    open: boolean, 
    title: string, 
    onClose: any, 
    children: React.ReactNode, 
    primaryAction?: {onAction: (s: any) => void, content: string},
    secondaryActions?: any
}

export function Modal(props: TProps) {
    const {activator, open, title, onClose, children, primaryAction, secondaryActions} = props;

    return (
        <>
            {activator && <div>{activator}</div>}
            
            { open && (
                <>
                    <div className={styles.overlay} onClick={onClose}></div>
                    <div className={styles.modal}>
                        <div className={styles.container}>
                            <div className={styles.header}>
                                <div>{title && <h2>{title}</h2>}</div>
                                <Button plain onClick={onClose} size="small"><Image width={24} height={24} src='/icons/close.svg' alt='' /></Button>
                            </div>
                            {children && (
                                <div className={styles.content}>{children}</div>
                            )}
                            {(primaryAction || secondaryActions) && (
                                 <div className={styles.footer}>
                                    {secondaryActions && (
                                        <>
                                            {secondaryActions.map((secondaryAction: any, i: number) => 
                                                <Button key={i} onClick={secondaryAction.onAction}>{secondaryAction.content}</Button>
                                            )}
                                        </>
                                    )}
                                    {primaryAction && <Button primary={true} onClick={primaryAction.onAction}>{primaryAction.content}</Button>}
                                 </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}