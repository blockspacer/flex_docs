---
layout: page
title: FAQ.
categories: jekyll update
date:   2016-09-08 11:56:39 +0300
permalink: /jekyll_how_to/
---

## You can find sources of that site on github

https://github.com/blockspacer/flex_docs

# checked versions:
* npm 5.5.1
* node 8.9.1

# Setup

checked on ubuntu 18.04

<nospell><p><code>sudo apt autoremove<br/>
sudo apt update<br/>
sudo apt -y upgrade
</code></p></nospell>

<nospell>
{% highlight bash %}
sudo apt-get install ruby ruby-dev ruby-bundler
sudo gem install bundler
npm install --global gulp-cli
{% endhighlight %}
</nospell>

<nospell>
{% highlight bash %}
rm -rf node_modules
npm cache clean
bundle install
npm install --save-dev babel-core babel-cli babel-preset-es2015
npm install --save-dev gulp
npm install
{% endhighlight %}
</nospell>

<nospell>
{% highlight bash %}
npm run start
{% endhighlight %}
</nospell>

<nospell>
{% highlight bash %}
sudo chmod 777 . -R
sudo chown $USER:$USER -R .
{% endhighlight %}
</nospell>

# How to add new article
**see _docs**.
permalink: ...
title:  "..."
date:   ...
categories: ...

Markdown editor [jekyll-editor for chrome](https://chrome.google.com/webstore/detail/jekyll-editor/dfdkgbhjmllemfblfoohhehdigokocme)
[Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

Use two spaces for newline!

**demo: JSON chart:**

<nospell>
{% highlight js %}
<script>
treeDataJson = JSON.parse(`{% raw  %}{% include data/dpss.json %}{% endraw %}`);
var siblings = [{
    type: "curve",
    source: {
        id: "Bridge",
        name: "Bridge"
    },
    target: {
        id: "sadsad",
        name: "sdaasdsda"
    }
}];
</script>
<div id="techTreeContainer"></div>
{% endhighlight %}
</nospell>


**demo: highlight & endhighlight:**
<nospell>
{% highlight html %}
{% raw %}
<nospell>
{% highlight html %}
<div id="techTreeContainer"></div>
{% endhighlight %}
</nospell>
{% endraw %}
{% endhighlight %}
</nospell>

**Важно**: demo: ***nospell***

<nospell>
{% highlight bash %}
<nospell><p><code>sudo apt autoremove<br/>
sudo apt update<br/>
sudo apt -y upgrade
</code></p></nospell>
{% endhighlight %}
</nospell>

see:
[https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers](https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers)

**demo: raw & endraw**
see [Jekyll & Liquid Cheatsheet](https://gist.github.com/smutnyleszek/9803727#raw)

**demo: details & summary**
<details>
  <summary>demo...</summary>
  <p>

<nospell>
{% highlight txt %}
{"disks_stat_subs_gb": 0, "ifaces": 2, "screens": 1, "startup_ts": 1510300260, "resolutions": {"4MP": 1}, "disks_stat_priv_gb": 0, "capacity": 0, "disks_stat_main_days": 0, "bitrates": {"6000": 1, "-1": 0}, "write_bitrates": [0], "servicepack_level": "MiniNVR%205520/3039", "os_version": "unknown", "nvr_type": "unknown", "grabberpack_level": "unknown", "users": 0, "models": {"AC-D7141IR1": 1, "Mini%20NVR%20PoE": 1}, "iscsi_capacity": 0, "disks_stat_subs_days": 0, "scripts": 0, "iscsi_disks": 0, "channels": 1, "disks": 0, "modules": {"none": 1, "FacSystem": 0, "LprGeneral": 0, "Orion": 0, "PosFolder2": 0, "PosFolder": 0}, "disks_stat_priv_days": 0, "platform_name": "linux%20unknown", "license_type": "unknown", "disks_stat_main_gb": 0, "operation_mode": "linux_nvr"}

{% endhighlight %}
</nospell>

</p></details>

**demo: editor**
<nospell>
{% highlight html %}
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom layers lightbox&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile userAgent=\&quot;Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/62.0.3202.89 Chrome/62.0.3202.89 Safari/537.36\&quot; version=\&quot;8.4.7\&quot; editor=\&quot;www.draw.io\&quot;&gt;&lt;diagram id=\&quot;787718bf-61a2-830c-1549-43c902e07263\&quot; name=\&quot;Page-1\&quot;&gt;zZbbjpswEIafhttVMJsELpvsoRettFKqdnu1cmAWrBqMjAmkT98hNmd2SSXUbqQQ+/fYHj7PTGw5+7h8lDSNvooAuEVWQWk5dxYhtu1u8KdSzlrZbG0thJIFxqgVDuw3GHFl1JwFkPUMlRBcsbQv+iJJwFc9jUopir7Zq+D9XVMawkg4+JSP1R8sUJFWXbJt9c/Awqje2d54euRI/V+hFHli9rOI83r56OGY1muZF80iGoiiIzn3lrOXQijdiss98IptjU3Pe3hjtPFbQqKumUD0hBPlOdQeX/xS55rF5W2gsl9Zzq6ImIJDSv1qtMDTRy1SMceejU1Oj8B3DYS94ELiUCIStN+NvTMOn0AqKDuS8fYRRAxKntHEjHoGnAksu+4X7THZNdyoc0Qbo1ETGWGzcksHGwbQNCznb2DZHwDW+vY/0lrP0/JzeWpgQRJ8qlIXuz6nWcb8Pi3EIM/PJgwvnZ9V52ZddUumnms7bLcjb1LMRC596GWBojIE1TtrCHqFYky6Q3I9AbLWJHCq2KlfXqbomh2eBEN/m4Mkg4Ns1q2X0G9jZnXzfbjQIH/IarCQZjBaCE+GnjtmaWWQXe/w7epdt24HbjnejP27y2ND+9vGaXNiV4XuZj50sXCnVTOCkoYiwUhLQTLcA2SrPtUSmS8GC6S7QwYU1xPpbk9E6XaBdN9ezywQfh5fXnMOylGX0y/HBSkNiyJxJyg5E5S8BSi585RYfLmcXPFH0V4unJ2ZdcfiEH3g7IhPn7P0hUpVNUWc5hiImLIPB8CqK1++iQKfNnFL/N6kSbgA2ya6mrwcs3Un0LoLoPU+ANrvTObZ0ky9f8YUu+3VU9fN9n7v3P8B&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>
<script type="text/javascript" src="https://www.draw.io/js/viewer.min.js"></script>
{% endhighlight %}
</nospell>

<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom layers lightbox&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile userAgent=\&quot;Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/62.0.3202.89 Chrome/62.0.3202.89 Safari/537.36\&quot; version=\&quot;8.4.7\&quot; editor=\&quot;www.draw.io\&quot;&gt;&lt;diagram id=\&quot;787718bf-61a2-830c-1549-43c902e07263\&quot; name=\&quot;Page-1\&quot;&gt;zZbbjpswEIafhttVMJsELpvsoRettFKqdnu1cmAWrBqMjAmkT98hNmd2SSXUbqQQ+/fYHj7PTGw5+7h8lDSNvooAuEVWQWk5dxYhtu1u8KdSzlrZbG0thJIFxqgVDuw3GHFl1JwFkPUMlRBcsbQv+iJJwFc9jUopir7Zq+D9XVMawkg4+JSP1R8sUJFWXbJt9c/Awqje2d54euRI/V+hFHli9rOI83r56OGY1muZF80iGoiiIzn3lrOXQijdiss98IptjU3Pe3hjtPFbQqKumUD0hBPlOdQeX/xS55rF5W2gsl9Zzq6ImIJDSv1qtMDTRy1SMceejU1Oj8B3DYS94ELiUCIStN+NvTMOn0AqKDuS8fYRRAxKntHEjHoGnAksu+4X7THZNdyoc0Qbo1ETGWGzcksHGwbQNCznb2DZHwDW+vY/0lrP0/JzeWpgQRJ8qlIXuz6nWcb8Pi3EIM/PJgwvnZ9V52ZddUumnms7bLcjb1LMRC596GWBojIE1TtrCHqFYky6Q3I9AbLWJHCq2KlfXqbomh2eBEN/m4Mkg4Ns1q2X0G9jZnXzfbjQIH/IarCQZjBaCE+GnjtmaWWQXe/w7epdt24HbjnejP27y2ND+9vGaXNiV4XuZj50sXCnVTOCkoYiwUhLQTLcA2SrPtUSmS8GC6S7QwYU1xPpbk9E6XaBdN9ezywQfh5fXnMOylGX0y/HBSkNiyJxJyg5E5S8BSi585RYfLmcXPFH0V4unJ2ZdcfiEH3g7IhPn7P0hUpVNUWc5hiImLIPB8CqK1++iQKfNnFL/N6kSbgA2ya6mrwcs3Un0LoLoPU+ANrvTObZ0ky9f8YUu+3VU9fN9n7v3P8B&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>
<script type="text/javascript" src="https://www.draw.io/js/viewer.min.js"></script>

see File - Embed- HTML

# demo: tags
see _category:

<nospell>
{% highlight txt %}
layout: category
title:  "..."
date:   2018-01-08 11:56:39 +0300
root: "../"
category: ...
permalink: /category/.../
{% endhighlight %}
</nospell>

run `npm run start`, see `category/`

example:
{% highlight txt %}
categories: [docs, microservice, pcloud_licensor]
{% endhighlight %}

# Editors
[https://github.com/ashmaroli/jekyll-manager](https://github.com/ashmaroli/jekyll-manager)
 `bundle exec jekyll serve --watch`
[http://localhost:4000/admin](http://localhost:4000/admin)

`gulp admin`
[http://localhost:3000](http://localhost:3000)
[http://127.0.0.1:4096/admin](http://127.0.0.1:4096/admin)
clear browser cache (ctrl+shift+r).

check logs
`bundle exec jekyll serve --watch`

# typo correction
`sudo apt-get install aspell aspell-ru aspell-en -y`

see [http://aspell.net/win32/](http://aspell.net/win32/)

1. Font "lucida console"
2. coding "chcp 1252"

2. Examples.

<nospell>
{% highlight bah %}
cat _docs/bridge.md | aspell --lang=hu list --home-dir=. --data-dir=. --dict-dir=. --personal=dictionary_ru.txt --encoding=utf-8 | sort -u
{% endhighlight %}
</nospell>

<nospell>
{% highlight bah %}
aspell --lang=hu --home-dir=. --data-dir=. --dict-dir=. --personal=dictionary_ru.txt --encoding=utf-8 --mode=html --add-html-skip=nospell --add-sgml-skip=nospell --mode=html -x -c  _docs/bridge.md
{% endhighlight %}
</nospell>

<nospell>
{% highlight bah %}
find . _docs -maxdepth 1 -name "**.md" -exec aspell --lang=hu --home-dir=. --data-dir=. --dict-dir=. --personal=dictionary_ru.txt --encoding=utf-8 --mode=html --add-html-skip=nospell --add-sgml-skip=nospell --mode=html -x -c  {} \;
{% endhighlight %}
</nospell>

Hotkeys:
* a - add word
* r - fix typo
* x - exit
* i - skip

see:
* [https://unix.stackexchange.com/a/341715](https://unix.stackexchange.com/a/341715)
* [https://opensource.com/article/18/2/how-check-spelling-linux-command-line-aspell](https://opensource.com/article/18/2/how-check-spelling-linux-command-line-aspell)

3. Demo: nospell
{% highlight txt %}
<nospell>...</nospell>
{% endhighlight %}

{% highlight txt %}
<nospell>
`gem uninstall jekyll`
`gem install jekyll -v 3.7.2`
</nospell>
{% endhighlight %}

**Demo: .hint**
<nospell>
{% highlight txt %}
{% raw  %}
{{ site.data.global.dpss.hint }}
{% endraw  %}
{% endhighlight %}
</nospell>
{{ site.data.global.dpss.hint }}

**Demo: filtered**
<nospell>
{% highlight txt %}
{% raw  %}
{% assign filtered = site.data.global.pages | where: "id", "about" %}
{{ filtered[0].text }}
{% endraw  %}
{% endhighlight %}
</nospell>
{% assign filtered = site.data.global.pages | where: "id", "about" %} {{ filtered[0].text }}
* Demo: print vars:
<nospell>
{% highlight txt %}
{% raw  %}
{{ site.data.global.dpss | inspect }}
{% endraw  %}
{% endhighlight %}
</nospell>

{{ site.data.global.dpss | inspect }}

# Setup

1 [http://yeoman.io/codelab/index.html](http://yeoman.io/codelab/index.html)
`npm install -g yo`

2 [https://github.com/nirgn975/generator-jekyll-starter-kit](https://github.com/nirgn975/generator-jekyll-starter-kit)
`npm install -g generator-jekyll-starter-kit`

3
`yo jekyll-starter-kit`

* Error: EACCES: permission denied - [https://github.com/yeoman/yeoman/issues/1097](https://github.com/yeoman/yeoman/issues/1097)
`sudo chown $USER:$USER /home/$USER/.config/configstore/ -R`

4
[https://github.com/yihangho/emoji-for-jekyll](https://github.com/yihangho/emoji-for-jekyll)

5
[https://medium.com/@nirgn/jekyll-starter-kit-generator-2-1-0-is-out-5e2efd2311d9](https://medium.com/@nirgn/jekyll-starter-kit-generator-2-1-0-is-out-5e2efd2311d9)
[https://programminghistorian.org/lessons/building-static-sites-with-jekyll-github-pages](https://programminghistorian.org/lessons/building-static-sites-with-jekyll-github-pages)
[https://learn.cloudcannon.com/](https://learn.cloudcannon.com/)
[http://anandmanisankar.com/posts/jekyll-starter-scaffold-blog-yeoman/](http://anandmanisankar.com/posts/jekyll-starter-scaffold-blog-yeoman/)
[http://anandmanisankar.com/jekyllstarter/](http://anandmanisankar.com/jekyllstarter/)
[https://habrahabr.ru/post/336266/](https://habrahabr.ru/post/336266/)
[https://github.com/planetjekyll/awesome-jekyll](https://github.com/planetjekyll/awesome-jekyll)
[https://ben.balter.com/2015/02/20/jekyll-collections/](https://ben.balter.com/2015/02/20/jekyll-collections/)
[https://mademistakes.com/articles/using-jekyll-2017/](https://mademistakes.com/articles/using-jekyll-2017/)
[https://novelist.xyz/tech/performant-jekyll-site-with-gulp-cloudflare/](https://novelist.xyz/tech/performant-jekyll-site-with-gulp-cloudflare/)

6
[http://osfameron.github.io/jekyll-plugins-tutorial/](http://osfameron.github.io/jekyll-plugins-tutorial/)
[https://maxchadwick.xyz/blog/building-a-custom-jekyll-command-plugin](https://maxchadwick.xyz/blog/building-a-custom-jekyll-command-plugin)

`bundle install`
`gem build YOUR_PLUGIN.gemspec`
