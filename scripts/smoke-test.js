const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function assertStatus(pathname, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${pathname}`);

  if (response.status !== expectedStatus) {
    throw new Error(
      `Esperado status ${expectedStatus} em ${pathname}, mas retornou ${response.status}.`
    );
  }

  return response.json();
}

async function run() {
  await assertStatus('/health');
  await assertStatus('/ready');
  await assertStatus('/api/reviews');

  console.log('Smoke test concluido com sucesso.');
}

run().catch((error) => {
  console.error('Smoke test falhou.', error.message);
  process.exit(1);
});
