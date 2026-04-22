export type BriefFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'dimensions';

export interface BriefFieldDef {
  key: string;
  label: string;
  type: BriefFieldType;
  required?: boolean;
  help?: string;
  options?: string[];
}

export function parseBriefSchema(json: string): BriefFieldDef[] {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f) => f && typeof f.key === 'string' && typeof f.label === 'string');
  } catch {
    return [];
  }
}

export function parseBriefData(json: string): Record<string, string> {
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

export function validateBriefData(
  schema: BriefFieldDef[],
  data: Record<string, string>
): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const field of schema) {
    if (field.required) {
      const value = data[field.key];
      if (!value || !String(value).trim()) missing.push(field.label);
    }
  }
  return { ok: missing.length === 0, missing };
}
