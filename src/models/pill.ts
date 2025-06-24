// -- pill --
// Predstavlja jedan lek koji korisnik uzima
export interface Pill {
    id?: number;              // ID leka (generiše se automatski)
    user_id?: number;         // ID korisnika kome lek pripada
    name: string;             // Naziv leka (obavezno)
    dosage?: string;          // Doza leka (npr. "500mg")
    frequency?: string;       // Učestalost uzimanja (npr. "2 puta dnevno")
    time?: string;            // Vremena uzimanja (čuvana kao JSON string)
    note?: string;            // Napomena uz lek
    created_at?: string;      // Datum unosa leka
}
