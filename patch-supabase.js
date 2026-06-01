const fs = require('fs');
['./node_modules/@supabase/supabase-js/dist/index.cjs', './node_modules/@supabase/supabase-js/dist/index.mjs'].forEach(p => {
  if (!fs.existsSync(p)) return;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    /otelModulePromise === null\) otelModulePromise = import\([^)]+\)/g,
    'otelModulePromise === null) otelModulePromise = Promise.resolve(null)'
  );
  fs.writeFileSync(p, c);
  console.log('Patched', p);
});
