import fetch from "node-fetch";
import { getToken } from "./api/getToken";

// 既存のgetToken関数を使う場合
// import { getToken } from './src/api/getToken';

const appId = "6737678499";
const country = "jp";
const appName =
  "poker-qz-%E3%83%9D%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%AD%E3%83%A5%E3%83%BC%E3%82%BA"; // 実際のApp StoreのURLに合わせてください
const lang = "ja";

async function fetchReviews() {
  const token = await getToken({ country, appId, appName });
  const requestUrl = `https://amp-api.apps.apple.com/v1/catalog/${country}/apps/${appId}/reviews`;
  const params = new URLSearchParams();
  params.append("l", lang);
  params.append("offset", "0");
  params.append("limit", "1");
  params.append("platform", "web");
  params.append("additionalPlatforms", "appletv,ipad,iphone,mac");

  const res = await fetch(`${requestUrl}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      Authorization: `bearer ${token}`,
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://apps.apple.com",
      Referer: `https://apps.apple.com/${country}/app/${appName}/id${appId}`,
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("APIエラー:", res.status, text);
    return;
  }
  const json = (await res.json()) as any;
  // attributes部分だけ抜き出して表示
  if (json.data && json.data.length > 0) {
    console.log(JSON.stringify(json.data[0].attributes, null, 2));
  } else {
    console.log("No review data found");
  }
}

fetchReviews();
