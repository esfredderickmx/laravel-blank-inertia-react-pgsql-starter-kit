import { App } from '@/wayfinder/types';
import ResponseVariant = App.Enums.Response.ResponseVariant;

export type Response = {
    variant: ResponseVariant,
    message: string
}
