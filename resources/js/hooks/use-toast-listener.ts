import { usePage } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import { createElement, useEffect } from 'react';
import { toast } from 'sonner';
import { EmphasisDecoration } from '@/decorations/ui/emphasis-decoration';
import EmphasisVariant from '@/wayfinder/App/Enums/Frontend/EmphasisVariant';

export function useToastListener() {
    const { toast: toastResponse } = usePage().flash;

    useEffect(() => {
        if (toastResponse) {
            switch (toastResponse.variant) {
                case 'affirmative':
                    toast.success(toastResponse.message);
                    break;
                case 'informative':
                    toast.info(toastResponse.message);
                    break;
                case 'preventive':
                    toast.warning(toastResponse.message);
                    break;
                case 'destructive':
                    toast.error(toastResponse.message);
                    break;
                case 'neutral':
                    toast(toastResponse.message, {
                        icon: createElement(EmphasisDecoration[EmphasisVariant.NEUTRAL].icon, { className: 'size-4' }),
                        style: {
                            '--normal-bg': 'var(--neutral-foreground)',
                            '--normal-border': 'var(--neutral)',
                            '--normal-text': 'var(--neutral)',
                        } as CSSProperties,
                    });
                    break;
                case 'interrogative':
                    toast(toastResponse.message, {
                        icon: createElement(EmphasisDecoration[EmphasisVariant.INTERROGATIVE].icon, { className: 'size-4' }),
                        style: {
                            '--normal-bg': 'var(--interrogative-foreground)',
                            '--normal-border': 'var(--interrogative)',
                            '--normal-text': 'var(--interrogative)',
                        } as CSSProperties,
                    });
                    break;
                default:
                    toast(toastResponse.message);
                    break;
            }
        }
    }, [toastResponse]);
}
