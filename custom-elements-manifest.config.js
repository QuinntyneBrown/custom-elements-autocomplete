import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { modulePathResolverPlugin } from '@wc-toolkit/module-path-resolver';
import { cemValidatorPlugin } from '@wc-toolkit/cem-validator';
import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';
import { cemInheritancePlugin } from '@wc-toolkit/cem-inheritance';

// Read token defaults from their single source of truth without executing component code.
function tokenProperties() {
  const source = ts.createSourceFile(
    'themes.ts',
    readFileSync('src/theming/themes.ts', 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  let properties;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'lightTheme') {
      const object = node.initializer?.arguments?.[0];
      if (!object || !ts.isObjectLiteralExpression(object))
        throw new Error('Expected literal light theme defaults');
      properties = object.properties.map((property) => {
        if (!ts.isPropertyAssignment(property) || !ts.isStringLiteral(property.initializer))
          throw new Error('Expected string token default');
        const name = property.name.getText(source);
        return {
          name: `--ce-${name}`,
          default: property.initializer.text,
          description: `Inherited ${name} design token.`,
          type: { text: 'string' },
        };
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!properties) throw new Error('Light theme defaults not found');
  return properties;
}

function publicApiPlugin() {
  return {
    name: 'autocomplete-public-api',
    packageLinkPhase({ customElementsManifest }) {
      const cssProperties = tokenProperties();
      for (const module of customElementsManifest.modules) {
        for (const declaration of module.declarations ?? []) {
          declaration.members = (declaration.members ?? []).filter(
            (member) =>
              !['private', 'protected'].includes(member.privacy) &&
              !['connectedCallback', 'disconnectedCallback'].includes(member.name),
          );
          // The inheritance plugin retains the base class's generic parameter.
          // Publish the product specialization exposed by this registered element.
          if (declaration.tagName === 'ce-auto-complete') {
            const provider = declaration.members.find((member) => member.name === 'searchProvider');
            if (provider?.type)
              provider.type.text = provider.type.text.replace(/\bT\b/g, 'SearchResultItem');
          }
          if (
            declaration.tagName &&
            !['ce-header', 'ce-search-result-items'].includes(declaration.tagName)
          )
            declaration.cssProperties = cssProperties;
        }
      }
    },
  };
}

export default {
  globs: ['src/autocomplete/**/*.ts', 'src/product-autocomplete/**/*.ts'],
  exclude: ['**/*.styles.ts', '**/index.ts', '**/types.ts', '**/image.ts'],
  outdir: '.',
  packagejson: false,
  plugins: [
    modulePathResolverPlugin({
      modulePathTemplate: (modulePath) =>
        modulePath.includes('product-autocomplete')
          ? './dist/autocomplete/product-autocomplete.js'
          : './dist/autocomplete/autocomplete.js',
      definitionPathTemplate: (modulePath) =>
        modulePath.includes('product-autocomplete')
          ? './dist/autocomplete/product-autocomplete.js'
          : './dist/autocomplete/autocomplete.js',
    }),
    typeParserPlugin(),
    cemInheritancePlugin(),
    publicApiPlugin(),
    cemValidatorPlugin({
      rules: {
        packageJson: { main: 'off', module: 'off', types: 'off' },
        manifest: { schemaVersion: 'off' },
      },
    }),
  ],
  overrideModuleCreation({ ts: compiler, globs }) {
    const program = getTsProgram(compiler, globs, 'tsconfig.json');
    return program
      .getSourceFiles()
      .filter((source) =>
        globs.some((glob) =>
          source.fileName.replaceAll('\\', '/').endsWith(glob.replaceAll('\\', '/')),
        ),
      );
  },
};
