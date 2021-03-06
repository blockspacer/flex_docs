---
layout: post
title:  "bug_report"
categories: [docs, common]
root: "../"
pin: true
permalink: /bug_report/
---

Bug reports can be posted in the GitHub Issue Tracker https://github.com/blockspacer/flextool/issues

Please supply as much relevant information as possible, including:

- Used version
- Original source code.
- Used plugins
- Environment information including compiler versions
- Error symptoms.
- Proposed solutions, ideally with a pull request.

## How to debug in case of crash or bugs

Build with `-s build_type=Debug`

You can manually run some `app_name` under `gdb` debugger https://www.gnu.org/software/gdb/

```bash
gdb -ex "r" -ex "bt" --args app_name .........
```

## How to increase log level

Add command-line arguments:

```bash
--vmodule=*main*=100,*=200 --enable-logging=stderr --log-level=100
```

see https://www.chromium.org/for-testers/enable-logging

## How to capture trace report

Add command-line arguments:

```bash
--start_tracing --tracing_categories=*,disabled-by-default-memory-infra
```

After app close event trace report will be saved into json file.

You can view saved trace report in `chrome://tracing/`

see
https://aras-p.info/blog/2017/01/23/Chrome-Tracing-as-Profiler-Frontend/
https://www.chromium.org/developers/how-tos/trace-event-profiling-tool/trace-event-reading
https://www.chromium.org/developers/how-tos/trace-event-profiling-tool
https://www.chromium.org/developers/how-tos/trace-event-profiling-tool/using-frameviewer
https://slack.engineering/chrome-tracing-for-fun-and-profit-a15ec83aa908

## Currently tool does not support compilation database

Currently tool does not support compilation database, so ignore warning about missing compilation database

## Debugging with Sanitizers

See details about sanitizers in [README.md](https://github.com/blockspacer/flextool/blob/master/README.md) file.

## Profiling performance

that page in development

## Site and documentation bugs

Documentation (site) bugs should be filed in the same Issue Tracker.

Include relevant information including:

- The URL and title of the affected page(s).
- A description of the problem.
- Suggestions for a possible solution.

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page
