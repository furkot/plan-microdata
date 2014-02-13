var init = require('domready'),
  data = require('./data'),
  trip = require('furkot-trip')(),
  parseDone, onDone;

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

init(function () {
  var buttons = document.querySelectorAll('a.furkot-plan:not([href])');
  Array.prototype.forEach.call(document.querySelectorAll('[itemprop="geo"]'), function (node, i) {
    var item = data.item(node), name, coords, href;
    if (item) {
      coords = data.coordinates(node);
      if (coords) {
        name = data.text(item.querySelector('[itemprop="name"]'));
        href = trip.getUrl({
          name: name,
          address: data.address(item.querySelector('[itemprop="address"]')),
          coordinates: coords,
          notes: data.text(item.querySelector('[itemprop="description"]'), 256),
          url: window.location.href,
          pin: data.pin(item)
        });
        if (name) {
          name = 'Plan trip to ' + name;
        }
        else {
          name = 'Plan trip';
        }
        if (buttons && i < buttons.length) {
          buttons.item(i).setAttribute('href', href);
        }
        else {
          item.insertAdjacentHTML('beforeend', '<a class="furkot-plan" href="'
              + href + '" target="furkot">' + name + '</a>');
        }
      }
    }
  });
  parseDone = true;
  done(onDone);
});