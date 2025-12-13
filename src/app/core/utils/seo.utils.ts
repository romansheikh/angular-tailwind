export function populateTemplate(template: string | undefined, params: Record<string,string|number> = {}): string | undefined {
  if (!template) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = params[key];
    return val !== undefined ? String(val) : '';
  });
}

export function mergeSeo(base: any, override: any, params: Record<string,string|number> = {}) {
  const merged = { ...base, ...override, og: { ...(base?.og ?? {}), ...(override?.og ?? {}) } };
  // populate templates:
  Object.keys(merged).forEach(k => {
    if (typeof merged[k] === 'string') merged[k] = populateTemplate(merged[k], params);
  });
  if (merged.og) {
    Object.keys(merged.og).forEach(k => {
      if (typeof merged.og[k] === 'string') merged.og[k] = populateTemplate(merged.og[k], params);
    });
  }
  return merged;
}
