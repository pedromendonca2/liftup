function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não foi configurada.`);
  }

  return value;
}

module.exports = { requireEnv };
