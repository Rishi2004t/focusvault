const APIS = [
  {
    name: 'CodeX (api.codex.jaagrav.in)',
    url: 'https://api.codex.jaagrav.in',
    body: JSON.stringify({ script: "print('hello')", language: 'python3', input: '' }),
  },
  {
    name: 'Wandbox (wandbox.org)',
    url: 'https://wandbox.org/api/compile.json',
    body: JSON.stringify({ code: "print 'hello'", compiler: 'gcc-head', stdin: '' }),
  },
  {
    name: 'Piston via piston.rocks',
    url: 'https://piston.rocks/api/v2/execute',
    body: JSON.stringify({ language: 'python', version: '*', files: [{ content: "print('hello')" }] }),
  },
];

async function testAll() {
  console.log('🔍 Testing all code execution APIs from the backend server...\n');
  for (const api of APIS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(api.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: api.body,
        signal: controller.signal
      });
      clearTimeout(timeout);
      const data = await res.json();
      console.log(`✅ ${api.name} → Status ${res.status}`);
      console.log('   Response:', JSON.stringify(data).slice(0, 150));
    } catch (err) {
      console.log(`❌ ${api.name} → FAILED: ${err.message}`);
    }
    console.log('');
  }
}
testAll();
