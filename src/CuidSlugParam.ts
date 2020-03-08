import { CheminParam } from 'tumau';

export function CuidSlugParam<N extends string>(
  name: N
): CheminParam<N, string> {
  const reg = /^[a-z0-9]{7,10}$/;
  return {
    name,
    match: (...all) => {
      if (all[0] && all[0].match(reg)) {
        return { match: true, value: all[0], next: all.slice(1) };
      }
      return { match: false, next: all };
    },
    serialize: value => value,
    stringify: () => `:${name}(cuid.slug)`,
  };
}
