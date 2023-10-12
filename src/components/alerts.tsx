'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styles from '@/styles/header.module.css'
import Image from "next/image"
import { TAlert } from "@/types"
import { useRouter } from "next/navigation"

function isError(data: TErrorResponse|{alerts: TAlert[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorUpdate(data: TErrorResponse|{alert: TAlert}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorWebhook(data: TErrorResponse|{alert: TAlert}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

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
        async function fetchWebhookAlert() {
            try {
                const res = await fetch('/internal/api/webhook-alert', {
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    fetchWebhookAlert();
                    return;
                }

                const dataJson: TErrorResponse|{alert: TAlert} = await res.json();
                if (isErrorWebhook(dataJson)) {
                    throw new Error('Fetch error');
                }

                setAlerts(prevState => [dataJson.alert, ...prevState]);

                fetchWebhookAlert();
            } catch(e) {
                return;
            }
        }

        fetchWebhookAlert();
    }, []);

    const handleClick = async (alert: TAlert) => {
        let link = '';
        if (alert.subjectType === 'entries') {
            link = `/structures/${alert.structureId}/entries/${alert.subjectId}`;
        }

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

        if (link) {
            router.push(link);
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
                                {alert.subjectId && <div className={styles.alertLink}></div>}
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