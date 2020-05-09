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

var precacheConfig = [["/docsspace/2019/10/06/index.html","0e48fcae4ddb777f10c6dcd617880bb3"],["/docsspace/2019/10/index.html","12bc7fb05f6777fcc49bb4f875101a59"],["/docsspace/2019/index.html","7a6020750ed607cbdd40768bef3dcdbe"],["/docsspace/404.html","fbe41fa533e284951377bfc16b917541"],["/docsspace/about/index.html","f9ca4d8d841dd18f80d991da01d85a6c"],["/docsspace/adding_plugins/index.html","6143d0f3fae1f808ab5c1735cd83d66e"],["/docsspace/api_reference/index.html","ccdfcc56968b8adbc316e874f61dd662"],["/docsspace/archive/jekyll/index.html","0ad87c1624a5a146730b00f980943464"],["/docsspace/archive/update/index.html","dd5eba56157d1d54d5b3bcb1ea851247"],["/docsspace/bug_report/index.html","c404ecfbd031f41e95f857cfb3556ea7"],["/docsspace/building_projects/index.html","c95c3a90e4bfed19587df31a90c63133"],["/docsspace/category/common/index.html","aeb3b2224ac6354ffb31789833553e6e"],["/docsspace/category/docs/index.html","e3748b6968b9141f1064db86ad2fc007"],["/docsspace/category/index.html","c8909477865e6f28793e87d31a183810"],["/docsspace/common/index.html","09cd98140b3eaa0f3eb05e80ab46035a"],["/docsspace/community/index.html","729540c405e8a50282e0abce7b64d33d"],["/docsspace/css/main-14528dc11f.css","35fa29cf6f4aded1a43bd94100fe3724"],["/docsspace/css/main-6019747c99.css","35fa29cf6f4aded1a43bd94100fe3724"],["/docsspace/css/main.css","6af83036e9a5c48c2f4b524035537aaf"],["/docsspace/css/main.min.css","6af83036e9a5c48c2f4b524035537aaf"],["/docsspace/developer_docs/index.html","f8b2b25fc357c972d37b8d6e11802387"],["/docsspace/download/index.html","dd980864da0dfe2b390fc522fc349f64"],["/docsspace/faq/index.html","ccd4102617dc2c69962f31240061952f"],["/docsspace/flexlib/index.html","fe5c05e56daba969cfa4a964c725c54d"],["/docsspace/flextool/index.html","1f349e3394fed41b33d64e67790982d9"],["/docsspace/images/database.png","9ba07f582e158f58dec485f9b3c0b25f"],["/docsspace/images/favicons/apple-touch-icon.png","2add0d1d0b1c909c5e71d37a968bffcb"],["/docsspace/images/favicons/favicon-16x16.png","71a57c78742fa710910b09df78500767"],["/docsspace/images/favicons/favicon-32x32.png","3506cd376729cda5ccefa170eb98d981"],["/docsspace/images/grid15.png","92472ec6f3aed0a4f5fe2a17adb994f4"],["/docsspace/images/logo.png","5d33451198019aa289b18be714f9fc02"],["/docsspace/images/touch/128x128.jpg","48a9618b4901444fec3e100f4da40847"],["/docsspace/images/touch/144x144.jpg","69b62e8796065415fad8c885bb6dcf18"],["/docsspace/images/touch/152x152.jpg","41764cc32c5550488a1670e6d211e0fc"],["/docsspace/images/touch/192x192.jpg","d74ebb3b7b88d454b97c8bee0cd73e0f"],["/docsspace/images/touch/512x512.jpg","0a194c5119d5918e4b32fca44c232d3d"],["/docsspace/index.html","e7b9e65dd58c4d04d07643cfed2ac0b1"],["/docsspace/jekyll/update/2019/10/06/welcome-to-jekyll/index.html","3e1c9d69667a0576d3620a20e0a809fa"],["/docsspace/jekyll_how_to/index.html","8f07672e081e42cbe6b027089e5500bc"],["/docsspace/license/index.html","eb53159cb46b86b4fda5c454bac2dae2"],["/docsspace/manifest.json","7daebc2cb267233807bd76b29d8c9d8b"],["/docsspace/package-lock.json","26963455c3f8c9d57f861c0f67a94b68"],["/docsspace/plugins/index.html","4f28df272bce0cf9454c376589163109"],["/docsspace/release_notes/index.html","180891344e9a5f671205ba81cfb741e9"],["/docsspace/scripts/main.min.js","f40ee1b8a0ff09097f4b76ba61ff801d"],["/docsspace/search/index.html","056fb813b3575378e644d745946e0895"],["/docsspace/talks/index.html","c0b22a3795c8c5bed13432b9ed7dc52d"],["/docsspace/test_suite/index.html","ba7dee1cd973ea3ef07709041818ec63"],["/docsspace/tools_reference/index.html","c8aade73b407163a7502ba22c6a0f1d5"],["/docsspace/tutorial/index.html","7bf746b9d7c451ff897b684bf842eee2"]];
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







