'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styles from '@/styles/header.module.css'
import Image from "next/image"
import { useRouter } from "next/navigation"

function isError(data: TErrorResponse|{alerts: TAlert[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorUpdate(data: TErrorResponse|{alert: TAlert}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

type TAlert = {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
    link: string;
};

export function Alerts() {
    const router = useRouter();

    const [alerts, setAlerts] = useState<TAlert[]>([]);
    const divAlertsRef = useRef<null|HTMLDivElement>(null);
    const divAlertListRef = useRef<null|HTMLDivElement>(null);
    const [showAlertMenu, setShowAlertMenu] = useState<boolean>(false);

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!divAlertsRef.current) {
                return;
            }

            if (!event.composedPath().includes(divAlertsRef.current as HTMLDivElement) && 
                !event.composedPath().includes(divAlertListRef.current as HTMLDivElement)) {
                setShowAlertMenu(false);
            }
        };

        window.addEventListener('click', closeDropDown);

        return () => window.removeEventListener('click', closeDropDown);
    }, []);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch('/internal/api/alerts', {
                    method: 'GET',  
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson: TErrorResponse|{alerts: TAlert[]} = await res.json();
                if (isError(dataJson)) {
                    return;
                }
                setAlerts(dataJson.alerts);
            } catch(e) {
                return;
            }
        }

        fetchAlerts();
    }, []);

    useEffect(() => {
        if (typeof(EventSource) === 'undefined') {
            return;
        }

        const eventSource = new EventSource(process.env.NEXT_PUBLIC_URL_WEBHOOKS + '/alert', { withCredentials: true });
        eventSource.addEventListener('alert', (event: MessageEvent) => {
            if (event.type === 'alert') {
                const alert = JSON.parse(event.data);
                setAlerts(prevState => [alert, ...prevState]);
            }
        });

        return () => {
            eventSource.close();
        }
    }, []);

    const handleClick = async (alert: TAlert) => {
        if (!alert.read) {
            try {
                const res = await fetch('/internal/api/alerts', {
                    method: 'PUT',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: alert.id, read: true})
                });
                if (!res.ok) {
                    throw new Error('Fetch error');
                }
                const dataJson: TErrorResponse|{alert: TAlert} = await res.json();
                if (isErrorUpdate(dataJson)) {
                    return;
                }
                setAlerts(prevState => prevState.map(a => ({...a, read: a.id === alert.id || a.read})));
            } catch(e) {
                return;
            }
        }

        if (alert.link) {
            router.push(alert.link);
        }
    };

    return (
        <>
            <div ref={divAlertsRef} className={styles.alerts} onClick={() => setShowAlertMenu((prevState: any) => !prevState)}>
                {alerts.some(a => !a.read) ? 
                    <Image width={18} height={18} src='/icons/bell-alert.svg' alt='' /> : <Image width={18} height={18} src='/icons/bell.svg' alt='' />}
            </div>

            {showAlertMenu && createPortal(
                <div ref={divAlertListRef} className={styles.alertList}>
                    <div className={styles.heading}>
                        <span>Alerts</span>
                    </div>
                    {!alerts.length && <div className={styles.emptyALertsText}>Alerts about your project and account will show here</div>}
                    <ul>
                        {alerts.map(alert => (
                            <li key={alert.id} className={styles.wrapperAlert + (!alert.read ? ' '+styles.notReaded : '')} onClick={() => handleClick(alert)}>
                                {alert.link && <div className={styles.alertLink}></div>}
                                <div className={styles.alert}>
                                    <div>{alert.message}</div>
                                    <div className={styles.alertDate}>{alert.createdAt}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </>
    )
}