export function toMySQLDateTime(iso: string ): string {
    const d = new Date(iso);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}