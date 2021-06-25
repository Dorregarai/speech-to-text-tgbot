// WATSON API KEY: ZN8g5q5fBiL8nI3TkCzAKKFeo1nCNFF-0E83z4yAhLYr
// WATSON URL: https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/78e084aa-c074-4a3a-b5fb-0369e909c65a
// BOT API KEY: 1811724922:AAE7fD69G1U4SsFOtyRrK2mCFmhLAjJgc_M

const { Telegraf } = require('telegraf');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const GET = require('get-json');
const fs = require('fs');
const request = require('request');


const BOT_TOKEN = '1811724922:AAE7fD69G1U4SsFOtyRrK2mCFmhLAjJgc_M';
const WATSON_USERNAME = 'sterben1343@gmail.com';
const WATSON_PASSWORD = '12345678aA';
const BASE_URL_AUDIO_PATH = 'https://api.telegram.org/bot' + BOT_TOKEN + '/getFile?file_id='
const BASE_URL_AUDIO_FILE = 'http://api.telegram.org/file/bot' + BOT_TOKEN + '/'

const bot = new Telegraf(BOT_TOKEN);

var speech_to_text = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
    apikey: 'ZN8g5q5fBiL8nI3TkCzAKKFeo1nCNFF-0E83z4yAhLYr',
    }),
    serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/78e084aa-c074-4a3a-b5fb-0369e909c65a',
});

bot.on('voice', ctx => {
    let fileId = ctx.message.voice.file_id;

    GET(BASE_URL_AUDIO_PATH + fileId, function(error, response) {
        let file_path = response.result.file_path;
        let local_file_path = fileId;

        request
        .get(BASE_URL_AUDIO_FILE + file_path)
        .on('error', function(err) {
            fs.unlink(local_file_path, function(error){})
        })
        .on('end', function(){
            let params = {
                audio: fs.createReadStream(fileId + '.flac'),
                contentType: 'audio/l16; rate=44100; endianness=little-endian',
                model: 'es-ES_BroadbandModel'
            }

            speech_to_text.recognize(params, function(err, res) {
                if(err) console.log(err);
                else ctx.reply(res.results[0].alternatives[0].transcript);
            })

            fs.unlink(local_file_path, function(error){});
        }).pipe(fs.createWriteStream(fileId + '.flac'))
    })
})

bot.launch();