Tinytest.add("Router page", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo'
  });
  
  test.equal(Meteor.Router.page(), null);
  
  Meteor.Router.to('/foo')
  test.equal(Meteor.Router.page(), 'foo');
});

Tinytest.add("Router reactivity", function(test) {
  var context_called = 0;
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo',
    '/bar': 'bar'
  })
  
  Meteor.autorun(function() {
    Meteor.Router.page();
    context_called += 1;
  });
  
  test.equal(context_called, 1);
  
  Meteor.Router.to('/foo')
  Meteor.flush()
  test.equal(context_called, 2);
  
  Meteor.Router.to('/bar')
  Meteor.flush()
  test.equal(context_called, 3);
});

Tinytest.add("Router filtering", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo',
    '/bar': 'bar',
    '/baz': 'baz'
  })
  
  Meteor.Router.filters({
    'something_else': function() { return 'something_else'; },
    'third': function() { return 'a third thing' }
  })
  Meteor.Router.filter('something_else', {only: 'foo'});
  Meteor.Router.filter('third', {except: ['something_else', 'baz']});
  
  Meteor.Router.to('/foo');
  test.equal(Meteor.Router.page(), 'something_else');
  
  Meteor.Router.to('/bar');
  test.equal(Meteor.Router.page(), 'a third thing');
  
  Meteor.Router.to('/baz');
  test.equal(Meteor.Router.page(), 'baz');
});

Tinytest.add("FilteredRouter filter reactivity", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo'
  });
  
  Meteor.Router.filters({
    'something_else': function(page) {
      if (Session.get('something_else')) {
        return 'something_else';
      } else {
        return page;
      }
    }
  });
  Meteor.Router.filter('something_else');
  
  Session.set('something_else', null);
  Meteor.flush();
  Meteor.Router.to('/foo');
  test.equal(Meteor.Router.page(), 'foo');
  
  Session.set('something_else', true);
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'something_else');
});