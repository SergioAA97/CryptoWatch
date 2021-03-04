const fetch = require("node-fetch");

var coin = "bitcoin";
var url = new URL(
  "https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart"
);
var params = { vs_currency: "eur", days: 14 };
exports.handler = async (event, context) => {
  url.search = new URLSearchParams(params).toString();

  return fetch(url, {
    method: "GET", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((res) => {
      try {
        return {
          statusCode: 200,
          body: JSON.stringify(res),
        };
      } catch (error) {
        return {
          statusCode: 400,
          body: error,
        };
      }
    });
};
