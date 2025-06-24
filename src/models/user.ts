// -- user --
// Predstavlja jednog korisnika sistema
export interface User {
    id?: number;              // ID korisnika
    email: string;            // Email adresa (koristi se za login)
    password: string;         // Lozinka (heširana)
    created_at?: string;      // Datum registracije
}
