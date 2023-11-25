import { RouteMeta } from '@/types/Common/route'
import type { RouteRecordRaw } from 'vue-router'

type route = Array<RouteRecordRaw | RouteMeta>

export const whiteNote: route = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					title: 'router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true, // 是否保存
					isAffix: true, // 标签是否是固定不可关闭的
					isIframe: false,
					// roles: ['1', '8'],
					icon: 'ele-HomeFilled'
				}
			},
			{
				path: '/main',
				name: 'Main',
				component: () => import('@/views/main/index.vue'),
				meta: {
					title: 'router.main',
					icon: 'main'
				}
			},
			{
				path: '/git',
				name: 'Git',
				component: () => import('@/views/git/index.vue'),
				meta: {
					title: 'router.git',
					icon: 'git'
				}
			},
			{
				path: '/work-note',
				name: 'WorkNote',
				component: () => import('@/views/work-note/index.vue'),
				meta: {
					title: 'router.workNote',
					icon: 'work-note'
				}
			},
			{
				path: '/server',
				name: 'Server',
				redirect: '/nest',
				meta: {
					title: 'router.server',
					icon: 'server'
				},
				children: [
					{
						path: '/nest',
						name: 'Nest',
						component: () => import('@/views/server/nest/index.vue'),
						meta: {
							title: 'router.nest',
							icon: 'nest'
						}
					},
					{
						path: '/node',
						name: 'Node',
						component: () => import('@/views/server/node/index.vue'),
						meta: {
							title: 'router.nest',
							icon: 'node'
						}
					},
					{
						path: '/express',
						name: 'Express',
						component: () => import('@/views/server/express/index.vue'),
						meta: {
							title: 'router.express',
							icon: 'express'
						}
					}
				]
			},
			{
				path: '/front-interview',
				name: 'FrontInterview',
				redirect: '/interview',
				meta: {
					title: 'router.frontInterview',
					icon: 'front-interview'
				},
				children: [
					{
						path: '/interview',
						name: 'Interview',
						component: () => import('@/views/front-interview/interview/index.vue'),
						meta: {
							title: 'router.interview',
							icon: 'front-interview'
						}
					}
				]
			},
			{
				path: '/vue',
				name: 'vue',
				redirect: '/vue-proxy',
				meta: {
					title: 'router.vue',
					icon: 'vue'
				},
				children: [
					{
						path: '/vue-proxy',
						name: 'VueProxy',
						component: () => import('@/views/vue/vue-proxy/index.vue'),
						meta: {
							title: 'vue响应式原理',
							icon: 'vue'
						}
					},
					{
						path: '/vue-v3',
						name: 'Vue3',
						redirect: '/vue3-base',
						meta: {
							title: 'router.vue3',
							icon: 'vue'
						},
						children: [
							{
								path: '/vue3-base',
								name: 'Vue3Base',
								component: () => import('@/views/vue/vue-v3/vue-base/index.vue'),
								meta: {
									title: 'router.vueBase',
									icon: 'vue-bottom'
								}
							},
							{
								path: '/vue3-summary',
								name: 'Vue3Summary',
								component: () => import('@/views/vue/vue-v3/vue-summary/index.vue'),
								meta: {
									title: 'router.vueSummary',
									icon: 'vue-bottom'
								}
							}
						]
					},
					{
						path: '/vue-v2',
						name: 'Vue2',
						meta: {
							title: 'router.vue2',
							icon: 'vue'
						},
						redirect: '/vue2-base',
						children: [
							{
								path: '/vue2-base',
								name: 'Vue2Base',
								component: () => import('@/views/vue/vue-v2/vue-base/index.vue'),
								meta: {
									title: 'router.vueBase',
									icon: 'vue-bottom'
								}
							},
							{
								path: '/vue2-summary',
								name: 'Vue2Summary',
								component: () => import('@/views/vue/vue-v2/vue-summary/index.vue'),
								meta: {
									title: 'router.vueSummary',
									icon: 'vue-bottom'
								}
							}
						]
					},
					{
						path: '/vue-other',
						name: 'VueOther',
						component: () => import('@/views/vue/vue-other/index.vue'),
						meta: {
							title: 'router.vueOther',
							icon: 'vue'
						}
					}
				]
			},
			{
				path: '/react',
				name: 'React',
				redirect: '/react-base',
				meta: {
					title: 'router.react',
					icon: 'react'
				},
				children: [
					{
						path: '/react-base',
						name: 'ReactBase',
						component: () => import('@/views/react/react-base/index.vue'),
						meta: {
							title: 'router.reactBase',
							icon: 'react-base'
						}
					},
					{
						path: '/react-summary',
						name: 'ReactSummary',
						component: () => import('@/views/react/react-summary/index.vue'),
						meta: {
							title: 'router.reactSummary',
							icon: 'react-summary'
						}
					}
				]
			},
			{
				path: '/front-server',
				name: 'FrontServer',
				redirect: '/nuxt',
				meta: {
					title: 'router.frontServer',
					icon: 'front-server'
				},
				children: [
					{
						path: '/nuxt',
						name: 'Nuxt',
						component: () => import('@/views/front-server/nuxt/index.vue'),
						meta: {
							title: 'router.nuxt',
							icon: 'nuxt'
						}
					},
					{
						path: '/next',
						name: 'Next',
						component: () => import('@/views/front-server/next/index.vue'),
						meta: {
							title: 'router.next',
							icon: 'next'
						}
					}
				]
			},
			{
				path: '/css',
				name: 'Css',
				redirect: '/css-base',
				meta: {
					title: 'router.css',
					icon: 'css'
				},
				children: [
					{
						path: '/css-base',
						name: 'CssBase',
						component: () => import('@/views/css/css-base/index.vue'),
						meta: {
							title: 'router.cssBase',
							icon: 'css-base'
						}
					},
					{
						path: '/css-summary',
						name: 'CssSummary',
						component: () => import('@/views/css/css-summary/index.vue'),
						meta: {
							title: 'router.cssSummary',
							icon: 'css-summary'
						}
					},
					{
						path: '/less',
						name: 'Less',
						component: () => import('@/views/css/less/index.vue'),
						meta: {
							title: 'router.less',
							icon: 'less'
						}
					},
					{
						path: '/sass',
						name: 'Sass',
						component: () => import('@/views/css/sass/index.vue'),
						meta: {
							title: 'router.sass',
							icon: 'sass'
						}
					},
					{
						path: '/tailwind-css',
						name: 'TailwindCss',
						component: () => import('@/views/css/tailwind-css/index.vue'),
						meta: {
							title: 'router.tailwindCss',
							icon: 'tailwind-css'
						}
					}
				]
			},
			{
				path: '/es6',
				name: 'ES6',
				redirect: '/typeScript',
				meta: {
					title: 'router.es6',
					icon: 'es6'
				},
				children: [
					{
						path: '/es6-base',
						name: 'ES6Base',
						component: () => import('@/views/es6/es6-base/index.vue'),
						meta: {
							title: 'router.es6Base',
							icon: 'es6'
						}
					},
					{
						path: '/typeScript',
						name: 'TypeScript',
						component: () => import('@/views/es6/typeScript/index.vue'),
						meta: {
							title: 'router.typeScript',
							icon: 'type-script'
						}
					},
					{
						path: '/javaScript',
						name: 'JavaScript',
						component: () => import('@/views/es6/javaScript/index.vue'),
						meta: {
							title: 'router.javaScript',
							icon: 'java-script'
						}
					},
					{
						path: '/utils',
						name: 'Utils',
						component: () => import('@/views/es6/utils/index.vue'),
						meta: {
							title: 'router.utils',
							icon: 'utils'
						}
					},
					{
						path: '/algorithm',
						name: 'Algorithm',
						component: () => import('@/views/es6/algorithm/index.vue'),
						meta: {
							title: 'router.algorithm',
							icon: 'algorithm'
						}
					}
				]
			},
			{
				path: '/flutter',
				name: 'Flutter',
				redirect: '/flutter-base',
				meta: {
					title: 'router.flutter',
					icon: 'flutter'
				},
				children: [
					{
						path: '/dart',
						name: 'Dart',
						component: () => import('@/views/flutter/dart/index.vue'),
						meta: {
							title: 'router.dart',
							icon: 'dart'
						}
					},
					{
						path: '/flutter-base',
						name: 'flutterBase',
						component: () => import('@/views/flutter/flutter-base/index.vue'),
						meta: {
							title: 'router.flutterBase',
							icon: 'flutter'
						}
					},
					{
						path: '/electron',
						name: 'Electron',
						component: () => import('@/views/flutter/electron/index.vue'),
						meta: {
							title: 'router.electron',
							icon: 'electron'
						}
					}
				]
			},
			{
				path: '/applet',
				name: 'Applet',
				redirect: '/uniapp',
				meta: {
					title: 'router.applet',
					icon: 'applet'
				},
				children: [
					{
						path: '/uniapp',
						name: 'UniApp',
						redirect: '/uniapp-base',
						meta: {
							title: 'router.uniapp',
							icon: 'uniapp'
						},
						children: [
							{
								path: '/uniapp-base',
								name: 'UniappBase',
								component: () => import('@/views/applet/uniapp/uniapp-base/index.vue'),
								meta: {
									title: 'router.uniappBase',
									icon: 'uniapp-base'
								}
							}
						]
					}
				]
			},
			{
				path: '/build-tools',
				name: 'BuildTools',
				redirect: '/webpack',
				meta: {
					title: 'router.buildTools',
					icon: 'build-tools'
				},
				children: [
					{
						path: '/webpack',
						name: 'Webpack',
						component: () => import('@/views/build-tools/webpack/index.vue'),
						meta: {
							title: 'router.webpack',
							icon: 'webpack'
						}
					},
					{
						path: '/gulp',
						name: 'Gulp',
						component: () => import('@/views/build-tools/gulp/index.vue'),
						meta: {
							title: 'router.gulp',
							icon: 'gulp'
						}
					},
					{
						path: '/vite',
						name: 'Vite',
						component: () => import('@/views/build-tools/vite/index.vue'),
						meta: {
							title: 'router.vite',
							icon: 'vite'
						}
					}
				]
			},
			{
				path: '/database',
				name: 'Database',
				redirect: '/mongodb',
				meta: {
					title: 'router.database',
					icon: 'database'
				},
				children: [
					{
						path: '/mongodb',
						name: 'MongoDb',
						component: () => import('@/views/database/mongodb/index.vue'),
						meta: {
							title: 'router.mongodb',
							icon: 'mongodb'
						}
					},
					{
						path: '/mysql',
						name: 'Mysql',
						component: () => import('@/views/database/mysql/index.vue'),
						meta: {
							title: 'router.mysql',
							icon: 'mysql'
						}
					}
				]
			},
			{
				path: '/network',
				name: 'Network',
				redirect: '/nginx',
				meta: {
					title: 'router.network',
					icon: 'network'
				},
				children: [
					{
						path: '/http',
						name: 'Http',
						component: () => import('@/views/network/http/index.vue'),
						meta: {
							title: 'router.http',
							icon: 'http'
						}
					},
					{
						path: '/nginx',
						name: 'Nginx',
						component: () => import('@/views/network/nginx/index.vue'),
						meta: {
							title: 'router.nginx',
							icon: 'nginx'
						}
					}
				]
			},
			{
				path: '/common-lib',
				name: 'CommonLib',
				redirect: '/axios',
				meta: {
					title: 'router.commonLib',
					icon: 'common-lib'
				},
				children: [
					{
						path: '/axios',
						name: 'Axios',
						component: () => import('@/views/common-lib/axios/index.vue'),
						meta: {
							title: 'router.axios',
							icon: 'axios'
						}
					},
					{
						path: '/echarts',
						name: 'Echarts',
						component: () => import('@/views/common-lib/echarts/index.vue'),
						meta: {
							title: 'router.echarts',
							icon: 'echarts'
						}
					},
					{
						path: '/canvas',
						name: 'Canvas',
						component: () => import('@/views/common-lib/canvas/index.vue'),
						meta: {
							title: 'router.canvas',
							icon: 'canvas'
						}
					},
					{
						path: '/mark-down',
						name: 'MarkDown',
						component: () => import('@/views/common-lib/mark-down/index.vue'),
						meta: {
							title: 'router.markDown',
							icon: 'mark-down'
						}
					}
				]
			},
			{
				path: '/operating-system',
				name: 'OperatingSystem',
				redirect: '/linux',
				meta: {
					title: 'router.operatingSystem',
					icon: 'operating-system'
				},
				children: [
					{
						path: '/linux',
						name: 'Linux',
						component: () => import('@/views/operating-system/linux/index.vue'),
						meta: {
							title: 'router.linux',
							icon: 'linux'
						}
					}
				]
			},
			{
				path: '/game',
				name: 'Game',
				redirect: '/cocos-creator',
				meta: {
					title: 'router.game',
					icon: 'game'
				},
				children: [
					{
						path: '/cocos-creator',
						name: 'CocosCreator',
						component: () => import('@/views/game/cocos-creator/index.vue'),
						meta: {
							title: 'router.cocosCreator',
							icon: 'cocos-creator'
						}
					}
				]
			},
			{
				path: '/front-test',
				name: 'FrontTest',
				component: () => import('@/views/front-test/index.vue'),
				meta: {
					title: 'router.frontTest',
					icon: 'front-test'
				}
			},
			{
				path: '/software-engineering',
				name: 'softwareEngineering',
				component: () => import('@/views/software-engineering/index.vue'),
				meta: {
					title: 'router.softwareEngineering',
					icon: 'software-engineering'
				}
			}
		]
	}
]
