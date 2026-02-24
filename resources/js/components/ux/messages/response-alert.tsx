import { usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconRenderer } from '@/components/ux/typography/icon-renderer';
import { EmphasisDecoration } from '@/decorations/ui/emphasis-decoration';
import { useDecorator } from '@/hooks/use-decorator';

function ResponseAlert({ ...props }: ComponentProps<'div'>) {
    const { alert } = usePage().flash;
    const decorator = useDecorator(EmphasisDecoration, alert?.variant);

    if (!alert || !decorator) return null;

    const { icon } = decorator;

    return (
        <Alert variant={alert.variant} {...props}>
            <IconRenderer iconNode={icon} />
            <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
    );
}

export { ResponseAlert };
