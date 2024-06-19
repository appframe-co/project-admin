'use client'

import { TSchemaField } from "@/types";
import { Card } from "@/ui/card";
import styles from '@/styles/group-of-fields.module.css'
import { useEffect, useRef } from "react";  

type TGroupOfFields = {
    groupOfFields: {[key: string]: TSchemaField[]}, 
    names:{[key: string]: string},
    createField: (field: any) => void,
    showGroupOfFields: boolean, 
    setShowGroupOfFields: (s: any) => void
}

export function GroupOfFields({groupOfFields, names, createField, showGroupOfFields, setShowGroupOfFields}: TGroupOfFields) {
    const btnRef = useRef<null|HTMLDivElement>(null);

    useEffect(() => {
        const closeDropDown = (event: Event) => {
            if (!event.composedPath().includes(btnRef.current as HTMLDivElement)) {
                setShowGroupOfFields(false);
            }
        };

        document.body.addEventListener('click', closeDropDown);

        return () => document.body.removeEventListener('click', closeDropDown);
    }, []);


    const fields = Object.keys(groupOfFields).map((group: string) => (
        <div key={group}>
            <div className={styles.heading}>{names[group]}</div>
            <ul>
                {groupOfFields[group].map(field => (
                    <li key={field.id}>
                        <div className={styles.field} onClick={() => createField(field)}>{field.name}</div>
                    </li>
                ))}
            </ul>
        </div>
    ));

    return (
        <div ref={btnRef}>
            <div className={styles.addField} onClick={() => setShowGroupOfFields((prevState: any) => !prevState)}>+ Add field</div>

            {showGroupOfFields && (
                <div style={{position:'absolute',width:'100%',left:'0',marginTop:'6px',padding: '0px 16px',zIndex:'2'}}>
                    <Card padding={0}>{fields}</Card>
                </div>
            )}
        </div>
    )
}