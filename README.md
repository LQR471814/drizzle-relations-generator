## drizzle-relations-generator

This CLI utility generates drizzle ORM `relations()` code out of foreign key definitions (`.references(() => ...)`), this is useful if you've got a large schema that relies on foreign keys using the `.references(() => ...)` API and still want to use the `db.query` API.

### Install

```bash
npm install drizzle-relations-generator
```

### Usage

```
Usage:
        -snapshot       string  The snapshot file under drizzle/meta to use. (ex. ./drizzle/meta/0000_snapshot.json)

        -src    string[]        The paths to the database schema file. (ex. ./path/to/file.ts)

        -module string[]        The module specifier(s) (ex. "./module/specifier" which would be then used in an import like 'import {} as "./module/specifier"') in the same order as '-src'.

        -outfile        string  The location to store the generated typescript file.
```

Example command:

```bash
drizzle-rel-gen \
  -snapshot="drizzle/meta/0000_snapshot.json" \
  -src="index.ts" \
  -module="./index" \
  -outfile="generated.ts"
```
