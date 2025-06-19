export interface PillLog {
    id?: number;
    pill_id: number;
    taken_at: string;
    status: 'uzeto' | 'preskočeno';
}
