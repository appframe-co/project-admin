'use client'

import { TSchemaBrick } from "@/types";
import { Card } from "@/ui/card";
import styles from '@/styles/group-of-bricks.module.css'
import { useEffect, useRef } from "react";  

type TGroupOfBricks = {
    groupOfBricks: {[key: string]: TSchemaBrick[]}, 
    names:{[key: string]: string},
    createBrick: (brick: any) => void,
    showGroupOfBricks: boolean, 
    setShowGroupOfBricks: (s: any) => void
}

export function GroupOfBricks({groupOfBricks, names, createBrick, showGroupOfBricks, setShowGroupOfBricks}: TGroupOfBricks) {
    const btnRef = useRef<null|HTMLDivElement>(null);

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!event.composedPath().includes(btnRef.current as HTMLDivElement)) {
                setShowGroupOfBricks(false);
            }
        };

        document.body.addEventListener('click', closeDropDown);

        return () => document.body.removeEventListener('click', closeDropDown);
    }, []);


    const bricks = Object.keys(groupOfBricks).map((group: string) => (
        <div key={group}>
            <div className={styles.heading}>{names[group]}</div>
            <ul>
                {groupOfBricks[group].map(brick => (
                    <li key={brick.id}>
                        <div className={styles.brick} onClick={() => createBrick(brick)}>{brick.name}</div>
                    </li>
                ))}
            </ul>
        </div>
    ));

    return (
        <div ref={btnRef}>
            <div className={styles.addBrick} onClick={() => setShowGroupOfBricks((prevState: any) => !prevState)}>+ Add brick</div>

            {showGroupOfBricks && (
                <div style={{position:'absolute',width:'100%',left:'0',marginTop:'6px',padding: '0px 16px'}}>
                    <Card padding={0}>{bricks}</Card>
                </div>
            )}
        </div>
    )
}