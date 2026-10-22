/** Optional GTG notes may be submitted with the transition; application edits must be saved first. */
export function hasUnsavedApplicationChanges(
  form: { note: string } | null,
  initial: string,
): boolean {
  if (!form) return false;
  if (!initial) return true;
  const { note: _note, ...application } = form;
  const { note: _initialNote, ...baseline } = JSON.parse(initial) as Record<string, unknown>;
  return JSON.stringify(application) !== JSON.stringify(baseline);
}
