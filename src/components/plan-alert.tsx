'use client'

import styles from '@/styles/plan-alert.module.css'
import { Box } from '@/ui/box'
import { Button } from '@/ui/button'
import Link from 'next/link'
import { createPortal } from 'react-dom'

export function PlanAlert({trialFinishedAt}: {trialFinishedAt:Date|null}) {
    if (!trialFinishedAt) {
        return null;
    }

    const trialFinishedAtTimestamp = new Date(trialFinishedAt).getTime();

    let days = 0;
    const now = Date.now();
    if (now < trialFinishedAtTimestamp) {
        days = Math.floor((trialFinishedAtTimestamp-now)/(3600*24*1000));
    }

    if (days < 0) {
        return <></>;
    }

    return createPortal(
        <div className={styles.planAlert}>
            <div className={styles.banner}>
                <Box padding={16}>
                    <span className={styles.heading}>
                        {days === 0 && 'Today left in your trial'}
                        {days === 1 && days + 'day left in your trial'}
                        {days > 1 && days + 'days left in your trial'}
                    </span>
                    <Link href='/access_account/pricing'><Button fullWidth>Pick your plan</Button></Link>
                </Box>
            </div>
        </div>, document.body)
}