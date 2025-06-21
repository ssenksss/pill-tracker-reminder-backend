export interface PillLog {
    id?: number
    user_id: number
    pill_id: number
    status: 'Uzeto' | 'Preskočeno'
    taken_at?: string
}
