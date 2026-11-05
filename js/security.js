/*
 * security.js — shared, dependency-free helpers.
 *
 * Everything rendered from user or demo data passes through esc()/attr() before
 * it reaches innerHTML. This is the single most important habit in a client-side
 * app: never concatenate raw input into markup.
 */
(function (global) {
  'use strict';

  var CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

  function esc(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function attr(value) {
    return esc(value);
  }

  function text(value, maxLength) {
    var limit = typeof maxLength === 'number' ? maxLength : 400;
    return String(value === null || value === undefined ? '' : value)
      .replace(CONTROL_CHARS, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, limit);
  }

  function multiline(value, maxLength) {
    var limit = typeof maxLength === 'number' ? maxLength : 4000;
    return String(value === null || value === undefined ? '' : value)
      .replace(/\r\n/g, '\n')
      .replace(CONTROL_CHARS, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, limit);
  }

  function money(value) {
    var number = Number(value);
    if (!isFinite(number)) number = 0;
    return (
      '$' +
      number.toLocaleString('en-US', {
        minimumFractionDigits: number % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
      })
    );
  }

  function clamp(value, min, max) {
    var number = Number(value);
    if (!isFinite(number)) number = min;
    return Math.min(max, Math.max(min, number));
  }

  function uid(prefix) {
    var head = prefix ? String(prefix) + '-' : '';
    try {
      if (global.crypto && typeof global.crypto.randomUUID === 'function') {
        return head + global.crypto.randomUUID();
      }
      if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
        var bytes = new Uint8Array(8);
        global.crypto.getRandomValues(bytes);
        var hex = Array.prototype.map
          .call(bytes, function (byte) {
            return byte.toString(16).padStart(2, '0');
          })
          .join('');
        return head + hex;
      }
    } catch (error) {
      /* fall through to the time-based id */
    }
    return head + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function isEmail(value) {
    var candidate = String(value || '').trim();
    if (candidate.length < 6 || candidate.length > 160) return false;
    return /^[^\s@<>]+@[^\s@<>]+\.[A-Za-z]{2,}$/.test(candidate);
  }

  function isPhone(value) {
    var candidate = String(value || '').trim();
    return candidate.length >= 7 && candidate.length <= 24 && /^[+()\d\s.\-ext]+$/i.test(candidate);
  }

  function isGrade(value) {
    var grade = Number(value);
    return Number.isInteger(grade) && grade >= 1 && grade <= 8;
  }

  /* Constant-time-ish comparison. Client-side auth is a demo boundary, not real
   * security, but this still avoids the most obvious timing shortcut. */
  function safeEqual(a, b) {
    var left = String(a === null || a === undefined ? '' : a);
    var right = String(b === null || b === undefined ? '' : b);
    var length = Math.max(left.length, right.length);
    var diff = left.length === right.length ? 0 : 1;
    for (var index = 0; index < length; index += 1) {
      diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
    }
    return diff === 0;
  }

  function readJSON(storage, key) {
    try {
      var raw = storage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function writeJSON(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(storage, key) {
    try {
      storage.removeItem(key);
    } catch (error) {
      /* ignore */
    }
  }

  function download(filename, content, type) {
    try {
      var blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      global.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
      return true;
    } catch (error) {
      return false;
    }
  }

  function copy(value) {
    var content = String(value || '');
    if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
      return global.navigator.clipboard.writeText(content).then(
        function () {
          return true;
        },
        function () {
          return false;
        }
      );
    }
    try {
      var area = document.createElement('textarea');
      area.value = content;
      area.setAttribute('readonly', 'readonly');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand('copy');
      area.remove();
      return Promise.resolve(ok);
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  global.MoodySecurity = {
    esc: esc,
    attr: attr,
    text: text,
    multiline: multiline,
    money: money,
    clamp: clamp,
    uid: uid,
    isEmail: isEmail,
    isPhone: isPhone,
    isGrade: isGrade,
    safeEqual: safeEqual,
    readJSON: readJSON,
    writeJSON: writeJSON,
    remove: remove,
    download: download,
    copy: copy
  };
})(window);
