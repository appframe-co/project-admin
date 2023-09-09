'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function DeleteEntry({structureId, id}: {structureId: string, id: string}) {
    const router = useRouter();

    const deleteEntry = async (id: string) => {
        try {
            const res = await fetch('/internal/api/entries', {
                method: 'DELETE',  
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({id})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson = await res.json();
            if (isError(dataJson)) {
                throw new Error('Fetch error');
            }

            router.refresh();
            router.push(`/structures/${structureId}`);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button plain onClick={() => deleteEntry(id)}>Delete</Button>
    )
}