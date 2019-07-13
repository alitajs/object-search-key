import 'jest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { JoiObjectSchema } from 'yaml-joi';
import { getObjectSearchKeys } from '../src/index';

interface TestCase {
  schema: JoiObjectSchema;
  cases: { input: string; output: ReturnType<typeof getObjectSearchKeys> }[];
}
const testInputPath = path.join(__dirname, './cases.yml');
const testInput: TestCase[] = yaml.load(fs.readFileSync(testInputPath, 'utf8'));

describe('Run parser', () => {
  it('api exists', () => {
    expect(getObjectSearchKeys).toBeTruthy();
  });

  it('invalid input', () => {
    expect(() => getObjectSearchKeys(null!, [])).toThrow();
    expect(() => getObjectSearchKeys('type: string', [])).toThrow();
  });

  it('parse', () => {
    testInput.forEach(({ schema, cases }) => {
      for (const { input, output } of cases) {
        const actualOutput = getObjectSearchKeys(schema, input.split(' '));
        expect(actualOutput).toEqual(output);
      }
    });
  });
});
