const init = require('domready');
const data = require('./data');
const el = require('el');
const trip = require('furkot-trip')();
let parseDone;
let onDone;

/*global window, document */

module.exports = done;

function done(fn) {
  if (fn) {
    if (parseDone) {
      return fn();
    }
    onDone = fn;
  }
}

function getStop(coords, item) {
  return {
    name: data.text(item.querySelector('[itemprop="name"]')) || '',
    address: data.address(item.querySelector('[itemprop="address"]')) || '',
    coordinates: coords,
    notes: data.text(item.querySelector('[itemprop="description"]'), 256) || '',
    url: window.location.href,
    pin: data.pin(item) || ''
  };
}

function findForm(btn) {
  const formId = btn.getAttribute('form');
  if (formId) {
    return document.querySelector('form#' + formId);
  }
  while (btn.parentElement) {
    btn = btn.parentElement;
    if (btn.tagName === 'FORM') {
      return btn;
    }
  }
}

function modifyButton(btn, stop) {
  let form;
  if (btn.tagName === 'A') {
    btn.setAttribute('href', trip.getUrl(stop));
    if (!btn.getAttribute('target')) {
      btn.setAttribute('target', 'furkot');
    }
  } else {
    form = findForm(btn);
    if (form) {
      form.setAttribute('action', trip.getUrl({}));
      if (!form.getAttribute('target')) {
        form.setAttribute('target', 'furkot');
      }
      if (!form.getAttribute('method')) {
        form.setAttribute('method', 'post');
      }
      insertInput.call({
        btn,
        prefix: 'stop',
        value: stop,
        form: btn.getAttribute('form')
      });
    }
  }
}

function insertInput(prop) {
  const btn = this.btn;
  let value = this.value;
  let prefix = this.prefix;
  const form = this.form;
  let attribs;
  if (prop) {
    value = value[prop];
    prefix = prefix + '[' + prop + ']';
  }
  if (typeof value === 'object') {
    return Object.keys(value).forEach(insertInput, {
      btn,
      prefix,
      value,
      form
    });
  }
  attribs = {
    type: 'hidden',
    name: prefix,
    value
  };
  if (form) {
    attribs.form = form;
  }
  btn.insertAdjacentHTML('afterend', el('input', '', attribs));
}

init(function () {
  const buttons = document.querySelectorAll('a.furkot-plan:not([href]),' +
    'form:not([action]) input[type="submit"].furkot-plan,' +
    'input[type="submit"][form]:not([formaction])');
  Array.prototype.forEach.call(document.querySelectorAll('[itemprop="geo"]'), function (node, i, nodes) {
    const item = data.item(node);
    let name;
    let coords;
    let stop;
    if (item) {
      coords = data.coordinates(node);
      if (coords) {
        stop = getStop(coords, item);
        if (buttons && i < buttons.length) {
          do {
            modifyButton(buttons.item(i), stop);
            i += nodes.length;
          } while (i < buttons.length);
        } else {
          if (stop.name) {
            name = 'Plan trip to ' + stop.name;
          } else {
            name = 'Plan trip';
          }
          item.insertAdjacentHTML('beforeend', el('a.furkot-plan', name, {
            href: trip.getUrl(stop),
            target: 'furkot'
          }));
        }
      }
    }
  });
  parseDone = true;
  done(onDone);
});
