const exec = require('./exec')
const time = require('./time')
const timeLine = time.formatTime(new Date(), 'yyyyMMddhhmmss')
const gitTag = `git tag -a test.${timeLine} -m ${timeLine}`
const gitTagPush = `git push origin test.${timeLine}`

const exceTest = async () => {
	const test = await exec.execute(`${gitTag}`)
	console.log('tag:test --> ', `${gitTag}`)
	const push = await exec.execute(`${gitTagPush}`)
	console.log('tag:push --> ', `${gitTagPush}`)
}

exceTest()
