'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button';

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function DeleteMenu({menuId}: {menuId: string}) {
    const router = useRouter();

    const deleteMenu = async (id: string) => {
        try {
            const res = await fetch('/admin/internal/api/menus/', {
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
        <Button plain onClick={() => deleteMenu(menuId)}>Delete</Button>
    )
}