/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/flex_docs/2019/10/06/index.html","ac163a37ab5005c042d24224c08a0a50"],["/flex_docs/2019/10/index.html","982bab1a7e8e5afddce5668d42bb38c7"],["/flex_docs/2019/index.html","d39b3ebf809564f621e00ac895bf4ff9"],["/flex_docs/404.html","d0e916d2896c7808cacb6686d469f0e5"],["/flex_docs/about/index.html","19df66dfc8e1076f59b2a6bfaad7c9e2"],["/flex_docs/adding_plugins/index.html","4c0570a8c95cb83d0a5b6890b2f383b0"],["/flex_docs/api_reference/index.html","cdc53d0cb3777cf84d7bb8c704e11560"],["/flex_docs/archive/jekyll/index.html","47758be4bb8b57d2ade1a43fffdce5b6"],["/flex_docs/archive/update/index.html","589593f07a76f680b5bfd0966ee761a8"],["/flex_docs/bug_report/index.html","f46b3b32b51959ded03ef844968ab470"],["/flex_docs/building_projects/index.html","2e338486fd80f6928cd4a1182c810463"],["/flex_docs/category/common/index.html","1fa0b1e07c462a9a8ac98664480354fa"],["/flex_docs/category/docs/index.html","2d575143459dd6c80a0395a9c0f0f2fd"],["/flex_docs/category/index.html","f381b4e5428e3b07d22a198f99d3f53c"],["/flex_docs/common/index.html","d7073253ff44cd13877982fb5f1d6d2d"],["/flex_docs/community/index.html","4e58056e433cb928ba6170eb34ef6d43"],["/flex_docs/css/main.css","6af83036e9a5c48c2f4b524035537aaf"],["/flex_docs/css/main.min.css","6af83036e9a5c48c2f4b524035537aaf"],["/flex_docs/developer_docs/index.html","ac9e6bc5ddc13ccafe600207d9a2eaac"],["/flex_docs/download/index.html","8aafddc0906822fa7982de1bbf46c1ff"],["/flex_docs/faq/index.html","460d4c9bd7a7d20645114582c668d84a"],["/flex_docs/flexlib/index.html","4c87f98f3accf528ca72fc28bd291ee2"],["/flex_docs/flextool/index.html","fbad12b05e7ac42f92647be253f9f645"],["/flex_docs/images/database.png","9ba07f582e158f58dec485f9b3c0b25f"],["/flex_docs/images/favicons/apple-touch-icon.png","2add0d1d0b1c909c5e71d37a968bffcb"],["/flex_docs/images/favicons/favicon-16x16.png","71a57c78742fa710910b09df78500767"],["/flex_docs/images/favicons/favicon-32x32.png","3506cd376729cda5ccefa170eb98d981"],["/flex_docs/images/grid15.png","92472ec6f3aed0a4f5fe2a17adb994f4"],["/flex_docs/images/logo.png","5d33451198019aa289b18be714f9fc02"],["/flex_docs/images/touch/128x128.jpg","48a9618b4901444fec3e100f4da40847"],["/flex_docs/images/touch/144x144.jpg","69b62e8796065415fad8c885bb6dcf18"],["/flex_docs/images/touch/152x152.jpg","41764cc32c5550488a1670e6d211e0fc"],["/flex_docs/images/touch/192x192.jpg","d74ebb3b7b88d454b97c8bee0cd73e0f"],["/flex_docs/images/touch/512x512.jpg","0a194c5119d5918e4b32fca44c232d3d"],["/flex_docs/index.html","4667c9a122d0cf1b821b18934ee27061"],["/flex_docs/jekyll/update/2019/10/06/welcome-to-jekyll/index.html","b55ff8ea1a3d8286d849afc4e0507635"],["/flex_docs/jekyll_how_to/index.html","839f813880bc635dbf66c73d6b5f60e5"],["/flex_docs/license/index.html","1d5682bfb27b60246b29dc3afda49875"],["/flex_docs/manifest.json","7daebc2cb267233807bd76b29d8c9d8b"],["/flex_docs/package-lock.json","26963455c3f8c9d57f861c0f67a94b68"],["/flex_docs/plugins/index.html","246e670b2c8b377b606e422958990720"],["/flex_docs/release_notes/index.html","11398c77461d77fcc1cb2a288d4e06f9"],["/flex_docs/scripts/main.min.js","f40ee1b8a0ff09097f4b76ba61ff801d"],["/flex_docs/search/index.html","1adca44d8e2e130e64a74f1503d65c34"],["/flex_docs/talks/index.html","97629f62f588ae4d5f92dabac99dfea0"],["/flex_docs/test_suite/index.html","79831344360aab84b4d68ff53f0c6852"],["/flex_docs/tools_reference/index.html","36a5d16bd2f473e6b6b618e1bbdee353"],["/flex_docs/tutorial/index.html","1b07475426b03a9083adf08f317fae5e"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







