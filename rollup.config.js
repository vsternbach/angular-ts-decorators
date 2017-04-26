import typescript from 'rollup-plugin-typescript';

const pkg = require('./package.json');
const external = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];

export default {
  entry: 'src/index.ts',
  external,
  plugins: [
    typescript({
      typescript: require('typescript'),
    })
  ],
  targets: [
    {
      dest: 'dist/' + pkg.main,
      format: 'umd',
      exports: 'named',
      moduleName: pkg.name,
      sourceMap: true
    },
    {
      dest: 'dist/' + pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};
