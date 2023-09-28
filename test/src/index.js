import http from 'k6/http';
import { check } from 'k6';
import chai, { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.2/index.js';
import { SharedArray } from 'k6/data';

const rootUrl = __ENV.ROOT_URL
const dataRootPath = __ENV.DATA_ROOT_PATH
const duration = __ENV.DURATION || '60s'
const vus =  parseInt(__ENV.VUS || '1')

chai.config.logFailures = true;


export const options = {
  thresholds: {
    checks: ['rate > 0.75'],
  },
  scenarios: {
    start_lot_of_modifications: {
     exec: 'loadALot',
     executor: "constant-vus",
     vus,
     duration
    }
  }
};

const jsonHeaders = {
  headers: { 'Content-Type': 'application/json' },
}

const smallHtmls = new SharedArray('smallHtmls', function () {
  return [1, 2, 3, 4]
    .map(i => `${dataRootPath}/small/00${i}.html`)
    .map(path => open(path))
});

const bigHtmls = new SharedArray('bigHtmls', function () {
  return [1, 2, 3, 4]
    .map(i => `${dataRootPath}/big/00${i}.html`)
    .map(path => open(path))
});


export function loadALot (){
    describe("[RTE][Small] HTML to JSON conversion", () => {
        const response = http.post(
          `${rootUrl}/transform`, getRequest(smallHtmls, ['json']), jsonHeaders);
        check(response, {
          'could transform Small HTML to JSON': r => r.status == 200
        });
    });
    describe("[RTE][Big] HTML to JSON conversion", () => {
        const response = http.post(
          `${rootUrl}/transform`, getRequest(bigHtmls, ['json']), jsonHeaders);
        check(response, {
          'could transform Big HTML to JSON': r => r.status == 200
        });
    });
    describe("[RTE][Small] HTML to JSON and plain text conversion", () => {
        const response = http.post(
          `${rootUrl}/transform`, getRequest(smallHtmls, ['json', 'plainText']), jsonHeaders);
        check(response, {
          'could transform Small HTML to JSON and plain text': r => r.status == 200
        });
    });
    describe("[RTE][Big] HTML to JSON and plain text conversion", () => {
        const response = http.post(
          `${rootUrl}/transform`, getRequest(bigHtmls, ['json', 'plainText']), jsonHeaders);
        check(response, {
          'could transform Big HTML to JSON and plain text': r => r.status == 200
        });
    });
}


function getRequest(dataSet, requestedFormats){
  const randomHtml = dataSet[Math.floor(Math.random() * dataSet.length)]
  const request = {
    requestedFormats,
    "contentVersion": 0,
    "htmlContent": randomHtml
  }
  return JSON.stringify(request)
}