const fs = require("fs")

module.exports = (req, res, next, data) => {
	if (req.cookies.token) {
		res.cookie("token", req.cookies.token, {
			maxAge: 30 * 24 * 60 * 60 * 1000
		});
	}

	if (fs.existsSync(__dirname + "/duckcloud.blok") && req.originalUrl != "/regular.css") {
		let read = fs.readFileSync(__dirname + "/duckcloud.blok").toString();
		return res.status(503).render(__dirname + "/duckcloud_blocked.jsembeds", {
			shutdown_info: (read ? ("<hr>There's some info that the administrator left:<br><pre>" + read + "</pre>") : "")
		});
	}
	
	let ip = req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.ip || "0.0.0.0";
	if (data.ips.hasOwnProperty(ip)) {
		if (data.ips[ip].includes(new URL(req.headers.origin || "http://non-existing.domain.loc").host)) {
			res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
			res.set("Access-Control-Allow-Credentials", "true");
			res.set("Vary", "Origin");
		}
	}

	next();
}