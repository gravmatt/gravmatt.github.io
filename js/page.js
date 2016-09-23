/*!
  Copyright (c) 2015-2016 Rene Tanczos (@gravmatt)
  All rights reserved.

  Email: gravmatt@gmail.com

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.
*/

;(function(window, document, undefined){
    window.Typing = function(text, element, delays, start, done) {
        this.text = text;
        this.element = element;
        this.startDelay = delays.start || 1000;
        this.typeDelay = delays.type || 100;
        this.delay = this.startDelay;
        this.start = start;
        this.done = done;
        this.idx = 0;

        this.clearElement = function() {
            this.element.innerHTML = '';
        }

        this.type = function () {
            var self = this;

            setTimeout(function () {
                self.delay = self.typeDelay;

                if(self.start) {
                    self.start(self);
                    self.start = undefined;
                }

                if (self.idx < self.text.length) {
                    self.element.innerHTML += self.text[self.idx];
                    self.idx++;
                    self.type();
                }
                else {
                    if(self.done) self.done(self);
                }
            }, self.delay);
        }
    }
})(window, document);

(function (window, document, undefined) {

    var headerImage = new Image();
    headerImage.onload = function() {

        var header = document.getElementById('header');
        header.style.backgroundImage = 'url(' + headerImage.src + ')';
        window.onscroll = function() {
            header.style.backgroundPosition = 'center ' + (window.scrollY * .15) + 'px';
        };

        document.getElementById("wrapper").style.opacity = '1';

        var textfield = document.getElementById('passion');

        new Typing('hello, world!', textfield, {start:2000}, undefined, function(typing) {
            new Typing('code is my passion', textfield, {start:3000}, function(typing){
                typing.clearElement();
            }).type();
        }).type();
    };
    headerImage.src = 'media/workspace1s.jpg';


    // load my projects data
    // var xhrProjects = new XMLHttpRequest();
    // xhrProjects.open('GET', 'sourcehub.json', true);
    // xhrProjects.onreadystatechange = function () {
    //     if (xhrProjects.readyState !== 4 || xhrProjects.status !== 200) return;
    //     var json = JSON.parse(xhrProjects.responseText);
    //
    //     var dataContainer = document.getElementById('projects-data');
    //     var templateSource = document.getElementById('projects-template').innerHTML;
    //     var template = Handlebars.compile(templateSource);
    //     dataContainer.innerHTML = template(json);
    // };
    // xhrProjects.send();


    // Link Spy Object
    function LinkSpy() {

        this.links = [];
    }
    LinkSpy.prototype.init = function () {
        var spyLinks = document.querySelectorAll('.spy-link');
        for (var idx in spyLinks) {

            var link = spyLinks[idx];

            if (typeof link !== 'object') continue;

            var sectionID = link.firstChild.getAttribute('href');

            var section = document.querySelector(sectionID);

            this.links.push({
                link: link,
                section: section
            });
        }
    };
    LinkSpy.prototype.scrolling = function () {

        var tmpLink = null;

        for (var idx in this.links) {

            var el = this.links[idx];

            if (window.scrollY > el.section.offsetTop - 300)
                tmpLink = el;

            if (window.scrollY + window.innerHeight > document.body.scrollHeight - 20)
                tmpLink = el;
        }

        if (window.scrollY < this.links[0].section.offsetTop) {
            var prevLink = document.querySelector('li.active');
            if (prevLink) prevLink.classList.remove('active');
        }

        if (tmpLink && !tmpLink.link.classList.contains('active')) {
            var prevLink = document.querySelector('li.active');
            if (prevLink) prevLink.classList.remove('active');
            tmpLink.link.classList.add('active');
        }
    };

    var linkSpy = new LinkSpy();
    linkSpy.init();

    // caching navbar and second social bar
    var navbar = document.querySelector('#navbar');
    var social2 = document.getElementById('social2');

    window.addEventListener('scroll', function () {

        linkSpy.scrolling();

        if (window.scrollY > 270) {
            if (!navbar.classList.contains('navbar-move-top')) {
                navbar.classList.add('navbar-move-top');
                social2.style.opacity = '0';
            }
        } else {
            if (navbar.classList.contains('navbar-move-top')) {
                navbar.classList.remove('navbar-move-top');
                social2.style.opacity = '1';
            }
        }
    }, false);

    force.opt.cacheJumps = false;
    force.bindHashes();

    window.forcejsDemo = {
        easing: function(e) {
            force.opt.scrollEasing = e.value;
    		console.log('Scroll Easing: ' + e.value);
        },
        duration: function(e) {
            force.opt.jumpDuration = e.value;
    		console.log('Jump Duration: ' + e.value);
        }
    };

    Handlebars.registerHelper('first3', function(items, options) {
        var out = '';
        for(var i=0, len=items.length; i < len && i < 3; i++) {
            out += options.fn(items[i]);
        }
        return out;
    });

    $.getJSON('https://gravmatt.tumblr.com/api/read/json?callback=?', function(data) {
        $('#blog-description').text(data.tumblelog.description);
        var source = $("#blog-entry-template").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#blog-entries').html(html);
    });

    function getInstagramProfile(username, callback) {
        $.getJSON('https://instagram.iive.io/profile/' + username, callback);
    }

    getInstagramProfile('gravmatt', function(data) {
        $('#feed .profile .picture').css('background-image', 'url(' + data.profile_picture + ')');
        $('#feed .profile .info').html(data.biography.replace('\n', '<br>'));
        var source = $("#instagram-entry-template").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#feed .instagram-media').html(html);
    });
})(window, document);
