import { githubConfig } from "@/config";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const params =
        "?client_id=" +
        githubConfig.client_id +
        "&client_secret=" +
        githubConfig.secret_id +
        "&code=" +
        req.query.code;

    axios<TGithubGetAccessTokenResponse>("https://github.com/login/oauth/access_token" + params, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((response) => {
      res.status(200).json({ data: response.data.access_token });
      // if (response.error) {
      //   res.status(200).json({ data: responseJson, error: true });
      // } else {
      //   res.status(200).json({ data: responseJson, error: false });
      // }
    });
}
     
