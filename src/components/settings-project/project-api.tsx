import { useRouter } from 'next/navigation'
import { TextField } from '@/ui/text-field'
import { Card } from '@/ui/card'
import { Box } from '@/ui/box'

export function ProjectApi({accessToken}: {accessToken: string}) {
    const router = useRouter();

    return (
        <Card>
            <Box padding={16}>
                <TextField value={accessToken} label='Token' disabled helpText='Use this token for Project API' />
            </Box>
        </Card>
    )
}