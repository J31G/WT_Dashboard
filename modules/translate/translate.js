const axios = require('axios');
// require('dotenv').config();

module.exports.translate = async (text, language) => {
  if (!text || !language) return 'Error';

  const {
    data: { translations },
  } = await axios.get('https://api-free.deepl.com/v2/translate', {
    params: {
      auth_key: process.env.DEEPL_API,
      text,
      target_lang: language.toUpperCase(),
    },
  });

  if (!translations[0]) return 'Error';

  return translations[0];
};
