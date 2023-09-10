'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function DeleteFile({fileId}: {fileId: string}) {
    const router = useRouter();

    const deleteFile = async (id: string) => {
        try {
            const res = await fetch('/internal/api/files/', {
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
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button plain onClick={() => deleteFile(fileId)}>Delete</Button>
    )
}