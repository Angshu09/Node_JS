const { nanoid } = require("nanoid");
const URL = require("../models/url");

const handleGenerateNewShortUrl = async (req, res) => {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({
      error: "url is required",
    });
  }

  const shortId = nanoid(8);
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });

  return res.render('home', {id: shortId})
 
};

const handleShortUrlAnalytics =  async (req, res) => {
    const shortId = req.params.shortId
    const entry = await URL.findOne({shortId})
    return res.json({
        clicks: entry.visitHistory.length,
        history: entry.visitHistory
    })
}


module.exports = {
    handleGenerateNewShortUrl, handleShortUrlAnalytics
}
