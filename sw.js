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

var precacheConfig = [["/docsspace/2019/10/06/index.html","5c4337b93f2abeff3ab6e7d56964193c"],["/docsspace/2019/10/index.html","5af80c4d39af1cb108cd8e25013a002e"],["/docsspace/2019/index.html","43cd00cc970b50f83c884cb335bf0fdc"],["/docsspace/404.html","06e363c874f4d24357a64d4a402713ca"],["/docsspace/about/index.html","2b5f75bca5b662031ee19e8052b14303"],["/docsspace/adding_plugins/index.html","01db7d89e825fd1467f3a7efe3dfa927"],["/docsspace/api_reference/index.html","ce71ce3d20ae08b4ae5a7f5e5b801b79"],["/docsspace/archive/jekyll/index.html","c314bdc540075b88f636dda4aa40396e"],["/docsspace/archive/update/index.html","fb9f90c127c06e64120cbb930747875f"],["/docsspace/bug_report/index.html","257434fd8b7a7efba3d985cf3b7801c0"],["/docsspace/building_projects/index.html","05f7374a61e5177bb94c6ca555e1dfb1"],["/docsspace/category/common/index.html","090943a91932170b77007d89a404167f"],["/docsspace/category/docs/index.html","742f779e8e84faf79870a9d3a1b8b22b"],["/docsspace/category/index.html","e45c664acc2f60a32ca2bef7fc6aa1f3"],["/docsspace/common/index.html","5e4b5177a7759e9669bc6822adbcd128"],["/docsspace/community/index.html","96a1e58e2277180ad7f3e830e39fbba5"],["/docsspace/css/main-14528dc11f.css","35fa29cf6f4aded1a43bd94100fe3724"],["/docsspace/css/main-6019747c99.css","35fa29cf6f4aded1a43bd94100fe3724"],["/docsspace/css/main.css","6af83036e9a5c48c2f4b524035537aaf"],["/docsspace/css/main.min.css","6af83036e9a5c48c2f4b524035537aaf"],["/docsspace/developer_docs/index.html","491b11194d4df3c609ccc6d510b55169"],["/docsspace/download/index.html","5ab1ce8df1b8768b99965a7845297360"],["/docsspace/faq/index.html","c452910b54b2ef7bed15cc6a1ea409d1"],["/docsspace/flexlib/index.html","9384495ad6d9ac44e90e4b872d34905e"],["/docsspace/flextool/index.html","36740437473fb7e45ebbb98b7af949c7"],["/docsspace/images/database.png","9ba07f582e158f58dec485f9b3c0b25f"],["/docsspace/images/favicons/apple-touch-icon.png","2add0d1d0b1c909c5e71d37a968bffcb"],["/docsspace/images/favicons/favicon-16x16.png","71a57c78742fa710910b09df78500767"],["/docsspace/images/favicons/favicon-32x32.png","3506cd376729cda5ccefa170eb98d981"],["/docsspace/images/grid15.png","92472ec6f3aed0a4f5fe2a17adb994f4"],["/docsspace/images/logo.png","48a271bb529450303d92fed24803d5a9"],["/docsspace/images/touch/128x128.jpg","48a9618b4901444fec3e100f4da40847"],["/docsspace/images/touch/144x144.jpg","69b62e8796065415fad8c885bb6dcf18"],["/docsspace/images/touch/152x152.jpg","41764cc32c5550488a1670e6d211e0fc"],["/docsspace/images/touch/192x192.jpg","d74ebb3b7b88d454b97c8bee0cd73e0f"],["/docsspace/images/touch/512x512.jpg","0a194c5119d5918e4b32fca44c232d3d"],["/docsspace/index.html","3d4020a90ebdd4ae422aba789ce94ddf"],["/docsspace/jekyll/update/2019/10/06/welcome-to-jekyll/index.html","3a80306132e8b86e105f3b2238360ba7"],["/docsspace/jekyll_how_to/index.html","c8465bc50f82c28d16d1156916f2d9ca"],["/docsspace/license/index.html","b1dc35b554b627dc12e211ecafdf7902"],["/docsspace/manifest.json","7daebc2cb267233807bd76b29d8c9d8b"],["/docsspace/package-lock.json","26963455c3f8c9d57f861c0f67a94b68"],["/docsspace/plugins/index.html","877ffea0b1967fe160dadcb9fb7cfd0f"],["/docsspace/release_notes/index.html","c33617bd784f1486e136db11223ec589"],["/docsspace/scripts/main.min.js","f40ee1b8a0ff09097f4b76ba61ff801d"],["/docsspace/search/index.html","6d8300c8e5f05c1cb726aef796225f23"],["/docsspace/talks/index.html","cff38d00fb0dd126612227ec76bd1a55"],["/docsspace/test_suite/index.html","2c96b7779afc64048c275e703733b423"],["/docsspace/tools_reference/index.html","e868835cd7493ad19d0d60f30b1e65f7"],["/docsspace/tutorial/index.html","a4955d061556391f50f99f0237757ba0"]];
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







