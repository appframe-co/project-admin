'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function DeleteMenuItem({menuId, id}: {menuId: string, id: string}) {
    const router = useRouter();

    const deleteItem = async (id: string) => {
        try {
            const res = await fetch('/internal/api/menu_items', {
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
            router.push(`/menus/${menuId}/items`);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button plain onClick={() => deleteItem(id)}>Delete</Button>
    )
}