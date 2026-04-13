---
templateKey: blog-post
title: "Hello World: Our Blog Has a New Home"
date: 2026-04-13T00:00:00.000Z
author: Nick Gamb
description: "The Maverics blog has moved from WordPress to a modern static site. Here's what changed, what didn't, and why we did it."
featuredpost: false
featuredimage: /img/blog/hello-world-hero.png
category: Engineering
tags:
  - Engineering
  - Strata
---

The Maverics blog has moved from WordPress to a modern static site. Here's what changed, what didn't, and why we did it.

## Why We Moved

We build an identity orchestration platform that governs AI agents at the infrastructure layer. Our blog publishing workflow should reflect that same engineering rigor — version-controlled, reviewable, and fast.

WordPress served us well, but the publishing process had friction. A blog post could take two or more weeks from draft to publish. Writing happened in one tool, review in another, and publishing in a third. Formatting broke at every handoff. Images had to be re-uploaded manually. Context was lost between versions.

We wanted a workflow where writing, reviewing, and publishing all happen in the same place.

## What Changed

The site is now built with Gatsby, hosted on Netlify, and managed entirely through Git.

**Writing** happens in Markdown, directly in the repo. Authors can use Claude Code to draft posts — describe what you want to write and it creates the post with correct formatting, frontmatter, and structure. Or write Markdown by hand. Either way, the source of truth is a file in the repository.

**Review** happens through pull requests. Every blog post is a PR. Reviewers see a live Netlify preview of exactly what will go live — not a Google Doc approximation. Feedback is tracked in the PR. Nothing gets lost.

**Publishing** is a merge. When a PR is approved and merged to main, Netlify rebuilds the site automatically. The post is live within minutes.

This is the same workflow we use for the Maverics documentation site and our Blueprints demo repository. The team already knows how it works.

## What Didn't Change

All existing URLs, routes, and SEO metadata are preserved. If you bookmarked a blog post before, that link still works. Search engine rankings carry over. The site looks the same to visitors.

## What's Next

This is the foundation. The Git-based workflow opens the door to scheduled publishing, automated content pipelines, and agent-driven content — all built on the same PR review process that keeps humans in the loop.

For now, we're just happy that publishing a blog post takes hours instead of weeks.

Welcome to the new home. More posts coming soon.
