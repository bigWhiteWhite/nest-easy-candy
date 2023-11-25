const exec = require('./exec')
const time = require('./time')
const timeLine = time.formatTime(new Date(), 'yyyyMMddhhmmss')
const gitTag = `git tag -a prod.${timeLine} -m ${timeLine}`
const gitTagPush = `git push origin prod.${timeLine}`

const exceProd = async () => {
	const prod = await exec.execute(`${gitTag}`)
	console.log('tag:prod --> ', `${gitTag}`)
	const push = await exec.execute(`${gitTagPush}`)
	console.log('tag:push --> ', `${gitTagPush}`)
}

exceProd()
