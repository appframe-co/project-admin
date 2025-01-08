'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function DeleteSection({contentId, id}: {contentId: string, id: string}) {
    const router = useRouter();

    const deleteSection = async (id: string) => {
        try {
            const res = await fetch('/admin/internal/api/sections', {
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
            router.push(`/contents/${contentId}/sections`);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button plain onClick={() => deleteSection(id)}>Delete</Button>
    )
}