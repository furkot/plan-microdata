var init = require('domready'),
  data = require('./data'),
  trip = require('furkot-trip')();

/*global window, document */

init(function () {
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[itemprop="geo"]'));
  nodes.forEach(function (node) {
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
        item.insertAdjacentHTML('beforeend', '<a class="furkot-plan" href="'
            + href + '" target="furkot">' + name + '</a>');
      }
    }
  });
});