import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from "axios";
import { config } from "dotenv";
import * as path from "path";


config()


export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
) {


	console.log( request.body)

	const text = ""

	// await post(text)


	response.status(200).json({
		body: request.body,
		query: request.query,
		cookies: request.cookies,
	});
}

async function post(text: String){

	const GH_SECRET = process.env.GH_TOKEN
	const MISSKEY_TOKEN = process.env.MISSKEY_TOKEN
	const visible = process.env.visible
	const instance = process.env.instance

	await axios.post(path.join(instance , "/create/note/add"), {
		i: MISSKEY_TOKEN,
		text,
		visibility: visible,
		noExtractMentions: true,
		noExtractHashtags: true
	})
}


function push(event){
	const ref = event.ref;
	switch (ref) {
		case 'refs/heads/develop':
			const pusher = event.pusher;
			const compare = event.compare;
			const commits: any[] = event.commits;
			post([
				`🆕 Pushed by **${pusher.name}** with ?[${commits.length} commit${commits.length > 1 ? 's' : ''}](${compare}):`,
				commits.reverse().map(commit => `・[?[${commit.id.substr(0, 7)}](${commit.url})] ${commit.message.split('\n')[0]}`).join('\n'),
			].join('\n'));
			break;
	}
}

async function issues(event){
	const issue = event.issue;
	const action = event.action;
	let title: string;
	switch (action) {
		case 'opened': title = `💥 Issue opened`; break;
		case 'closed': title = `💮 Issue closed`; break;
		case 'reopened': title = `🔥 Issue reopened`; break;
		default: return;
	}
	await post(`${title}: #${issue.number} "${issue.title}"\n${issue.html_url}`);
}


async function issue_comment(event){
	const issue = event.issue;
	const comment = event.comment;
	const action = event.action;
	let text: string;
	switch (action) {
		case 'created': text = `💬 Commented on "${issue.title}": ${comment.user.login} "<plain>${comment.body}</plain>"\n${comment.html_url}`; break;
		default: return;
	}
	await post(text);
}

async function release(event){
	const action = event.action;
	const release = event.release;
	let text: string;
	switch (action) {
		case 'published': text = `🎁 **NEW RELEASE**: [${release.tag_name}](${release.html_url}) is out. Enjoy!`; break;
		default: return;
	}
	await post(text);
}


async function watch(event){
	const sender = event.sender;
	await post(`$[spin ⭐️] Starred by ?[**${sender.login}**](${sender.html_url})`);
}


async function fork(event){
	const sender = event.sender;
	const repo = event.forkee;
	await post(`$[spin.y 🍴] ?[Forked](${repo.html_url}) by ?[**${sender.login}**](${sender.html_url})`);

}

async function pullRequest(event) {
	const { pr, action }  = event
	let text: string;
	switch (action) {
		case 'opened': text = `📦 New Pull Request: "${pr.title}"\n${pr.html_url}`; break;
		case 'reopened': text = `🗿 Pull Request Reopened: "${pr.title}"\n${pr.html_url}`; break;
		case 'closed':
			text = pr.merged
				? `💯 Pull Request Merged!: "${pr.title}"\n${pr.html_url}`
				: `🚫 Pull Request Closed: "${pr.title}"\n${pr.html_url}`;
			break;
		default: return;
	}
	await post(text);
}
