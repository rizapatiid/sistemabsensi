const { spawn } = require('child_process');
const fs = require('fs');

const mcpProcess = spawn('npx', ['hostinger-api-mcp'], {
  env: { ...process.env, HOSTINGER_API_TOKEN: 'bNIB2fUwvHHFRwOowf6ATJOJdqLbr8ulnFQxmxpt4cb9b137' },
  stdio: ['pipe', 'pipe', 'inherit'],
  shell: true
});

mcpProcess.stdout.on('data', (data) => {
  const str = data.toString();
  console.log(`Received from MCP: ${str.substring(0, 100)}...`);
  
  if (str.includes('"id":1')) {
    mcpProcess.stdin.write(JSON.stringify({
      jsonrpc: "2.0", id: 2, method: "tools/list"
    }) + '\n');
  } else if (str.includes('"id":2')) {
    fs.writeFileSync('mcp-tools.json', str);
    console.log('Saved tools to mcp-tools.json');
    process.exit(0);
  }
});

mcpProcess.on('error', (err) => {
  console.error('Spawn error:', err);
});

const initMsg = {
  jsonrpc: "2.0", id: 1, method: "initialize",
  params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1" } }
};
mcpProcess.stdin.write(JSON.stringify(initMsg) + '\n');
