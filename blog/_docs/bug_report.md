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

flextool version
Original source code.
Used plugins
Environment information — including compiler versions
Error symptoms.
Proposed solutions, ideally with a pull request.

## How to debug in case of crash or bugs

Build with `-s build_type=Debug`

You can manually run some `app_name` under `gdb` debugger https://www.gnu.org/software/gdb/

```bash
gdb -ex "r" -ex "bt" --args app_name .........
```

## Debugging with Sanitizers

that page in development

## Profiling performance and tracing

that page in development

## Increasing log level

that page in development

## Site and documentation bugs

Documentation (site) bugs should be filed in the same Issue Tracker.

Include relevant information including:

The URL and title of the affected page(s).
A description of the problem.
Suggestions for a possible solution.
Tip

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page
