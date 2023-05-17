export function isValidTournamentName(str: string): boolean {
  if (!/^[\w\d\s-]+$/.test(str)) return false;
  if (str.trim().length === 0) return false;
  return true;
}
