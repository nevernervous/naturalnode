var CronJob = require('cron').CronJob;
var config = require('./config.js');
var mailer = require('./mailer.js');
var mailTemplate = require('./mail-templates/quote-sample-mail');

var cronMail = function () {

  var sendCronMail = function () {
    models.quote.getAllNotSentViaEmailPopulated(null, null, null, function (null1, null2, null3, quotes) {
      models.sample.getAllNotSentViaEmailPopulated(null, null, null, function (null1, null2, null3, samples) {
        if (samples.length > 0) {
          var msg = mailTemplate(samples);
          var mailOptions = {
            to: config.mailer.to,
            from: config.mailer.from,
            subject: 'New samples',
            html: (msg)
          };
          mailer.sendMail(mailOptions, function (err) {
            if (err) {
              console.log('Error while sending mail with samples: ' + err.toString());
              return;
            }
            console.log('Mail with samples sent');
            var c = samples.length;
            for (var i in samples) {
              samples[i].markAsSentViaEmail(null, null, null, function () {
                c--;
                if (c === 0) {
                  console.log('Samples marked as sent');
                }
              });
            }
          });
        } else {
          console.log('No new samples - mail with samples wasn\'t sent');
        }
        if (quotes.length > 0) {
          var msg = mailTemplate(quotes);
          var mailOptions = {
            to: config.mailer.to,
            from: config.mailer.from,
            subject: 'New quotes',
            html: (msg)
          };
          mailer.sendMail(mailOptions, function (err) {
            if (err) {
              console.log('Error while sending mail with quotes: ' + err.toString());
              return;
            }
            console.log('Mail with quotes sent');
            var c = quotes.length;
            for (var i in quotes) {
              quotes[i].markAsSentViaEmail(null, null, null, function () {
                c--;
                if (c === 0) {
                  console.log('Quotes marked as sent');
                }
              });
            }
          });
        } else {
          console.log('No new quotes - mail with quotes wasn\'t sent');
        }
      });
    });
  };

  for (var i in config.mailer.cron) {
    var time = config.mailer.cron[i];
    try {
      var job = new CronJob({
        cronTime: time,
        onTick: function () {
          console.log('Run cron job for time: ' + this.cronTime.toString());
          sendCronMail();
        },
        start: true
      });
      console.log('Cron mailer added at ' + time);
    } catch (ex) {
      console.log("cron pattern '" + time + "' is not valid");
    }
  }

};

module.exports = cronMail;