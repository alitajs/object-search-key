import Joi from 'joi';
import Yaml from 'js-yaml';
import yamlJoi, { JoiObjectSchema, JoiSchema, joiSchemaParser } from 'yaml-joi';

function validate<T>(instance: T, validator: Joi.Schema): T {
  const { error, value } = validator.validate(instance);
  if (error) throw error;
  return value;
}

const ObjectKeysSchema = yamlJoi(`
type: object
isSchema: true
limitation:
  - unknown: true
  - keys:
      type:
        type: string
        isSchema: true
        limitation:
          - only: object
      limitation:
        type: array
        isSchema: true
        limitation:
          - has:
              type: object
              isSchema: true
              limitation:
                - keys:
                    keys:
                      type: object
                      isSchema: true
                - unknown: true
`);

function isSchema(val: any): val is JoiSchema {
  return !!val && typeof val === 'object' && 'isSchema' in val && !!val.isSchema;
}

function loadSchema(yaml: string | JoiSchema, loadOpts?: Yaml.LoadOptions) {
  return typeof yaml === 'string' ? Yaml.load(yaml, loadOpts) : yaml;
}

export function getObjectSearchKeys<T extends string = string>(
  yaml: string | JoiSchema,
  search: string[],
  loadOpts?: Yaml.LoadOptions,
): { [key in T]?: string[] } {
  const document: JoiObjectSchema = validate(loadSchema(yaml, loadOpts), ObjectKeysSchema);

  const keysDefine = document.limitation!.reduce(
    (prev, curr) => ('keys' in curr ? Object.assign(prev, curr.keys) : prev),
    {} as { [key: string]: any },
  );

  const ret: { [key in T]?: string[] } = {};

  Object.entries(keysDefine).forEach(kv => {
    const [key, val] = kv as [T, any];
    if (isSchema(val)) {
      if (val.limitation)
        val.limitation.forEach((limit: any) => {
          if (!('length' in limit)) return;
          limit.max = limit.length;
          delete limit.length;
        });
      const validator = joiSchemaParser(val);
      ret[key] = search.filter(str => !validator.validate(str).error);
      if (!ret[key]!.length) delete ret[key];
    } else {
      const valStr = `${val}`;
      ret[key] = search.filter(str => valStr.includes(str));
      if (!ret[key]!.length) delete ret[key];
    }
  });

  return ret;
}
