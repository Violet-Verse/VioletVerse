/**
 * Violet Verse: email-to-draft
 *
 * Forward a press release (with photos, and a note at the top if you like) to
 * gm+vv@violetverse.io. Every 5 minutes this script picks it up, has Claude write
 * the article on violetverse.io as a HIDDEN draft, and replies with
 * Preview / Edit / Publish links. Nothing goes live until you tap Publish.
 *
 * Setup: see SETUP.md. Script properties needed:
 *   SITE_URL            https://violetverse.io
 *   EMAIL_DRAFT_SECRET  same value as in Vercel
 *   IMGBB_KEY           same value as NEXT_PUBLIC_IMGBB_KEY in Vercel
 *   INBOX_ADDRESS       gm+vv@violetverse.io
 *   ALLOWED_SENDERS     gm@violetverse.io   (comma-separated)
 */

var LABEL_DONE = 'vv-done';
var LABEL_ERROR = 'vv-error';
var LABEL_WORKING = 'vv-working';
var MAX_PHOTOS = 8;
var MIN_PHOTO_BYTES = 15 * 1024;          // skip logos and signature icons
var MAX_DOC_BYTES = 3 * 1024 * 1024;      // site upload limit
var DOC_TYPES = /\.(pdf|docx|txt|md)$/i;

/** Run once from the editor: creates labels and the 5-minute trigger. */
function setup() {
  [LABEL_DONE, LABEL_ERROR, LABEL_WORKING].forEach(function (name) {
    if (!GmailApp.getUserLabelByName(name)) GmailApp.createLabel(name);
  });
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'checkInbox') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('checkInbox').timeBased().everyMinutes(5).create();
  config_(); // fails loudly now if a property is missing
  Logger.log('Ready. Forward a press release to ' + config_().inbox);
}

/** Runs every 5 minutes. */
function checkInbox() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return; // previous run still going
  try {
    var cfg = config_();
    var query = 'to:' + cfg.inbox + ' -label:' + LABEL_DONE + ' -label:' + LABEL_ERROR +
      ' -label:' + LABEL_WORKING + ' newer_than:7d';
    GmailApp.search(query, 0, 5).forEach(function (thread) {
      var msg = pickMessage_(thread, cfg);
      if (!msg) return;
      thread.addLabel(label_(LABEL_WORKING));
      try {
        var result = handleMessage_(msg, cfg);
        msg.reply('', { htmlBody: successHtml_(result) });
        thread.addLabel(label_(LABEL_DONE));
      } catch (err) {
        msg.reply('', { htmlBody: errorHtml_(err) });
        thread.addLabel(label_(LABEL_ERROR));
      } finally {
        thread.removeLabel(label_(LABEL_WORKING));
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function config_() {
  var p = PropertiesService.getScriptProperties();
  var get = function (k) {
    var v = p.getProperty(k);
    if (!v) throw new Error('Missing script property ' + k + ' (Project Settings → Script properties).');
    return v.trim();
  };
  return {
    site: get('SITE_URL').replace(/\/$/, ''),
    secret: get('EMAIL_DRAFT_SECRET'),
    imgbbKey: get('IMGBB_KEY'),
    inbox: get('INBOX_ADDRESS').toLowerCase(),
    allowed: get('ALLOWED_SENDERS').toLowerCase().split(',').map(function (s) { return s.trim(); })
  };
}

function label_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function emailOf_(s) {
  var m = String(s || '').match(/[^\s<>"]+@[^\s<>"]+/);
  return m ? m[0].toLowerCase() : '';
}

/** Latest message in the thread sent to the inbox address by an allowed sender. */
function pickMessage_(thread, cfg) {
  var msgs = thread.getMessages();
  for (var i = msgs.length - 1; i >= 0; i--) {
    var m = msgs[i];
    var to = (m.getTo() + ',' + m.getCc()).toLowerCase();
    if (to.indexOf(cfg.inbox) !== -1 && cfg.allowed.indexOf(emailOf_(m.getFrom())) !== -1) return m;
  }
  return null;
}

function handleMessage_(msg, cfg) {
  var parts = splitNoteAndRelease(msg.getPlainBody());
  var photos = [];
  var file = null;
  var skipped = [];

  msg.getAttachments({ includeInlineImages: true, includeAttachments: true }).forEach(function (a) {
    var type = a.getContentType() || '';
    var name = a.getName() || 'file';
    if (type.indexOf('image/') === 0) {
      if (a.getSize() < MIN_PHOTO_BYTES || photos.length >= MAX_PHOTOS) return;
      photos.push(uploadImage_(a, cfg));
    } else if (!file && (type === 'application/pdf' || DOC_TYPES.test(name))) {
      if (a.getSize() > MAX_DOC_BYTES) { skipped.push(name + ' (over 3 MB)'); return; }
      file = { name: name, type: type, base64: Utilities.base64Encode(a.getBytes()) };
    }
  });

  var release = parts.release;
  var note = parts.note;
  if (!release && !file) {
    // Nothing forwarded: treat the whole email as the press release.
    release = note;
    note = '';
  }
  if (!release && !file) throw new Error('I couldn\'t find a press release in that email. Forward it, paste it, or attach the PDF.');

  var res = UrlFetchApp.fetch(cfg.site + '/api/ai/emailDraft', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.secret },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      from: msg.getFrom(),
      subject: msg.getSubject(),
      note: note,
      releaseText: release,
      file: file,
      photos: photos,
      videoUrl: findYouTube(note)
    })
  });
  var data = {};
  try { data = JSON.parse(res.getContentText()); } catch (e) {}
  if (res.getResponseCode() !== 200) {
    throw new Error(data.error || ('violetverse.io returned ' + res.getResponseCode()));
  }
  data.skipped = skipped;
  data.photoCount = photos.length;
  return data;
}

function uploadImage_(attachment, cfg) {
  var res = UrlFetchApp.fetch('https://api.imgbb.com/1/upload?key=' + encodeURIComponent(cfg.imgbbKey), {
    method: 'post',
    muteHttpExceptions: true,
    payload: { image: Utilities.base64Encode(attachment.getBytes()), name: attachment.getName() }
  });
  var data = {};
  try { data = JSON.parse(res.getContentText()); } catch (e) {}
  if (!data.data || !data.data.url) throw new Error('Photo upload failed for ' + attachment.getName() + '.');
  return data.data.url;
}

/**
 * Your note is whatever you type above the forwarded message.
 * Works with Gmail ("---------- Forwarded message ---------") and
 * iPhone Mail ("Begin forwarded message:").
 */
function splitNoteAndRelease(body) {
  var text = String(body || '').replace(/\r\n/g, '\n');
  var marker = /^[ \t>]*(-{3,}\s*Forwarded message\s*-{3,}|Begin forwarded message:|-{3,}\s*Original Message\s*-{3,})/im;
  var m = text.match(marker);
  if (!m) return { note: text.trim(), release: '' };
  var note = text.slice(0, m.index).trim();
  var release = text.slice(m.index + m[0].length).trim();
  note = note.replace(/\n--\s*\n[\s\S]*$/, '').replace(/\nSent from my \w+[\s\S]*$/i, '').trim();
  return { note: note, release: release };
}

/** First YouTube link in your note becomes the article's video header. */
function findYouTube(text) {
  var m = String(text || '').match(/https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+[^\s<>"]*/i);
  return m ? m[0] : '';
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function button_(href, label, primary) {
  return '<a href="' + esc_(href) + '" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 20px;border-radius:8px;' +
    'text-decoration:none;font-weight:600;' + (primary ? 'background:#3b1220;color:#fff;' : 'background:#eee;color:#222;') + '">' +
    esc_(label) + '</a>';
}

function successHtml_(r) {
  var notes = (r.editorNotes || []).map(function (n) { return '<li>' + esc_(n) + '</li>'; }).join('');
  var skipped = (r.skipped || []).map(function (n) { return '<li>Skipped ' + esc_(n) + '</li>'; }).join('');
  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;max-width:560px">' +
    '<p><strong>Draft ready</strong> (hidden). Nothing is live until you tap Publish.</p>' +
    (r.banner ? '<img src="' + esc_(r.banner) + '" style="width:100%;max-width:560px;border-radius:8px" alt="">' : '') +
    '<h2 style="margin:12px 0 4px">' + esc_(r.title) + '</h2>' +
    '<p style="margin:0 0 4px;color:#555">' + esc_(r.subtitle) + '</p>' +
    '<p style="margin:0 0 12px;color:#888">' + esc_(r.category) + ' · ' + r.photoCount + ' photo(s)' + (r.video ? ' · video' : '') + '</p>' +
    button_(r.publishUrl, 'Publish', true) + button_(r.previewUrl, 'Preview', false) + button_(r.editUrl, 'Edit', false) +
    (notes ? '<p style="margin-top:16px"><strong>Check before publishing:</strong></p><ul>' + notes + '</ul>' : '') +
    (skipped ? '<ul style="color:#a00">' + skipped + '</ul>' : '') +
    '<p style="color:#999;font-size:12px;margin-top:16px">The Publish link works for 14 days.</p></div>';
}

function errorHtml_(err) {
  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px">' +
    '<p><strong>Couldn\'t make a draft from this email.</strong></p><p>' + esc_(err && err.message || err) + '</p>' +
    '<p style="color:#888">Fix it and forward the email again.</p></div>';
}
