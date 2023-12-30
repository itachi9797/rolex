const os = require('os');

function cpu() {
	const cpus = os.cpus();
	const totalCores = cpus.length;

	let totalIdle = 0;
	let totalTick = 0;
	let totalSpeed = 0;

	cpus.forEach((cpu) => {
		for (const type in cpu.times) {
			totalTick += cpu.times[type];
		}
		totalIdle += cpu.times.idle;
		totalSpeed += cpu.speed;
	});

	const cpuUsagePercentage = (((totalTick - totalIdle) / totalTick) * 100).toFixed(2);
	const cpuFreePercentage = (100 - cpuUsagePercentage).toFixed(2);
	const averageSpeed = totalSpeed / totalCores;
	const cpuModel = cpus[0].model;

	return {
		model: cpuModel,
		usage: cpuUsagePercentage,
		free: cpuFreePercentage,
		speed: averageSpeed,
		cores: totalCores,
	};
}

module.exports = { cpu };