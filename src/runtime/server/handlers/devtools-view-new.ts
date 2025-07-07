import { readFileSync } from 'node:fs'
import { resolve } from 'pathe'

export default defineEventHandler(async (event) => {
  // Serve the built DevTools client
  try {
    // Try to read the built client index.html
    const clientPath = resolve(__dirname, '../../../dist/devtools-client/index.html')
    const html = readFileSync(clientPath, 'utf-8')
    
    setHeader(event, 'content-type', 'text/html')
    return html
  }
  catch {
    // Fallback if client is not built
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feature Flags DevTools</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #1a1a1a;
      color: #e5e5e5;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    .title {
      font-size: 2rem;
      margin-bottom: 10px;
      color: #00dc82;
    }
    .message {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.8;
    }
    .code {
      background: #2a2a2a;
      padding: 15px;
      border-radius: 8px;
      font-family: 'Monaco', 'Consolas', monospace;
      color: #00dc82;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🚩</div>
    <h1 class="title">Feature Flags DevTools</h1>
    <p class="message">DevTools client needs to be built first.</p>
    <p>To build the DevTools client, run:</p>
    <div class="code">npm run client:build</div>
    <p>Or run in development mode:</p>
    <div class="code">npm run client:dev</div>
  </div>
</body>
</html>
    `
    
    setHeader(event, 'content-type', 'text/html')
    return fallbackHtml
  }
})
