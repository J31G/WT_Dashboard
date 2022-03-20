const axios = require('axios');
// require('dotenv').config();

module.exports.translate = async (text, language) => {
  if (!text) return 'Error';

  const { data } = await axios.get('https://api-free.deepl.com/v2/translate', {
    params: {
      auth_key: process.env.DEEPL_API,
      text,
      target_lang: language.toUpperCase() || 'EN',
    },
  });

  if (!data?.translations[0]) return 'Error';

  return data?.translations[0];
};
