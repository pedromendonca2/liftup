const { requireEnv } = require('../src/config/env');

describe('environment configuration', () => {
  const originalValue = process.env.TEST_REQUIRED_VALUE;

  afterEach(() => {
    if (originalValue === undefined) delete process.env.TEST_REQUIRED_VALUE;
    else process.env.TEST_REQUIRED_VALUE = originalValue;
  });

  it('returns a configured value', () => {
    process.env.TEST_REQUIRED_VALUE = 'configured';

    expect(requireEnv('TEST_REQUIRED_VALUE')).toBe('configured');
  });

  it('fails fast when a required value is absent', () => {
    delete process.env.TEST_REQUIRED_VALUE;

    expect(() => requireEnv('TEST_REQUIRED_VALUE')).toThrow(
      'A variável de ambiente TEST_REQUIRED_VALUE não foi configurada.',
    );
  });
});
