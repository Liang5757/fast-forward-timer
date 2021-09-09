import path from 'path';
import resolve from 'rollup-plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs'; // commonjs模块转换插件
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-typescript2';
import packageJSON from './package.json';

const getPath = _path => path.resolve(__dirname, _path);
const name = packageJSON.name;

const extensions = [
  '.js',
  '.ts',
  '.tsx'
];

const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  extensions
});

const outputConfigs = [{
  file: getPath(`dist/${name}.esm.js`),
  format: `es`
}, {
  file: getPath(`dist/${name}.cjs.js`),
  format: `cjs`
}, {
  file: getPath(`dist/${name}.umd.js`),
  format: `umd`
}];

const commonConfig = {
  input: getPath('./src/index.ts'),
  plugins: [
    resolve(),
    commonjs(),
    terser({
      compress: {
        ecma: 2015,
        pure_getters: true
      },
      safari10: true,
      format: {
        comments: false,
      },
    }),
    tsPlugin
  ]
};

const buildConf = options => Object.assign({}, commonConfig, options);

export default outputConfigs.map(output => buildConf({
  output: {
    name: packageJSON.name,
    ...output
  }
}));
