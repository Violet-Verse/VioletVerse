# vv-publish

Turns a Markdown, Word (.docx) or HTML article into a **hidden draft** on violetverse.io. Nothing goes live until you run `publish` or untick "hidden" on /drafts.

It talks to the same endpoints as `/posts/create`, so the site doesn't need any changes.

## Setup (once)

```bash
cd tools/vv-publisher
npm install
cp .env.example .env   # fill in VV_EMAIL, VV_ADMIN_KEY, IMGBB_KEY (+ ANTHROPIC_API_KEY for --ai)
npm link               # optional: makes `vv-publish` available everywhere
```

`VV_ADMIN_KEY` is the site's `ADMIN_LOGIN_SECRET` (the key you use on /login). `IMGBB_KEY` is the site's `NEXT_PUBLIC_IMGBB_KEY`. Both are in the Vercel project's environment variables.

## Writing an article

Markdown with optional front matter:

```markdown
---
title: Art Basel Miami 2026: Where Fintech Meets Fine Art   # or use a "# Heading" line
subtitle: Collectors and builders share the floor
tldr: Art week keeps pulling in a new crowd.
category: Lifestyle        # Tech | Lifestyle | Education
banner: ./cover.jpg        # local file or URL
---

Body text... ![caption](./photo.jpg)
```

Word docs work too: the first Heading 1 becomes the title, and embedded photos are uploaded automatically. Pass the other fields as flags.

## Use

```bash
vv-publish draft art-basel.md --dry-run      # local preview (vv-preview.html), sends nothing
vv-publish draft art-basel.md                # creates the hidden draft, prints preview link
vv-publish draft notes.docx --ai --banner cover.jpg   # Claude fills a missing subtitle/TL;DR/category
vv-publish list                              # your drafts
vv-publish publish <slug>                    # go live
vv-publish unpublish <slug>                  # hide it again
```

Safety: every post is created hidden. Running `draft` again with the same title is refused unless you add `--force`.
