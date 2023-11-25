const exec = require('./exec')
const time = require('./time')
const timeLine = time.formatTime(new Date(), 'yyyyMMddhhmmss')
const gitAdd = 'git add .'
const gitCommit = `git commit -m ${timeLine}`
const gitPush = 'git push'

const exceCMD = async () => {
	const add = await exec.execute(`${gitAdd}`)
	console.log(`(${gitAdd})--> complete!`, add)
	try {
		const commit = await exec.execute(`${gitCommit}`)
		console.log(`(${gitCommit})-->`, commit)
	} catch (error) {
		console.log(`(${gitCommit}) already Completed!`)
	}
	const push = await exec.execute(`${gitPush}`)
	console.log(`(${gitPush})--> complete push`)
}

exceCMD()
