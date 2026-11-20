# Email-to-draft setup (about 10 minutes, once)

Forward a press release to **gm+vv@violetverse.io**. About 5 minutes later you get a reply with the draft and **Publish / Preview / Edit** buttons. Nothing goes live until you tap Publish.

## 1. Vercel: add three environment variables

In the violetverse.io project, open **Settings → Environment Variables**, add these for Production, then **redeploy**:

| Name | Value |
|---|---|
| `EMAIL_DRAFT_SECRET` | A long random password. Make one at https://1password.com/password-generator (40+ characters, letters and numbers only). |
| `EMAIL_DRAFT_AUTHOR_EMAIL` | The email you log in to violetverse.io with. Drafts are posted under that account's name. |
| `EMAIL_DRAFT_ALLOWED` | `gm@violetverse.io` |

`ANTHROPIC_API_KEY` is already set.

## 2. Google: create the script

Signed in as **gm@violetverse.io**:

1. Go to https://script.google.com and click **New project**. Name it "Violet Verse email-to-draft".
2. Delete what's in `Code.gs`, then paste in all of `Code.gs` from this folder. Save.
3. Click **⚙ Project Settings**, scroll to **Script properties**, then **Add script property** for each:

   | Property | Value |
   |---|---|
   | `SITE_URL` | `https://violetverse.io` |
   | `EMAIL_DRAFT_SECRET` | same value as in Vercel |
   | `IMGBB_KEY` | the value of `NEXT_PUBLIC_IMGBB_KEY` in Vercel |
   | `INBOX_ADDRESS` | `gm+vv@violetverse.io` |
   | `ALLOWED_SENDERS` | `gm@violetverse.io` |

4. Go back to the editor, pick **setup** in the function menu at the top, and click **Run**. Google asks for permission to read and send your mail and to connect to outside services. Click **Allow**. (If it says "Google hasn't verified this app", click **Advanced → Go to … (unsafe)**. It's your own script.)

The log says **Ready**. The script now checks every 5 minutes.

## 3. Use it from your phone

- Forward the press release email to **gm+vv@violetverse.io**. Its attachments come along: a PDF or Word release, and the photos.
- **Optional:** type a note above the forwarded message, for example:
  > Focus on the Art Week angle, keep it short. https://youtu.be/xxxx
  A YouTube link in your note becomes the video at the top of the article.
- **Extra photos:** attach them to the forward. The first photo becomes the banner.
- **No forward:** you can also write a new email to gm+vv@ with the release pasted in or attached.

The reply shows up in the same thread. Tap **Publish** for a confirm page with one more **Publish now** button.

## If something goes wrong

- **You got an error reply.** It says what was missing. Fix it and forward again.
- **No reply after 10 minutes.** In the script editor, open **Executions** to see the error. The usual cause is a script property that doesn't match Vercel.
- The labels `vv-done` and `vv-error` in Gmail show what's been handled.
