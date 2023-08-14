const data = require('./data');
const trip = require('furkot-trip')();
let parseDone;
let onDone;

module.exports = done;

init();

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
  const { btn, form } = this;
  let { value, prefix } = this;
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
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = prefix;
  input.value = value;
  if (form) {
    input.form = form;
  }
  btn.insertAdjacentElement('afterend', input);
}

function init() {
  const buttons = document.querySelectorAll('a.furkot-plan:not([href]),' +
    'form:not([action]) input[type="submit"].furkot-plan,' +
    'input[type="submit"][form]:not([formaction])');
  document.querySelectorAll('[itemprop="geo"]').forEach(function (node, i, nodes) {
    const item = data.item(node);
    if (item) {
      const coords = data.coordinates(node);
      if (coords) {
        const stop = getStop(coords, item);
        if (buttons && i < buttons.length) {
          do {
            modifyButton(buttons.item(i), stop);
            i += nodes.length;
          } while (i < buttons.length);
        } else {
          const fp = document.createElement('a');
          fp.className = 'furkot-plan';
          fp.textContent = stop.name ? `Plan trip to ${stop.name}` : 'Plan trip';
          fp.href = trip.getUrl(stop);
          fp.target = 'furkot';
          item.insertAdjacentElement('beforeend', fp);
        }
      }
    }
  });
  parseDone = true;
  done(onDone);
}
