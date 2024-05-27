export class ProductUpgradeStatements {
  productUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS products(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT
            );`,
      ],
    },
    // {
    //   toVersion: 2,
    //   statements: [`ALTER TABLE products ADD COLUMN image TEXT;`],
    // },
  ];
}
