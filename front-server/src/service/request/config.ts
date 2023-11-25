let BASE_URL = ''
const TIME_OUT = 100000

if (import.meta.env.VITE_NODE_ENV === 'dev') {
	BASE_URL = '/admin'
} else if (import.meta.env.VITE_NODE_ENV === 'test') {
	BASE_URL = '/admin'
} else {
	BASE_URL = '/admin'
}

export { BASE_URL, TIME_OUT }
