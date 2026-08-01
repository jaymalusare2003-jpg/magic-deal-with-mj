import { NextRequest, NextResponse } from 'next/server';
import { SCHEMA_SQL } from '@/lib/db/schema-sql';

export async function GET(request: NextRequest) {
  return setup(request);
}

export async function POST(request: NextRequest) {
  return setup(request);
}

async function executeSQL(query: string): Promise<any> {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!accessToken || !supabaseUrl) {
    throw new Error('Missing SUPABASE_ACCESS_TOKEN or NEXT_PUBLIC_SUPABASE_URL');
  }
  
  const ref = new URL(supabaseUrl).hostname.split('.')[0];
  
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

async function setup(request: NextRequest) {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!accessToken || !supabaseUrl) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_ACCESS_TOKEN or NEXT_PUBLIC_SUPABASE_URL environment variables' },
      { status: 500 }
    );
  }

  try {
    const ref = new URL(supabaseUrl).hostname.split('.')[0];
    
    // First check if tables already exist
    const existingTables = await executeSQL(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    
    if (existingTables.length > 0) {
      return NextResponse.json({
        message: 'Schema already applied',
        tables: existingTables.map((t: any) => t.table_name),
        tableCount: existingTables.length,
      }, { status: 200 });
    }
    
    // Split schema into statements and execute in batches
    const statements = splitSQLIntoStatements(SCHEMA_SQL);
    const results: { success: number; failed: number; errors: string[] } = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    // Execute in batches
    const batchSize = 20;
    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize);
      const batchSQL = batch.join('\n');
      
      try {
        await executeSQL(batchSQL);
        results.success += batch.length;
      } catch (err) {
        // If batch fails, try individual statements
        for (const stmt of batch) {
          try {
            await executeSQL(stmt);
            results.success++;
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            results.failed++;
            results.errors.push(err + ': ' + stmt.substring(0, 100));
          }
        }
      }
    }
    
    // Verify tables
    const tableResult = await executeSQL(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    
    return NextResponse.json({
      success: true,
      statementsExecuted: results.success,
      statementsFailed: results.failed,
      errors: results.errors,
      tables: tableResult.map((t: any) => t.table_name),
      tableCount: tableResult.length,
    }, { status: 200 });
    
  } catch (err: any) {
    console.error('Setup error:', err);
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

function splitSQLIntoStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let inDollarQuote = false;
  let dollarTag = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];
    
    if (!inString && !inDollarQuote && char === '$' && next && /^[A-Za-z]/.test(next)) {
      // Start of dollar quote
      let tag = '';
      let j = i;
      while (j < sql.length && sql[j] === '$') {
        tag += sql[j];
        j++;
        while (j < sql.length && /^[A-Za-z0-9_]/.test(sql[j])) {
          tag += sql[j];
          j++;
        }
        if (sql[j] === '$') {
          tag += sql[j];
          j++;
          break;
        }
      }
      if (tag.length > 2 && tag.endsWith('$') && tag.startsWith('$')) {
        inDollarQuote = true;
        dollarTag = tag;
        current += tag;
        i = j - 1;
        continue;
      }
    }
    
    if (inDollarQuote) {
      current += char;
      if (char === '$' && sql[i+1] === dollarTag[0] && sql[i+2] === '$') {
        // Check for closing dollar tag
        const potentialTag = '$' + sql.substring(i+1, i+1+dollarTag.length-2) + '$';
        if (potentialTag === dollarTag) {
          inDollarQuote = false;
          current += sql.substring(i+1, i+dollarTag.length-1);
          i = i + dollarTag.length - 2;
        }
      }
      continue;
    }
    
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      current += char;
    } else if (inString && char === stringChar && sql[i-1] !== '\\') {
      inString = false;
      stringChar = '';
      current += char;
    } else if (!inString && char === ';') {
      if (current.trim()) {
        statements.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements;
}
