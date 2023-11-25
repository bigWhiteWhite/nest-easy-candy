import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import viteCompression from 'vite-plugin-compression'
import viteSvgIcons from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const root = process.cwd()
const pathResolve = (dir: string): string => {
	return resolve(__dirname, '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, __dirname)
	return {
		// base: './',
		assetsInclude: ['**/*.md'],
		build: {
			outDir: 'dist',
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			},
			rollupOptions: {
				output: {
					manualChunks(id) {
						// 将pinia的全局库实例打包进vendor，避免和页面一起打包造成资源重复引入
						if (id.includes(resolve(__dirname, '/src/store/index.ts'))) {
							return 'vendor'
						}
					}
				}
			}
		},
		plugins: [
			vue(),
			vueJsx({
				// babelPlugins: ['@vue/babel-preset-jsx']
				// options are passed on to @vue/babel-plugin-jsx
			}),
			VueSetupExtend(),
			// gzip压缩 生产环境生成 .gz 文件
			viteCompression({
				verbose: true,
				disable: false,
				threshold: 10240,
				algorithm: 'gzip',
				ext: '.gz'
			}),
			eslintPlugin({
				cache: false,
				include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
			}),
			viteSvgIcons({
				// 指定需要缓存的图标文件夹
				iconDirs: [resolve(root, 'src/assets/icons')],
				// 指定symbolId格式
				symbolId: 'icon-[dir]-[name]',
				// 压缩
				svgoOptions: true
			}),
			Components({
				dts: true,
				dirs: ['src/components'],
				extensions: ['vue', 'tsx', 'jsx'],
				include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/]
			}),
			AutoImport({
				dts: true,
				imports: ['vue', 'pinia', '@vueuse/core', 'vue-i18n'],
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.vue$/,
					/\.vue\?vue/, // .vue
					/\.md$/ // .md
				],
				resolvers: [ElementPlusResolver()],
				eslintrc: {
					enabled: true,
					filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
					globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
				}
			}),
			viteMockServe({
				// supportTs: true //如果使用 js开发，则需要配置 supportTs 为 false
			})
		],
		resolve: {
			alias: [
				{
					find: /\@\//,
					replacement: pathResolve('src') + '/'
				}
			]
		},
		// 引入第三方的配置
		optimizeDeps: {
			include: ['element-plus/dist/locale/zh-cn', 'element-plus/dist/locale/en', 'element-plus/dist/locale/zh-tw']
		},
		server: {
			https: false, // 是否开启 https
			open: false, // 是否自动在浏览器打开
			port: 4033, // 端口号
			host: '0.0.0.0',
			proxy: {
				'/admin': {
					target: env.VITE_APP_PROXY_URL, // 后台接口
					changeOrigin: true,
					secure: false, // 如果是https接口，需要配置这个参数
					ws: true, //websocket支持
					rewrite: (path) => path.replace(/^\/admin/, '/admin')
				}
			}
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
		}
	}
})
