export interface Delivery {
    id: number;
    name: string;
    cost?: number | null;
    type: number;
    meta?: any;
    tips?: string;
    status: number;
    sequence?: number | null;
    created_at?: string;
    updated_at?: string;
}