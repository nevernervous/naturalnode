module.exports = {
  'db':
    {
      'url': 'mongodb://<dbuser>:<password>@<host>:<port>/<dbName>'
    },
  'mailer': {
    'url': 'smtps://user:pass@localhost',
    'to': 'user@example.com',
    'from': 'no-reply@example.com',
    'cron': [
      '0 0 8 * * *',
      '0 0 13 * * *'
    ]
  },
  'tables': {
    'limit': 25
  },
  'pdf': {
    'companyAdress': {
      'line1': "Company name",
      'line2': "Street",
      'line3': "City and zip code",
      'line4': ""
    }
  }
};
