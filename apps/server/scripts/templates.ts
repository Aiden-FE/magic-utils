export function getMigrateMainTemplate(params: { dirname: string; migrateName: string }) {
  return `import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createConnection } from 'mysql2/promise';
import { Logger } from '@nestjs/common';
import { getEnvConfig } from '@app/common';

function getConnection() {
  return createConnection({
    host: getEnvConfig('MYSQL_HOST'),
    port: getEnvConfig('MYSQL_PORT'),
    user: getEnvConfig('MYSQL_USER'),
    password: getEnvConfig('MYSQL_PASSWORD'),
    database: getEnvConfig('MYSQL_DATABASE'),
    multipleStatements: true, // 允许多语句,以便读取sql文件执行
  });
}

export async function main(): Promise<1 | -1> {
  const connection = await getConnection();
  const [result] = await connection.query(\`SELECT id, name FROM migrations WHERE name = '${params.migrateName}' LIMIT 1\`);

  if (result[0]) {
    await connection.end();
    Logger.log(\`已执行过 ${params.migrateName} 的迁移任务\`);
    return -1;
  } else {
    await connection.query(readFileSync(join(__dirname, './main.sql'), { encoding: 'utf-8' }));
    await connection.query(\`INSERT INTO migrations (name) VALUES ('${params.migrateName}')\`);
    await connection.end();
    Logger.log(\`${params.migrateName} 的迁移任务执行完成\`);
    return 1;
  }
}

export async function rollback(): Promise<1 | -1> {
  const connection = await getConnection();
  const [result] = await connection.query(\`SELECT id, name FROM migrations WHERE name = '${params.migrateName}' LIMIT 1\`);

  if (result[0]) {
    await connection.query(readFileSync(join(__dirname, './rollback.sql'), { encoding: 'utf-8' }));
    await connection.query("DELETE FROM migrations WHERE \`name\` = '${params.migrateName}'");
    await connection.end();
    Logger.log(\`${params.migrateName} 的回滚任务执行完成\`);
    return 1;
  } else {
    await connection.end();
    Logger.log(\`${params.migrateName} 的迁移任务已回滚或不存在\`);
    return -1;
  }
}
`;
}
