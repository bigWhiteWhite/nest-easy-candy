const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)

const execute = async (cmd) => {
	const { error, stdout, stderr } = await exec(cmd)
	return error ? stderr : stdout
}

exports.execute = execute
