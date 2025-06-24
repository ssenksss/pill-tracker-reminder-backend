// --pillLog
// Predstavlja zapis da li je lek uzet ili preskočen
export interface PillLog {
    id?: number;                       // ID loga
    user_id: number;                  // ID korisnika
    pill_id: number;                  // ID leka na koji se log odnosi
    status: 'Uzeto' | 'Preskočeno';   // Status – da li je lek uzet
    taken_at?: string;                // Vreme kada je lek uzet
}
