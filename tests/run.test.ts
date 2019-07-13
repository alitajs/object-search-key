import 'jest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { JoiSchema } from 'yaml-joi';
import { getObjectSearchKeys } from '../src/index';

interface TestCase {
  schema: JoiSchema;
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
});
