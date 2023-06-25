export function getVariableName(variable: any): string {
  const obj = { [variable]: variable };
  return Object.keys(obj)[0].constructor.name;
}
