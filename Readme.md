
# Plan with Furkot buttons - microdata

  Adds **plan with Furkot** buttons to a page with [microdata]. [Furkot] - the online trip planner - will offer a user an option to add a place to their trip itinerary upon click on the **plan with Furkot** button.

## Installation

  Install with npm:

    $ npm install -S plan-microdata

  Install with [component(1)](http://component.io):

    $ component install furkot/plan-microdata

## API

  Automatically analyzes a page and adds a **Plan with Furkot** button (anchor element `<a class="furkot-plan">`) to every item that contains element annotated with `itemprop="geo"` and `itemtype="http://schema.org/GeoCoordinates"`. If the page already contains anchor elements `<a class="furkot-plan">` with no `href` attribute their `href` attributes are configured instead of creating new buttons. The existing anchor elements are used in the order the items are found on the page.

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

[Furkot]: https://trips.furkot.com
[microdata]: http://en.wikipedia.org/wiki/Microdata_(HTML)
