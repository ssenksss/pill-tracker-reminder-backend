export interface PillLog {
    id?: number
    user_id: number
    pill_id: number
    status: 'Uzeto' | 'Preskočeno'
    time_taken?: string
}
