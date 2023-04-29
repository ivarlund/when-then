import { NextApiRequest, NextApiResponse } from "next";
const godKey = process.env.GOD_KEY || "";
const auth = "Bearer " + godKey;
const url = "https://api.openai.com/v1/chat/completions";

type Data = {
	success: any;
	error: any;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	try {
		// Make a POST request to the Discord webhook URL with the message payload
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth,
			},
			body: JSON.stringify(req.body),
		});
		const jsonData = await response.json();
		// console.log('DATA', jsonData.choices[0].message.content)

		// If the request was successful, return a success response to the client
		return res.status(200).json(jsonData);
	} catch (error) {
		// If there was an error, return an error response to the client
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Unable to send message to Discord webhook",
		});
	}
}
